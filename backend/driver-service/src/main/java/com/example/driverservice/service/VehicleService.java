package com.example.driverservice.service;

import com.example.driverservice.entity.Vehicle;
import com.example.driverservice.repository.VehicleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy phương tiện ID: " + id));
    }

    public Vehicle create(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(Long id, Vehicle payload) {
        Vehicle existing = getById(id);
        existing.setLicensePlate(payload.getLicensePlate());
        existing.setVehicleType(payload.getVehicleType());
        existing.setBrand(payload.getBrand());
        existing.setCapacityKg(payload.getCapacityKg());
        return vehicleRepository.save(existing);
    }

    public void delete(Long id) {
        vehicleRepository.delete(getById(id));
    }
}
