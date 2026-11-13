package com.duoc.petcare.service;

import com.duoc.petcare.entity.Cita;
import com.duoc.petcare.entity.Dueno;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.repository.CitaRepository;
import com.duoc.petcare.repository.MascotaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;
    private final CitaRepository citaRepository;
    private final DuenoService duenoService;

    public MascotaService(MascotaRepository mascotaRepository, CitaRepository citaRepository, DuenoService duenoService) {
        this.mascotaRepository = mascotaRepository;
        this.citaRepository = citaRepository;
        this.duenoService = duenoService;
    }

    public List<Mascota> getAll() {
        return mascotaRepository.findAll();
    }

    public Mascota getById(Long id) {
        return mascotaRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe una mascota con id " + id));
    }

    public Mascota create(Mascota mascota) {
        mascota.setId(null);
        mascota.setDueno(buscarDueno(mascota.getDueno()));
        return mascotaRepository.save(mascota);
    }

    public Mascota update(Long id, Mascota datos) {
        Mascota existente = getById(id);

        existente.setNombre(datos.getNombre());
        existente.setEspecie(datos.getEspecie());
        existente.setRaza(datos.getRaza());
        existente.setFechaNacimiento(datos.getFechaNacimiento());

        // El dueño es opcional en el PUT: solo se cambia si viene en el body
        if (datos.getDueno() != null) {
            existente.setDueno(buscarDueno(datos.getDueno()));
        }
        return mascotaRepository.save(existente);
    }

    public void delete(Long id) {
        Mascota mascota = getById(id);
        if (!citaRepository.findByMascotaId(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar: la mascota tiene citas registradas");
        }
        mascotaRepository.delete(mascota);
    }

    public List<Cita> getCitas(Long mascotaId) {
        getById(mascotaId); // si la mascota no existe responde 404
        return citaRepository.findByMascotaId(mascotaId);
    }

    // Validación: la mascota debe pertenecer a un dueño que exista
    private Dueno buscarDueno(Dueno referencia) {
        if (referencia == null || referencia.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar el dueño: \"dueno\": {\"id\": 1}");
        }
        return duenoService.getById(referencia.getId());
    }
}
