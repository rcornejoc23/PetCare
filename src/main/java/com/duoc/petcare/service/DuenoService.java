package com.duoc.petcare.service;

import com.duoc.petcare.entity.Dueno;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.repository.DuenoRepository;
import com.duoc.petcare.repository.MascotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DuenoService {

    private final DuenoRepository duenoRepository;
    private final MascotaRepository mascotaRepository;

    public DuenoService(DuenoRepository duenoRepository, MascotaRepository mascotaRepository) {
        this.duenoRepository = duenoRepository;
        this.mascotaRepository = mascotaRepository;
    }

    public List<Dueno> getAll() {
        return duenoRepository.findAll();
    }

    public Dueno getById(Long id) {
        return duenoRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe un dueño con id " + id));
    }

    public Dueno create(Dueno dueno) {
        dueno.setId(null);
        duenoRepository.findByRut(dueno.getRut()).ifPresent(d -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un dueño con el rut " + dueno.getRut());
        });
        return duenoRepository.save(dueno);
    }

    public Dueno update(Long id, Dueno datos) {
        Dueno existente = getById(id);

        duenoRepository.findByRut(datos.getRut())
                .filter(d -> !d.getId().equals(id))
                .ifPresent(d -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe otro dueño con el rut " + datos.getRut());
                });

        existente.setRut(datos.getRut());
        existente.setNombre(datos.getNombre());
        existente.setTelefono(datos.getTelefono());
        existente.setEmail(datos.getEmail());
        return duenoRepository.save(existente);
    }

    public void delete(Long id) {
        Dueno dueno = getById(id);
        if (!mascotaRepository.findByDuenoId(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar: el dueño tiene mascotas registradas");
        }
        duenoRepository.delete(dueno);
    }

    public List<Mascota> getMascotas(Long duenoId) {
        getById(duenoId); // si el dueño no existe responde 404
        return mascotaRepository.findByDuenoId(duenoId);
    }
}
