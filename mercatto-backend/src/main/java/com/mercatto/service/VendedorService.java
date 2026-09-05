package com.mercatto.service;

import com.mercatto.dto.response.VendedorResponse;
import com.mercatto.exception.ResourceNotFoundException;
import com.mercatto.model.Usuario;
import com.mercatto.model.Vendedor;
import com.mercatto.repository.PedidoRepository;
import com.mercatto.repository.ProductoRepository;
import com.mercatto.repository.VendedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class VendedorService {

    @Autowired private VendedorRepository vendedorRepo;
    @Autowired private ProductoRepository productoRepo;
    @Autowired private PedidoRepository pedidoRepo;

    public Vendedor obtenerPorUsuario(Usuario usuario) {
        return vendedorRepo.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("No tienes un perfil de vendedor activo"));
    }

    public VendedorResponse obtenerPerfilResponse(Usuario usuario) {
        Vendedor v = obtenerPorUsuario(usuario);
        return convertirAResponse(v);
    }

    @Transactional
    public VendedorResponse actualizarPerfil(Usuario usuario, Map<String, String> datos) {
        Vendedor v = obtenerPorUsuario(usuario);
        if (datos.containsKey("nombreTienda")) v.setNombreTienda(datos.get("nombreTienda"));
        if (datos.containsKey("descripcion")) v.setDescripcion(datos.get("descripcion"));
        if (datos.containsKey("logoUrl")) v.setLogoUrl(datos.get("logoUrl"));
        if (datos.containsKey("ciudad")) v.setCiudad(datos.get("ciudad"));
        if (datos.containsKey("direccion")) v.setDireccion(datos.get("direccion"));
        if (datos.containsKey("cuentaBancaria")) v.setCuentaBancaria(datos.get("cuentaBancaria"));
        if (datos.containsKey("banco")) v.setBanco(datos.get("banco"));

        return convertirAResponse(vendedorRepo.save(v));
    }

    public Map<String, Object> obtenerEstadisticas(Vendedor vendedor) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProductos", productoRepo.countByVendedor(vendedor));
        stats.put("totalPedidos", pedidoRepo.countByVendedor(vendedor));
        stats.put("ingresosTotales", pedidoRepo.sumIngresosByVendedor(vendedor));
        stats.put("calificacion", vendedor.getCalificacion());
        stats.put("totalVentas", vendedor.getTotalVentas());
        return stats;
    }

    public VendedorResponse convertirAResponse(Vendedor v) {
        VendedorResponse res = new VendedorResponse();
        res.setId(v.getId());
        res.setUsuarioId(v.getUsuario().getId());
        res.setEmail(v.getUsuario().getEmail());
        res.setNombrePropietario(v.getUsuario().getNombre());
        res.setNombreTienda(v.getNombreTienda());
        res.setDescripcion(v.getDescripcion());
        res.setLogoUrl(v.getLogoUrl());
        res.setTipo(v.getTipo().name());
        res.setEstado(v.getEstado().name());
        res.setNitCedula(v.getNitCedula());
        res.setRazonSocial(v.getRazonSocial());
        res.setCiudad(v.getCiudad());
        res.setDireccion(v.getDireccion());
        res.setCalificacion(v.getCalificacion());
        res.setTotalVentas(v.getTotalVentas());
        res.setFechaRegistro(v.getFechaRegistro());
        res.setIngresosTotales(pedidoRepo.sumIngresosByVendedor(v));
        return res;
    }
}
