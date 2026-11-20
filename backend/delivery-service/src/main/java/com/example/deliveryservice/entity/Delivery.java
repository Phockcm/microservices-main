package com.example.deliveryservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_code", nullable = false, unique = true, length = 40)
    private String trackingCode;

    @NotBlank(message = "Tên người gửi không được để trống")
    @Column(name = "sender_name", nullable = false, length = 120)
    private String senderName;

    @NotBlank(message = "SĐT người gửi không được để trống")
    @Column(name = "sender_phone", nullable = false, length = 20)
    private String senderPhone;

    @NotBlank(message = "Địa chỉ lấy hàng không được để trống")
    @Column(name = "pickup_address", nullable = false, length = 255)
    private String pickupAddress;

    @NotBlank(message = "Tên người nhận không được để trống")
    @Column(name = "receiver_name", nullable = false, length = 120)
    private String receiverName;

    @NotBlank(message = "SĐT người nhận không được để trống")
    @Column(name = "receiver_phone", nullable = false, length = 20)
    private String receiverPhone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    @Column(name = "delivery_address", nullable = false, length = 255)
    private String deliveryAddress;

    @NotBlank(message = "Mô tả kiện hàng không được để trống")
    @Column(name = "package_desc", nullable = false, length = 255)
    private String packageDesc;

    @Column(name = "weight_kg", nullable = false, precision = 8, scale = 2)
    private BigDecimal weightKg = BigDecimal.ONE;

    @Column(name = "service_type", nullable = false, length = 20)
    private String serviceType = "STANDARD";

    @Column(name = "shipping_fee", nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @Column(name = "cod_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal codAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 25)
    private String status = "PENDING";

    @Column(name = "created_at", length = 30)
    private String createdAt;

    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrackingHistory> trackingHistories = new ArrayList<>();

    public Delivery() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderPhone() { return senderPhone; }
    public void setSenderPhone(String senderPhone) { this.senderPhone = senderPhone; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverPhone() { return receiverPhone; }
    public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPackageDesc() { return packageDesc; }
    public void setPackageDesc(String packageDesc) { this.packageDesc = packageDesc; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public BigDecimal getCodAmount() { return codAmount; }
    public void setCodAmount(BigDecimal codAmount) { this.codAmount = codAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public List<TrackingHistory> getTrackingHistories() { return trackingHistories; }
    public void setTrackingHistories(List<TrackingHistory> trackingHistories) { this.trackingHistories = trackingHistories; }
}
