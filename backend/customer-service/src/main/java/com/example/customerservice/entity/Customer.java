package com.example.customerservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên khách hàng không được để trống")
    @Column(nullable = false, length = 120)
    private String name;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(name = "default_address", length = 255)
    private String defaultAddress;

    @Column(nullable = false, length = 25)
    private String type = "SHOP";

    public Customer() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDefaultAddress() { return defaultAddress; }
    public void setDefaultAddress(String defaultAddress) { this.defaultAddress = defaultAddress; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
