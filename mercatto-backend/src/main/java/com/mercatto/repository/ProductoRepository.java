package com.mercatto.repository;

import com.mercatto.model.Categoria;
import com.mercatto.model.Producto;
import com.mercatto.model.Vendedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long>, JpaSpecificationExecutor<Producto> {

    Optional<Producto> findBySlug(String slug);
    Optional<Producto> findByIdAndActivoTrue(Long id);
    Optional<Producto> findBySlugAndActivoTrue(String slug);
    boolean existsBySlug(String slug);

    Page<Producto> findByActivoTrue(Pageable pageable);
    Page<Producto> findByVendedor(Vendedor vendedor, Pageable pageable);
    Page<Producto> findByCategoriaAndActivoTrue(Categoria categoria, Pageable pageable);
    Page<Producto> findByDestacadoTrueAndActivoTrue(Pageable pageable);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(LOWER(p.titulo) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(p.marca) LIKE LOWER(CONCAT('%', :termino, '%')))")
    Page<Producto> buscarPorTexto(@Param("termino") String termino, Pageable pageable);

    @Query("SELECT p FROM Producto p WHERE p.activo = true AND " +
           "(:categoriaId IS NULL OR p.categoria.id = :categoriaId OR p.categoria.padre.id = :categoriaId) AND " +
           "(:precioMin IS NULL OR p.precio >= :precioMin) AND " +
           "(:precioMax IS NULL OR p.precio <= :precioMax) AND " +
           "(:termino IS NULL OR LOWER(p.titulo) LIKE LOWER(CONCAT('%', :termino, '%')) OR LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')))")
    Page<Producto> filtrarCatalogo(
        @Param("categoriaId") Long categoriaId,
        @Param("precioMin") Double precioMin,
        @Param("precioMax") Double precioMax,
        @Param("termino") String termino,
        Pageable pageable
    );

    List<Producto> findTop8ByActivoTrueOrderByFechaCreacionDesc();
    List<Producto> findTop8ByDestacadoTrueAndActivoTrueOrderByTotalVentasDesc();
    long countByVendedor(Vendedor vendedor);
}
