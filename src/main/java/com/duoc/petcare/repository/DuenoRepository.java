package com.duoc.petcare.repository;

import com.duoc.petcare.entity.Dueno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DuenoRepository extends JpaRepository<Dueno, Long> {

    Optional<Dueno> findByRut(String rut);
}
