package com.example.deliveryservice.repository;

import com.example.deliveryservice.entity.TrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackingHistoryRepository extends JpaRepository<TrackingHistory, Long> {
    List<TrackingHistory> findByDeliveryIdOrderByUpdatedAtDesc(Long deliveryId);
}
