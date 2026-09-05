package com.mercatto.repository;

import com.mercatto.model.Direccion;
import com.mercatto.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    List<Direccion> findByUsuario(Usuario usuario);
    Optional<Direccion> findByUsuarioAndEsPrincipalTrue(Usuario usuario);
}
