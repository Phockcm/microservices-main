package com.example.driverservice.service;

import com.example.driverservice.entity.Driver;
import com.example.driverservice.repository.DriverRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> getAll(String status) {
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            return driverRepository.findByStatus(status.toUpperCase());
        }
        return driverRepository.findAll();
    }

    public Driver getById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài xế ID: " + id));
    }

    public Driver create(Driver driver) {
        if (driver.getStatus() == null || driver.getStatus().isBlank()) {
            driver.setStatus("AVAILABLE");
        }
        if (driver.getVehicleType() == null || driver.getVehicleType().isBlank()) {
            driver.setVehicleType("MOTORBIKE");
        }
        return driverRepository.save(driver);
    }

    public Driver update(Long id, Driver payload) {
        Driver existing = getById(id);
        existing.setFullName(payload.getFullName());
        existing.setPhone(payload.getPhone());
        existing.setLicensePlate(payload.getLicensePlate());
        existing.setVehicleType(payload.getVehicleType());
        existing.setArea(payload.getArea());
        existing.setStatus(payload.getStatus());
        return driverRepository.save(existing);
    }

    public void delete(Long id) {
        Driver existing = getById(id);
        driverRepository.delete(existing);
    }
}
