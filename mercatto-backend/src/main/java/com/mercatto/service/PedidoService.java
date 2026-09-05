package com.mercatto.service;

import com.mercatto.dto.request.PedidoRequest;
import com.mercatto.dto.response.PedidoResponse;
import com.mercatto.exception.BadRequestException;
import com.mercatto.exception.ResourceNotFoundException;
import com.mercatto.exception.UnauthorizedException;
import com.mercatto.model.*;
import com.mercatto.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired private PedidoRepository pedidoRepo;
    @Autowired private PedidoItemRepository itemRepo;
    @Autowired private ProductoRepository productoRepo;
    @Autowired private VarianteRepository varianteRepo;
    @Autowired private DireccionRepository direccionRepo;
    @Autowired private CuponRepository cuponRepo;
    @Autowired private PagoRepository pagoRepo;

    @Transactional
    public PedidoResponse crearPedido(PedidoRequest req, Usuario comprador) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new BadRequestException("El pedido debe tener al menos un producto");
        }

        // 1. Obtener o crear dirección
        Direccion direccion = null;
        if (req.getDireccionId() != null) {
            direccion = direccionRepo.findById(req.getDireccionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dirección de envío no encontrada"));
        } else if (req.getNuevaDireccion() != null) {
            PedidoRequest.DireccionDTO d = req.getNuevaDireccion();
            direccion = new Direccion();
            direccion.setUsuario(comprador);
            direccion.setNombreCompleto(d.getNombreCompleto());
            direccion.setTelefono(d.getTelefono());
            direccion.setDireccion(d.getDireccion());
            direccion.setBarrio(d.getBarrio());
            direccion.setCiudad(d.getCiudad());
            direccion.setDepartamento(d.getDepartamento());
            direccion.setCodigoPostal(d.getCodigoPostal());
            direccion.setNotasEntrega(d.getNotasEntrega());
            direccion = direccionRepo.save(direccion);
        }

        // 2. Procesar ítems y calcular totales
        double subtotal = 0.0;
        List<PedidoItem> items = new ArrayList<>();

        for (PedidoRequest.ItemDTO itemDto : req.getItems()) {
            Producto producto = productoRepo.findById(itemDto.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: ID " + itemDto.getProductoId()));

            if (!producto.isActivo()) {
                throw new BadRequestException("El producto '" + producto.getTitulo() + "' ya no está disponible.");
            }

            double precioUnitario = producto.getPrecioOferta() != null ? producto.getPrecioOferta() : producto.getPrecio();
            String nombreVariante = null;
            String imagenUrl = (producto.getImagenes() != null && !producto.getImagenes().isEmpty())
                    ? producto.getImagenes().get(0).getUrl() : null;

            ProductoVariante variante = null;
            if (itemDto.getVarianteId() != null) {
                variante = varianteRepo.findById(itemDto.getVarianteId())
                        .orElseThrow(() -> new ResourceNotFoundException("Variante no encontrada: ID " + itemDto.getVarianteId()));

                if (variante.getStock() < itemDto.getCantidad()) {
                    throw new BadRequestException("Stock insuficiente para '" + producto.getTitulo() + " (" + variante.getNombre() + ")'");
                }
                precioUnitario = variante.getPrecioOferta() != null ? variante.getPrecioOferta() : variante.getPrecio();
                nombreVariante = variante.getNombre();
                if (variante.getImagenUrl() != null) {
                    imagenUrl = variante.getImagenUrl();
                }
                // Descontar stock de variante
                variante.setStock(variante.getStock() - itemDto.getCantidad());
                varianteRepo.save(variante);
            } else {
                if (producto.getStock() < itemDto.getCantidad()) {
                    throw new BadRequestException("Stock insuficiente para '" + producto.getTitulo() + "'");
                }
                // Descontar stock de producto
                producto.setStock(producto.getStock() - itemDto.getCantidad());
            }

            // Incrementar ventas del producto
            producto.setTotalVentas(producto.getTotalVentas() + itemDto.getCantidad());
            productoRepo.save(producto);

            PedidoItem item = new PedidoItem();
            item.setProducto(producto);
            item.setVariante(variante);
            item.setVendedor(producto.getVendedor());
            item.setNombreProducto(producto.getTitulo());
            item.setNombreVariante(nombreVariante);
            item.setImagenUrl(imagenUrl);
            item.setPrecioUnitario(precioUnitario);
            item.setCantidad(itemDto.getCantidad());
            double itemSubtotal = precioUnitario * itemDto.getCantidad();
            item.setSubtotal(itemSubtotal);

            items.add(item);
            subtotal += itemSubtotal;
        }

        // 3. Cupón de descuento
        double descuento = 0.0;
        Cupon cupon = null;
        if (req.getCuponCodigo() != null && !req.getCuponCodigo().isBlank()) {
            cupon = cuponRepo.findByCodigoIgnoreCaseAndActivoTrue(req.getCuponCodigo()).orElse(null);
            if (cupon != null && cupon.esValidoParaMonto(subtotal)) {
                descuento = cupon.calcularDescuento(subtotal);
                cupon.setUsosActuales(cupon.getUsosActuales() + 1);
                cuponRepo.save(cupon);
            }
        }

        // 4. Costo de envío (ej: Gratis a partir de 150.000 COP, o tarifa estándar 12.000 COP)
        double costoEnvio = (subtotal >= 150000) ? 0.0 : 12000.0;
        double total = Math.max(0.0, (subtotal - descuento) + costoEnvio);

        // 5. Crear el Pedido
        Pedido pedido = new Pedido();
        pedido.setCodigo(generarCodigoPedido());
        pedido.setComprador(comprador);
        pedido.setDireccion(direccion);
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
        pedido.setSubtotal(subtotal);
        pedido.setDescuento(descuento);
        pedido.setCostoEnvio(costoEnvio);
        pedido.setTotal(total);
        pedido.setCupon(cupon);
        pedido.setNotas(req.getNotas());

        Pedido guardado = pedidoRepo.save(pedido);

        // Asociar y guardar ítems
        for (PedidoItem item : items) {
            item.setPedido(guardado);
        }
        itemRepo.saveAll(items);
        guardado.setItems(items);

        // Crear registro de pago
        Pago pago = new Pago();
        pago.setPedido(guardado);
        try {
            pago.setMetodo(Pago.MetodoPago.valueOf(req.getMetodoPago().toUpperCase()));
        } catch (Exception e) {
            pago.setMetodo(Pago.MetodoPago.STRIPE);
        }
        pago.setEstado(Pago.EstadoPago.PENDIENTE);
        pago.setMonto(total);
        pagoRepo.save(pago);
        guardado.setPago(pago);

        return convertirAResponse(guardado);
    }

    public Page<PedidoResponse> listarPorComprador(Usuario comprador, int pagina, int tamano) {
        Pageable pageable = PageRequest.of(pagina, tamano);
        return pedidoRepo.findByCompradorOrderByFechaCreacionDesc(comprador, pageable).map(this::convertirAResponse);
    }

    public Page<PedidoResponse> listarPorVendedor(Vendedor vendedor, int pagina, int tamano) {
        Pageable pageable = PageRequest.of(pagina, tamano);
        return pedidoRepo.findByVendedor(vendedor, pageable).map(this::convertirAResponse);
    }

    public PedidoResponse obtenerPorId(Long id, Usuario usuario) {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        boolean esComprador = pedido.getComprador().getId().equals(usuario.getId());
        boolean esAdmin = usuario.getRol() == Usuario.Rol.ADMIN;
        boolean esVendedorDelPedido = pedido.getItems().stream()
                .anyMatch(i -> i.getVendedor().getUsuario().getId().equals(usuario.getId()));

        if (!esComprador && !esAdmin && !esVendedorDelPedido) {
            throw new UnauthorizedException("No tienes permiso para ver este pedido.");
        }

        return convertirAResponse(pedido);
    }

    @Transactional
    public PedidoResponse actualizarEstado(Long id, String nuevoEstadoStr, String guia, String empresa) {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        Pedido.EstadoPedido nuevoEstado = Pedido.EstadoPedido.valueOf(nuevoEstadoStr.toUpperCase());
        pedido.setEstado(nuevoEstado);

        if (guia != null) pedido.setGuiaSeguimiento(guia);
        if (empresa != null) pedido.setEmpresaEnvio(empresa);

        if (nuevoEstado == Pedido.EstadoPedido.PAGADO && pedido.getPago() != null) {
            pedido.getPago().setEstado(Pago.EstadoPago.APROBADO);
            pedido.getPago().setFechaPago(LocalDateTime.now());
            pagoRepo.save(pedido.getPago());
        }

        return convertirAResponse(pedidoRepo.save(pedido));
    }

    public PedidoResponse convertirAResponse(Pedido p) {
        PedidoResponse res = new PedidoResponse();
        res.setId(p.getId());
        res.setCodigo(p.getCodigo());
        res.setEstado(p.getEstado().name());
        res.setSubtotal(p.getSubtotal());
        res.setDescuento(p.getDescuento());
        res.setCostoEnvio(p.getCostoEnvio());
        res.setTotal(p.getTotal());
        res.setGuiaSeguimiento(p.getGuiaSeguimiento());
        res.setEmpresaEnvio(p.getEmpresaEnvio());
        res.setFechaCreacion(p.getFechaCreacion());

        if (p.getPago() != null) {
            res.setMetodoPago(p.getPago().getMetodo().name());
            res.setEstadoPago(p.getPago().getEstado().name());
        }

        if (p.getComprador() != null) {
            PedidoResponse.CompradorDTO cDto = new PedidoResponse.CompradorDTO();
            cDto.setId(p.getComprador().getId());
            cDto.setNombre(p.getComprador().getNombre());
            cDto.setEmail(p.getComprador().getEmail());
            res.setComprador(cDto);
        }

        if (p.getDireccion() != null) {
            PedidoResponse.DireccionDTO dDto = new PedidoResponse.DireccionDTO();
            dDto.setNombreCompleto(p.getDireccion().getNombreCompleto());
            dDto.setTelefono(p.getDireccion().getTelefono());
            dDto.setDireccion(p.getDireccion().getDireccion());
            dDto.setCiudad(p.getDireccion().getCiudad());
            dDto.setDepartamento(p.getDireccion().getDepartamento());
            res.setDireccion(dDto);
        }

        if (p.getItems() != null) {
            res.setItems(p.getItems().stream().map(i -> {
                PedidoResponse.ItemDTO itemDto = new PedidoResponse.ItemDTO();
                itemDto.setId(i.getId());
                itemDto.setProductoId(i.getProducto().getId());
                itemDto.setNombreProducto(i.getNombreProducto());
                itemDto.setNombreVariante(i.getNombreVariante());
                itemDto.setImagenUrl(i.getImagenUrl());
                itemDto.setPrecioUnitario(i.getPrecioUnitario());
                itemDto.setCantidad(i.getCantidad());
                itemDto.setSubtotal(i.getSubtotal());
                itemDto.setVendedorId(i.getVendedor().getId());
                itemDto.setNombreTienda(i.getVendedor().getNombreTienda());
                return itemDto;
            }).collect(Collectors.toList()));
        }

        return res;
    }

    private String generarCodigoPedido() {
        String fecha = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int rand = 1000 + new Random().nextInt(9000);
        return "PED-" + fecha + "-" + rand;
    }
}
