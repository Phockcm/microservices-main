package com.example.driverservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Họ tên tài xế không được để trống")
    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @NotBlank(message = "Biển số xe không được để trống")
    @Column(name = "license_plate", nullable = false, length = 30)
    private String licensePlate;

    @Column(name = "vehicle_type", nullable = false, length = 30)
    private String vehicleType = "MOTORBIKE";

    @NotBlank(message = "Khu vực hoạt động không được để trống")
    @Column(nullable = false, length = 150)
    private String area;

    @Column(nullable = false, length = 20)
    private String status = "AVAILABLE";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    public Driver() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
}
