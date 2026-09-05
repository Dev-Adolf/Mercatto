package com.mercatto.repository;

import com.mercatto.model.CarritoItem;
import com.mercatto.model.Producto;
import com.mercatto.model.ProductoVariante;
import com.mercatto.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarritoItemRepository extends JpaRepository<CarritoItem, Long> {
    List<CarritoItem> findByUsuarioOrderByFechaAgregadoDesc(Usuario usuario);
    Optional<CarritoItem> findByUsuarioAndProductoAndVariante(Usuario usuario, Producto producto, ProductoVariante variante);
    Optional<CarritoItem> findByUsuarioAndProductoAndVarianteIsNull(Usuario usuario, Producto producto);
    void deleteByUsuario(Usuario usuario);
}
