package com.mercatto.repository;

import com.mercatto.model.Producto;
import com.mercatto.model.ProductoVariante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VarianteRepository extends JpaRepository<ProductoVariante, Long> {
    List<ProductoVariante> findByProducto(Producto producto);
    void deleteByProducto(Producto producto);
}
