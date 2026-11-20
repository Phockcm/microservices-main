package com.example.driverservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Biển số xe không được để trống")
    @Column(name = "license_plate", nullable = false, unique = true, length = 30)
    private String licensePlate;

    @NotBlank(message = "Loại xe không được để trống")
    @Column(name = "vehicle_type", nullable = false, length = 30)
    private String vehicleType = "MOTORBIKE";

    @Column(length = 60)
    private String brand;

    @Column(name = "capacity_kg", precision = 8, scale = 2)
    private BigDecimal capacityKg = new BigDecimal("50.00");

    public Vehicle() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public BigDecimal getCapacityKg() { return capacityKg; }
    public void setCapacityKg(BigDecimal capacityKg) { this.capacityKg = capacityKg; }
}
