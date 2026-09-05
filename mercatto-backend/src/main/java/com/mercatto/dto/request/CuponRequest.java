package com.mercatto.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

public class CuponRequest {

    @NotBlank(message = "El código de cupón es obligatorio")
    private String codigo;

    private String tipo = "PORCENTAJE";

    @NotNull(message = "El valor del descuento es obligatorio")
    @Positive(message = "El valor debe ser positivo")
    private Double valor;

    private Double montoMinimo = 0.0;
    private Double descuentoMaximo;
    private Integer usosMaximos;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private boolean activo = true;

    public CuponRequest() {}

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }

    public Double getMontoMinimo() { return montoMinimo; }
    public void setMontoMinimo(Double montoMinimo) { this.montoMinimo = montoMinimo; }

    public Double getDescuentoMaximo() { return descuentoMaximo; }
    public void setDescuentoMaximo(Double descuentoMaximo) { this.descuentoMaximo = descuentoMaximo; }

    public Integer getUsosMaximos() { return usosMaximos; }
    public void setUsosMaximos(Integer usosMaximos) { this.usosMaximos = usosMaximos; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
