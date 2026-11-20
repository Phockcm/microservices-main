package com.example.assignmentservice.controller;

import com.example.assignmentservice.entity.Assignment;
import com.example.assignmentservice.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5500"})
public class AssignmentController {

    private final AssignmentService service;

    public AssignmentController(AssignmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Assignment> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Assignment getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/driver/{driverId}")
    public Map<String, Object> getDriverFromDriverService(@PathVariable Long driverId) {
        return service.fetchDriverInfo(driverId);
    }

    @GetMapping("/delivery/{deliveryId}")
    public Map<String, Object> getDeliveryFromDeliveryService(@PathVariable Long deliveryId) {
        return service.fetchDeliveryInfo(deliveryId);
    }

    @PostMapping
    public ResponseEntity<Assignment> create(@Valid @RequestBody Assignment assignment) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(assignment));
    }

    @PutMapping("/{id}")
    public Assignment update(@PathVariable Long id, @Valid @RequestBody Assignment assignment) {
        return service.update(id, assignment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
