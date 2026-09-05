package com.mercatto.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MensajeRequest {

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productoId;

    private Long pedidoId;
    private String asunto = "Consulta sobre el producto";

    @NotBlank(message = "El mensaje no puede estar vacío")
    private String mensaje;

    public MensajeRequest() {}

    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }

    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }

    public String getAsunto() { return asunto; }
    public void setAsunto(String asunto) { this.asunto = asunto; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}
