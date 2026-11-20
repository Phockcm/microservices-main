package com.example.assignmentservice.repository;

import com.example.assignmentservice.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByDriverId(Long driverId);
    List<Assignment> findByDeliveryId(Long deliveryId);
}
