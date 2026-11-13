package com.duoc.petcare.repository;

import com.duoc.petcare.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CitaRepository extends JpaRepository<Cita, Long> {

    List<Cita> findByMascotaId(Long mascotaId);
}
