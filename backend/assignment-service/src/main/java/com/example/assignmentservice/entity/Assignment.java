package com.example.assignmentservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "deliveryId không được để trống")
    @Column(name = "delivery_id", nullable = false)
    private Long deliveryId;

    @Column(name = "tracking_code", nullable = false, length = 40)
    private String trackingCode;

    @NotNull(message = "driverId không được để trống")
    @Column(name = "driver_id", nullable = false)
    private Long driverId;

    @Column(name = "driver_name", length = 120)
    private String driverName;

    @Column(name = "assigned_at", length = 30)
    private String assignedAt;

    @Column(nullable = false, length = 25)
    private String status = "PICKED_UP";

    @Column(length = 255)
    private String note;

    public Assignment() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Long deliveryId) { this.deliveryId = deliveryId; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getAssignedAt() { return assignedAt; }
    public void setAssignedAt(String assignedAt) { this.assignedAt = assignedAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
