package com.example.paymentservice.service;

import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository repository;

    public PaymentService(PaymentRepository repository) {
        this.repository = repository;
    }

    public List<Payment> getAll() {
        return repository.findAll();
    }

    public Payment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch ID: " + id));
    }

    public Payment create(Payment payment) {
        if (payment.getMethod() == null || payment.getMethod().isBlank()) {
            payment.setMethod("COD");
        }
        if (payment.getStatus() == null || payment.getStatus().isBlank()) {
            payment.setStatus("UNPAID");
        }
        return repository.save(payment);
    }

    public Payment update(Long id, Payment payload) {
        Payment existing = getById(id);
        existing.setShippingFee(payload.getShippingFee());
        existing.setCodAmount(payload.getCodAmount());
        existing.setMethod(payload.getMethod());
        existing.setStatus(payload.getStatus());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.delete(getById(id));
    }
}
