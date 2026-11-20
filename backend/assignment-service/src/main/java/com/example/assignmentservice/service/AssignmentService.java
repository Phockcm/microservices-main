package com.example.assignmentservice.service;

import com.example.assignmentservice.entity.Assignment;
import com.example.assignmentservice.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class AssignmentService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private final AssignmentRepository repository;
    private final RestClient driverClient;
    private final RestClient deliveryClient;

    public AssignmentService(
            AssignmentRepository repository,
            RestClient.Builder builder,
            @Value("${services.driver.url:http://localhost:8081}") String driverUrl,
            @Value("${services.delivery.url:http://localhost:8082}") String deliveryUrl
    ) {
        this.repository = repository;
        this.driverClient = builder.baseUrl(driverUrl).build();
        this.deliveryClient = builder.baseUrl(deliveryUrl).build();
    }

    public List<Assignment> getAll() {
        return repository.findAll();
    }

    public Assignment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phân công ID: " + id));
    }

    /**
     * Giao tiếp đa Microservice qua RestClient:
     * Kiểm tra tài xế từ driver-service (:8081) và đơn hàng từ delivery-service (:8082).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> fetchDriverInfo(Long driverId) {
        return driverClient.get().uri("/api/drivers/{id}", driverId).retrieve().body(Map.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> fetchDeliveryInfo(Long deliveryId) {
        return deliveryClient.get().uri("/api/deliveries/{id}", deliveryId).retrieve().body(Map.class);
    }

    public Assignment create(Assignment assignment) {
        if (assignment.getAssignedAt() == null || assignment.getAssignedAt().isBlank()) {
            assignment.setAssignedAt(LocalDateTime.now().format(FORMATTER));
        }
        if (assignment.getStatus() == null || assignment.getStatus().isBlank()) {
            assignment.setStatus("PICKED_UP");
        }
        if (assignment.getTrackingCode() == null || assignment.getTrackingCode().isBlank()) {
            assignment.setTrackingCode("#" + assignment.getDeliveryId());
        }
        return repository.save(assignment);
    }

    public Assignment update(Long id, Assignment payload) {
        Assignment existing = getById(id);
        existing.setStatus(payload.getStatus());
        existing.setNote(payload.getNote());
        if (payload.getDriverId() != null) existing.setDriverId(payload.getDriverId());
        if (payload.getDriverName() != null) existing.setDriverName(payload.getDriverName());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }
}
