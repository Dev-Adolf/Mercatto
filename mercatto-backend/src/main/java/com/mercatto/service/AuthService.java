package com.mercatto.service;

import com.mercatto.model.*;
import com.mercatto.repository.*;
import com.mercatto.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AuthService {

    @Autowired private UsuarioRepository  usuarioRepo;
    @Autowired private VendedorRepository vendedorRepo;
    @Autowired private RefreshTokenRepository refreshRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    // ── Brute-force protection ────────────────────────────────────
    private static final int  MAX_INTENTOS = 5;
    private static final long BLOQUEO_MS   = 15 * 60 * 1000L;
    private final Map<String, AtomicInteger> intentos      = new ConcurrentHashMap<>();
    private final Map<String, Long>          bloqueadoHasta = new ConcurrentHashMap<>();

    private boolean estaBloqueado(String email) {
        Long hasta = bloqueadoHasta.get(email);
        if (hasta == null) return false;
        if (System.currentTimeMillis() < hasta) return true;
        bloqueadoHasta.remove(email);
        intentos.remove(email);
        return false;
    }

    private void registrarIntento(String email, boolean exitoso) {
        if (exitoso) {
            intentos.remove(email);
            bloqueadoHasta.remove(email);
            return;
        }
        AtomicInteger n = intentos.computeIfAbsent(email, k -> new AtomicInteger(0));
        if (n.incrementAndGet() >= MAX_INTENTOS)
            bloqueadoHasta.put(email, System.currentTimeMillis() + BLOQUEO_MS);
    }

    // ── REGISTRO ──────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> registrar(Map<String, Object> datos) {
        Map<String, Object> res = new HashMap<>();
        String email    = (String) datos.get("email");
        String nombre   = (String) datos.get("nombre");
        String password = (String) datos.get("password");
        String rolStr   = (String) datos.getOrDefault("rol", "COMPRADOR");

        if (usuarioRepo.existsByEmail(email)) {
            res.put("exito", false);
            res.put("mensaje", "El correo " + email + " ya está registrado.");
            return res;
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(Usuario.Rol.valueOf(rolStr));
        usuario.setActivo(!"VENDEDOR".equals(rolStr));
        Usuario guardado = usuarioRepo.save(usuario);

        if ("VENDEDOR".equals(rolStr)) {
            @SuppressWarnings("unchecked")
            Map<String, String> datosVendedor = (Map<String, String>) datos.get("vendedor");
            Vendedor vendedor = new Vendedor();
            vendedor.setUsuario(guardado);
            vendedor.setNombreTienda(datosVendedor.get("nombreTienda"));
            vendedor.setTipo(Vendedor.Tipo.valueOf(
                datosVendedor.getOrDefault("tipo", "PERSONA_NATURAL")));
            vendedor.setNitCedula(datosVendedor.get("nitCedula"));
            vendedor.setCiudad(datosVendedor.get("ciudad"));
            vendedor.setEstado(Vendedor.Estado.PENDIENTE);
            vendedorRepo.save(vendedor);

            res.put("exito", true);
            res.put("pendiente", true);
            res.put("mensaje", "Solicitud enviada. El administrador la revisará pronto.");
        } else {
            String accessToken  = jwtUtil.generarAccessToken(email, rolStr);
            String refreshToken = jwtUtil.generarRefreshToken(email);
            guardarRefreshToken(guardado, refreshToken);

            res.put("exito", true);
            res.put("accessToken", accessToken);
            res.put("refreshToken", refreshToken);
            res.put("usuario", usuarioAMapa(guardado));
            res.put("mensaje", "¡Bienvenido a Mercatto!");
        }
        return res;
    }

    // ── LOGIN ─────────────────────────────────────────────────────
    @Transactional
    public Map<String, Object> login(String email, String password) {
        Map<String, Object> res = new HashMap<>();

        if (estaBloqueado(email)) {
            res.put("exito", false);
            res.put("mensaje", "Demasiados intentos fallidos. Espera 15 minutos.");
            return res;
        }

        Optional<Usuario> opt = usuarioRepo.findByEmail(email);
        if (opt.isEmpty() || !passwordEncoder.matches(password, opt.get().getPassword())) {
            registrarIntento(email, false);
            res.put("exito", false);
            res.put("mensaje", "Correo o contraseña incorrectos.");
            return res;
        }

        Usuario usuario = opt.get();

        if (!usuario.isActivo()) {
            if (usuario.getRol() == Usuario.Rol.VENDEDOR) {
                res.put("exito", false);
                res.put("pendiente", true);
                res.put("mensaje", "Tu cuenta está pendiente de aprobación.");
            } else {
                res.put("exito", false);
                res.put("mensaje", "Tu cuenta está suspendida. Contacta al soporte.");
            }
            return res;
        }

        registrarIntento(email, true);
        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepo.save(usuario);

        String accessToken  = jwtUtil.generarAccessToken(email, usuario.getRol().name());
        String refreshToken = jwtUtil.generarRefreshToken(email);
        guardarRefreshToken(usuario, refreshToken);

        res.put("exito", true);
        res.put("accessToken", accessToken);
        res.put("refreshToken", refreshToken);
        res.put("usuario", usuarioAMapa(usuario));
        return res;
    }

    // ── REFRESH TOKEN ─────────────────────────────────────────────
    @Transactional
    public Map<String, Object> refresh(String refreshToken) {
        Map<String, Object> res = new HashMap<>();
        Optional<RefreshToken> opt = refreshRepo.findByToken(refreshToken);

        if (opt.isEmpty() || !opt.get().esValido()) {
            res.put("exito", false);
            res.put("mensaje", "Token inválido o expirado.");
            return res;
        }

        Usuario usuario = opt.get().getUsuario();
        String nuevoAccess = jwtUtil.generarAccessToken(
            usuario.getEmail(), usuario.getRol().name());

        res.put("exito", true);
        res.put("accessToken", nuevoAccess);
        return res;
    }

    // ── LOGOUT ────────────────────────────────────────────────────
    @Transactional
    public void logout(String email) {
        usuarioRepo.findByEmail(email)
            .ifPresent(u -> refreshRepo.revocarTokensDeUsuario(u));
    }

    // ── Helpers ───────────────────────────────────────────────────
    private void guardarRefreshToken(Usuario usuario, String token) {
        RefreshToken rt = new RefreshToken();
        rt.setUsuario(usuario);
        rt.setToken(token);
        rt.setExpiracion(LocalDateTime.now().plusDays(7));
        refreshRepo.save(rt);
    }

    private Map<String, Object> usuarioAMapa(Usuario u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",        u.getId());
        m.put("nombre",    u.getNombre());
        m.put("email",     u.getEmail());
        m.put("rol",       u.getRol().name());
        m.put("activo",    u.isActivo());
        m.put("fotoPerfil",u.getFotoPerfil());
        return m;
    }
}
