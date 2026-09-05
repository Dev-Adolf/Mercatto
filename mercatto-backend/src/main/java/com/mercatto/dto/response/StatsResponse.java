package com.mercatto.dto.response;

import java.util.Map;

public class StatsResponse {
    private long totalUsuarios;
    private long totalVendedores;
    private long totalVendedoresPendientes;
    private long totalProductos;
    private long totalPedidos;
    private Double ingresosTotales;
    private Double ingresosMes;
    private Map<String, Long> pedidosPorEstado;

    public StatsResponse() {}

    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }

    public long getTotalVendedores() { return totalVendedores; }
    public void setTotalVendedores(long totalVendedores) { this.totalVendedores = totalVendedores; }

    public long getTotalVendedoresPendientes() { return totalVendedoresPendientes; }
    public void setTotalVendedoresPendientes(long totalVendedoresPendientes) { this.totalVendedoresPendientes = totalVendedoresPendientes; }

    public long getTotalProductos() { return totalProductos; }
    public void setTotalProductos(long totalProductos) { this.totalProductos = totalProductos; }

    public long getTotalPedidos() { return totalPedidos; }
    public void setTotalPedidos(long totalPedidos) { this.totalPedidos = totalPedidos; }

    public Double getIngresosTotales() { return ingresosTotales; }
    public void setIngresosTotales(Double ingresosTotales) { this.ingresosTotales = ingresosTotales; }

    public Double getIngresosMes() { return ingresosMes; }
    public void setIngresosMes(Double ingresosMes) { this.ingresosMes = ingresosMes; }

    public Map<String, Long> getPedidosPorEstado() { return pedidosPorEstado; }
    public void setPedidosPorEstado(Map<String, Long> pedidosPorEstado) { this.pedidosPorEstado = pedidosPorEstado; }
}
