package com.example.deliveryservice.controller;

import com.example.deliveryservice.entity.Delivery;
import com.example.deliveryservice.entity.TrackingHistory;
import com.example.deliveryservice.repository.TrackingHistoryRepository;
import com.example.deliveryservice.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5500"})
public class DeliveryController {

    private final DeliveryService deliveryService;
    private final TrackingHistoryRepository trackingHistoryRepository;

    public DeliveryController(DeliveryService deliveryService, TrackingHistoryRepository trackingHistoryRepository) {
        this.deliveryService = deliveryService;
        this.trackingHistoryRepository = trackingHistoryRepository;
    }

    @GetMapping("/{id}/tracking")
    public List<TrackingHistory> getTrackingHistory(@PathVariable Long id) {
        deliveryService.getById(id);
        return trackingHistoryRepository.findByDeliveryIdOrderByUpdatedAtDesc(id);
    }

    @GetMapping
    public List<Delivery> getAll(@RequestParam(required = false) String status) {
        return deliveryService.getAll(status);
    }

    @GetMapping("/{id}")
    public Delivery getById(@PathVariable Long id) {
        return deliveryService.getById(id);
    }

    @GetMapping("/track/{trackingCode}")
    public Delivery trackByCode(@PathVariable String trackingCode) {
        return deliveryService.getByTrackingCode(trackingCode);
    }

    @PostMapping
    public ResponseEntity<Delivery> create(@Valid @RequestBody Delivery delivery) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deliveryService.create(delivery));
    }

    @PutMapping("/{id}")
    public Delivery update(@PathVariable Long id, @Valid @RequestBody Delivery delivery) {
        return deliveryService.update(id, delivery);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deliveryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
