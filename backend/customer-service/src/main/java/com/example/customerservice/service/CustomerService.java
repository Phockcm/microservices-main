package com.example.customerservice.service;

import com.example.customerservice.entity.Customer;
import com.example.customerservice.repository.CustomerRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAll() {
        return repository.findAll();
    }

    public Customer getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng ID: " + id));
    }

    public Customer create(Customer customer) {
        if (customer.getType() == null || customer.getType().isBlank()) {
            customer.setType("SHOP");
        }
        return repository.save(customer);
    }

    public Customer update(Long id, Customer payload) {
        Customer existing = getById(id);
        existing.setName(payload.getName());
        existing.setPhone(payload.getPhone());
        existing.setEmail(payload.getEmail());
        existing.setDefaultAddress(payload.getDefaultAddress());
        existing.setType(payload.getType());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }
}
