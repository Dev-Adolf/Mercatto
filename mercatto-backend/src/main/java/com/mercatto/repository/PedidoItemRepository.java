package com.mercatto.repository;

import com.mercatto.model.Pedido;
import com.mercatto.model.PedidoItem;
import com.mercatto.model.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {
    List<PedidoItem> findByPedido(Pedido pedido);
    List<PedidoItem> findByVendedor(Vendedor vendedor);
}
