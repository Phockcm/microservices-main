package com.example.deliveryservice.service;

import com.example.deliveryservice.entity.Delivery;
import com.example.deliveryservice.entity.TrackingHistory;
import com.example.deliveryservice.repository.DeliveryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class DeliveryService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    public List<Delivery> getAll(String status) {
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            return deliveryRepository.findByStatus(status.toUpperCase());
        }
        return deliveryRepository.findAll();
    }

    public Delivery getById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy vận đơn ID: " + id));
    }

    public Delivery getByTrackingCode(String code) {
        return deliveryRepository.findByTrackingCodeIgnoreCase(code)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mã vận đơn: " + code));
    }

    public Delivery create(Delivery delivery) {
        if (delivery.getTrackingCode() == null || delivery.getTrackingCode().isBlank()) {
            String suffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            delivery.setTrackingCode("A1-2026-" + suffix);
        }
        if (delivery.getStatus() == null || delivery.getStatus().isBlank()) {
            delivery.setStatus("PENDING");
        }
        if (delivery.getCreatedAt() == null || delivery.getCreatedAt().isBlank()) {
            delivery.setCreatedAt(LocalDateTime.now().format(FORMATTER));
        }

        delivery.getTrackingHistories().add(
                new TrackingHistory(delivery, delivery.getStatus(), delivery.getPickupAddress(), "Đơn vận chuyển đã được khởi tạo")
        );
        return deliveryRepository.save(delivery);
    }

    public Delivery update(Long id, Delivery payload) {
        Delivery existing = getById(id);
        String oldStatus = existing.getStatus();

        existing.setSenderName(payload.getSenderName());
        existing.setSenderPhone(payload.getSenderPhone());
        existing.setPickupAddress(payload.getPickupAddress());
        existing.setReceiverName(payload.getReceiverName());
        existing.setReceiverPhone(payload.getReceiverPhone());
        existing.setDeliveryAddress(payload.getDeliveryAddress());
        existing.setPackageDesc(payload.getPackageDesc());
        existing.setWeightKg(payload.getWeightKg());
        existing.setServiceType(payload.getServiceType());
        existing.setShippingFee(payload.getShippingFee());
        existing.setCodAmount(payload.getCodAmount());
        existing.setStatus(payload.getStatus());

        if (payload.getStatus() != null && !payload.getStatus().equals(oldStatus)) {
            existing.getTrackingHistories().add(
                    new TrackingHistory(existing, payload.getStatus(), existing.getDeliveryAddress(), "Cập nhật trạng thái -> " + payload.getStatus())
            );
        }
        return deliveryRepository.save(existing);
    }

    public void delete(Long id) {
        Delivery existing = getById(id);
        deliveryRepository.delete(existing);
    }
}
