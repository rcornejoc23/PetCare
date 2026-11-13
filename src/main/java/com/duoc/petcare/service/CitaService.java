package com.duoc.petcare.service;

import com.duoc.petcare.entity.Cita;
import com.duoc.petcare.entity.Mascota;
import com.duoc.petcare.repository.CitaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CitaService {

    private final CitaRepository citaRepository;
    private final MascotaService mascotaService;

    public CitaService(CitaRepository citaRepository, MascotaService mascotaService) {
        this.citaRepository = citaRepository;
        this.mascotaService = mascotaService;
    }

    public List<Cita> getAll() {
        return citaRepository.findAll();
    }

    public Cita getById(Long id) {
        return citaRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe una cita con id " + id));
    }

    public Cita create(Cita cita) {
        cita.setId(null);
        cita.setMascota(buscarMascota(cita.getMascota()));
        return citaRepository.save(cita);
    }

    public Cita update(Long id, Cita datos) {
        Cita existente = getById(id);

        existente.setFecha(datos.getFecha());
        existente.setMotivo(datos.getMotivo());
        existente.setDiagnostico(datos.getDiagnostico());
        existente.setCosto(datos.getCosto());

        if (datos.getMascota() != null) {
            existente.setMascota(buscarMascota(datos.getMascota()));
        }
        return citaRepository.save(existente);
    }

    public void delete(Long id) {
        citaRepository.delete(getById(id));
    }

    // Validación: no se puede crear una cita para una mascota inexistente
    private Mascota buscarMascota(Mascota referencia) {
        if (referencia == null || referencia.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar la mascota: \"mascota\": {\"id\": 1}");
        }
        return mascotaService.getById(referencia.getId());
    }
}
