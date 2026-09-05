package com.mercatto.service;

import com.mercatto.exception.BadRequestException;
import com.mercatto.exception.ResourceNotFoundException;
import com.mercatto.model.Pago;
import com.mercatto.model.Pedido;
import com.mercatto.model.Usuario;
import com.mercatto.repository.PagoRepository;
import com.mercatto.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class PagoService {

    @Autowired private PagoRepository pagoRepo;
    @Autowired private PedidoRepository pedidoRepo;
    @Autowired private StripeService stripeService;

    @Transactional
    public Map<String, Object> iniciarPago(Long pedidoId, String metodoStr, Usuario usuario) {
        Pedido pedido = pedidoRepo.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        if (!pedido.getComprador().getId().equals(usuario.getId())) {
            throw new BadRequestException("No puedes pagar un pedido que no te pertenece");
        }

        if (pedido.getEstado() != Pedido.EstadoPedido.PENDIENTE) {
            throw new BadRequestException("El pedido ya se encuentra en estado: " + pedido.getEstado());
        }

        Pago pago = pagoRepo.findByPedido(pedido).orElseGet(() -> {
            Pago p = new Pago();
            p.setPedido(pedido);
            p.setMonto(pedido.getTotal());
            return p;
        });

        Pago.MetodoPago metodo;
        try {
            metodo = Pago.MetodoPago.valueOf(metodoStr.toUpperCase());
        } catch (Exception e) {
            metodo = Pago.MetodoPago.STRIPE;
        }
        pago.setMetodo(metodo);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("pedidoId", pedido.getId());
        respuesta.put("codigoPedido", pedido.getCodigo());
        respuesta.put("monto", pedido.getTotal());
        respuesta.put("metodo", metodo.name());

        if (metodo == Pago.MetodoPago.STRIPE || metodo == Pago.MetodoPago.TARJETA_CREDITO) {
            Map<String, Object> intent = stripeService.crearPaymentIntent(
                    pedido.getTotal(), pedido.getCodigo(), usuario.getEmail()
            );
            pago.setTransaccionId((String) intent.get("paymentIntentId"));
            respuesta.putAll(intent);
        } else if (metodo == Pago.MetodoPago.PSE || metodo == Pago.MetodoPago.NEQUI) {
            String ref = "PSE-" + pedido.getCodigo();
            pago.setTransaccionId(ref);
            respuesta.put("referencia", ref);
            respuesta.put("instrucciones", "Transfiere el monto de $" + pedido.getTotal() + " a la cuenta Nequi/PSE del Marketplace.");
        }

        pagoRepo.save(pago);
        return respuesta;
    }

    @Transactional
    public Map<String, Object> confirmarPago(Long pedidoId, String transaccionId, Usuario usuario) {
        Pedido pedido = pedidoRepo.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado"));

        Pago pago = pagoRepo.findByPedido(pedido)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de pago no encontrado"));

        pago.setEstado(Pago.EstadoPago.APROBADO);
        pago.setTransaccionId(transaccionId != null ? transaccionId : pago.getTransaccionId());
        pago.setFechaPago(LocalDateTime.now());
        pagoRepo.save(pago);

        pedido.setEstado(Pedido.EstadoPedido.PAGADO);
        pedidoRepo.save(pedido);

        return Map.of(
                "exito", true,
                "mensaje", "¡Pago confirmado exitosamente! Tu pedido está en preparación.",
                "codigoPedido", pedido.getCodigo(),
                "estado", pedido.getEstado().name()
        );
    }
}
