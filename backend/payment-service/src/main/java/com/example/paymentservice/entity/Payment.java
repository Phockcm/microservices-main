package com.example.paymentservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "deliveryId không được để trống")
    @Column(name = "delivery_id", nullable = false)
    private Long deliveryId;

    @Column(name = "tracking_code", nullable = false, length = 40)
    private String trackingCode;

    @Column(name = "shipping_fee", nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "cod_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal codAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 30)
    private String method = "COD";

    @Column(nullable = false, length = 25)
    private String status = "UNPAID";

    public Payment() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Long deliveryId) { this.deliveryId = deliveryId; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getCodAmount() { return codAmount; }
    public void setCodAmount(BigDecimal codAmount) { this.codAmount = codAmount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
