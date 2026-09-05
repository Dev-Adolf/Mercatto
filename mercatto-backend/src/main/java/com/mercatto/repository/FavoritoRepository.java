package com.mercatto.repository;

import com.mercatto.model.Favorito;
import com.mercatto.model.Producto;
import com.mercatto.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    Page<Favorito> findByUsuarioOrderByFechaAgregadoDesc(Usuario usuario, Pageable pageable);
    Optional<Favorito> findByUsuarioAndProducto(Usuario usuario, Producto producto);
    boolean existsByUsuarioAndProducto(Usuario usuario, Producto producto);
    void deleteByUsuarioAndProducto(Usuario usuario, Producto producto);
}
