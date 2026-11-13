package com.duoc.petcare.controller;

import com.duoc.petcare.entity.Cita;
import com.duoc.petcare.service.CitaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citas")
public class CitaController {

    private final CitaService citaService;

    public CitaController(CitaService citaService) {
        this.citaService = citaService;
    }

    @GetMapping
    public List<Cita> getAll() {
        return citaService.getAll();
    }

    @GetMapping("/{id}")
    public Cita getById(@PathVariable Long id) {
        return citaService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cita create(@Valid @RequestBody Cita cita) {
        return citaService.create(cita);
    }

    @PutMapping("/{id}")
    public Cita update(@PathVariable Long id, @Valid @RequestBody Cita cita) {
        return citaService.update(id, cita);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        citaService.delete(id);
    }
}
