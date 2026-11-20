-- ============================================================================
-- CÁC SERVICE MỞ RỘNG (Ports 8083, 8084, 8085) — MySQL (XAMPP / phpMyAdmin)
-- Mỗi Microservice có 1 Database riêng theo nguyên tắc Database-per-Service
-- ============================================================================

-- 3. ASSIGNMENT SERVICE (Port 8083)
CREATE DATABASE IF NOT EXISTS assignment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE assignment_db;

CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_id BIGINT NOT NULL,
    tracking_code VARCHAR(40) NOT NULL,
    driver_id BIGINT NOT NULL,
    driver_name VARCHAR(120),
    assigned_at VARCHAR(30),
    status VARCHAR(25) NOT NULL DEFAULT 'PICKED_UP' COMMENT 'ASSIGNED, PICKED_UP, COMPLETED, FAILED',
    note VARCHAR(255)
);

-- 4. CUSTOMER SERVICE (Port 8084)
CREATE DATABASE IF NOT EXISTS customer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE customer_db;

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(120),
    default_address VARCHAR(255),
    type VARCHAR(25) NOT NULL DEFAULT 'SHOP' COMMENT 'INDIVIDUAL, SHOP, ENTERPRISE'
);

INSERT INTO customers (name, phone, email, default_address, type) VALUES
('Shop Công Nghệ K-Tech', '0909111222', 'ktech@shop.vn', '120 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 'SHOP'),
('Thời Trang Mây', '0918222333', 'mayfashion@shop.vn', '88 Nguyễn Trãi, Q.1, TP.HCM', 'SHOP'),
('Hiệu Sách Minh Khai', '0903444555', 'books@minhkhai.vn', '249 Nguyễn Thị Minh Khai, Q.1, TP.HCM', 'ENTERPRISE')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 5. PAYMENT / COD SERVICE (Port 8085)
CREATE DATABASE IF NOT EXISTS payment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE payment_db;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_id BIGINT NOT NULL,
    tracking_code VARCHAR(40) NOT NULL,
    shipping_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    cod_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    method VARCHAR(30) NOT NULL DEFAULT 'COD' COMMENT 'COD, BANK_TRANSFER, EWALLET',
    status VARCHAR(25) NOT NULL DEFAULT 'UNPAID' COMMENT 'UNPAID, PENDING_COLLECT, SETTLED'
);
