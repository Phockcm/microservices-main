-- ============================================================================
-- SERVICE 2: DELIVERY SERVICE (Port 8082) — MySQL (XAMPP / phpMyAdmin)
-- Database: delivery_db
-- ============================================================================
CREATE DATABASE IF NOT EXISTS delivery_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE delivery_db;

CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tracking_code VARCHAR(40) NOT NULL UNIQUE,
    sender_name VARCHAR(120) NOT NULL,
    sender_phone VARCHAR(20) NOT NULL,
    pickup_address VARCHAR(255) NOT NULL,
    receiver_name VARCHAR(120) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    package_desc VARCHAR(255) NOT NULL,
    weight_kg DECIMAL(8, 2) NOT NULL DEFAULT 1.00,
    service_type VARCHAR(20) NOT NULL DEFAULT 'STANDARD' COMMENT 'STANDARD, EXPRESS',
    shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    cod_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(25) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED',
    created_at VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS tracking_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_id BIGINT NOT NULL,
    status VARCHAR(25) NOT NULL,
    location VARCHAR(200),
    note VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tracking_delivery FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
);

-- Dữ liệu mẫu khớp với Frontend React JSX
INSERT INTO deliveries (
    tracking_code, sender_name, sender_phone, pickup_address,
    receiver_name, receiver_phone, delivery_address,
    package_desc, weight_kg, service_type, shipping_fee, cod_amount, status, created_at
) VALUES
(
    'A1-2026-001', 'Shop Công Nghệ K-Tech', '0909111222', '120 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
    'Lê Văn Hùng', '0908333444', '45 Lê Văn Việt, TP. Thủ Đức',
    'Bàn phím cơ + chuột không dây', 1.40, 'EXPRESS', 35000.00, 1250000.00, 'IN_TRANSIT', '2026-11-20 08:30'
),
(
    'A1-2026-002', 'Thời Trang Mây', '0918222333', '88 Nguyễn Trãi, Q.1, TP.HCM',
    'Nguyễn Thảo Vy', '0977555666', '210 Nguyễn Thị Thập, Q.7, TP.HCM',
    'Hộp quần áo (2 áo khoác)', 0.80, 'STANDARD', 22000.00, 680000.00, 'PENDING', '2026-11-20 09:45'
),
(
    'A1-2026-003', 'Hiệu Sách Minh Khai', '0903444555', '249 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
    'Trần Quốc Bảo', '0938777888', '15 Cộng Hòa, Q. Tân Bình, TP.HCM',
    'Bộ sách Spring Boot Microservices', 2.20, 'STANDARD', 28000.00, 0.00, 'DELIVERED', '2026-11-19 14:15'
)
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO tracking_histories (delivery_id, status, location, note)
SELECT id, 'PENDING', pickup_address, 'Đơn vận chuyển đã được tạo'
FROM deliveries
WHERE tracking_code = 'A1-2026-001'
  AND NOT EXISTS (SELECT 1 FROM tracking_histories WHERE delivery_id = deliveries.id);
