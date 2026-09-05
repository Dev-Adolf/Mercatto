package com.mercatto.controller;

import com.mercatto.security.JwtUtil;
import com.mercatto.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthService authService;
    @Autowired private JwtUtil jwtUtil;

    // POST /api/auth/registro
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Map<String, Object> datos) {
        Map<String, Object> res = authService.registrar(datos);
        int status = Boolean.TRUE.equals(res.get("exito")) ? 201 : 400;
        return ResponseEntity.status(status).body(res);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos) {
        Map<String, Object> res = authService.login(
            datos.get("email"), datos.get("password"));
        int status = Boolean.TRUE.equals(res.get("exito")) ? 200 : 401;
        return ResponseEntity.status(status).body(res);
    }

    // POST /api/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> datos) {
        Map<String, Object> res = authService.refresh(datos.get("refreshToken"));
        int status = Boolean.TRUE.equals(res.get("exito")) ? 200 : 401;
        return ResponseEntity.status(status).body(res);
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails != null)
            authService.logout(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("exito", true, "mensaje", "Sesión cerrada."));
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null)
            return ResponseEntity.status(401).body(Map.of("exito", false));
        return ResponseEntity.ok(Map.of(
            "exito", true,
            "email", userDetails.getUsername(),
            "rol", userDetails.getAuthorities().iterator().next().getAuthority()
        ));
    }
}
