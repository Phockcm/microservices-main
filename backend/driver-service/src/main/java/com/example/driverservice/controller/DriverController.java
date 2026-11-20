package com.example.driverservice.controller;

import com.example.driverservice.entity.Driver;
import com.example.driverservice.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5500"})
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public List<Driver> getAll(@RequestParam(required = false) String status) {
        return driverService.getAll(status);
    }

    @GetMapping("/{id}")
    public Driver getById(@PathVariable Long id) {
        return driverService.getById(id);
    }

    @PostMapping
    public ResponseEntity<Driver> create(@Valid @RequestBody Driver driver) {
        return ResponseEntity.status(HttpStatus.CREATED).body(driverService.create(driver));
    }

    @PutMapping("/{id}")
    public Driver update(@PathVariable Long id, @Valid @RequestBody Driver driver) {
        return driverService.update(id, driver);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
