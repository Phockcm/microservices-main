-- ============================================================================
-- SERVICE 1: DRIVER SERVICE (Port 8081) — MySQL (XAMPP / phpMyAdmin)
-- Database: driver_db
-- ============================================================================
CREATE DATABASE IF NOT EXISTS driver_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE driver_db;

CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(30) NOT NULL UNIQUE,
    vehicle_type VARCHAR(30) NOT NULL COMMENT 'MOTORBIKE, VAN, TRUCK',
    brand VARCHAR(60),
    capacity_kg DECIMAL(8, 2) DEFAULT 50.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    license_plate VARCHAR(30) NOT NULL,
    vehicle_type VARCHAR(30) NOT NULL DEFAULT 'MOTORBIKE',
    area VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' COMMENT 'AVAILABLE, BUSY, OFFLINE',
    vehicle_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_driver_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

-- Dữ liệu mẫu khớp với Frontend React JSX
INSERT INTO vehicles (license_plate, vehicle_type, brand, capacity_kg) VALUES
('59X3-482.19', 'MOTORBIKE', 'Honda Wave Alpha', 40.00),
('59C1-772.05', 'VAN', 'Suzuki Carry Pro', 750.00),
('59D2-119.84', 'MOTORBIKE', 'Yamaha Sirius', 40.00),
('51D-604.22', 'TRUCK', 'Hyundai Porter H150', 1500.00)
ON DUPLICATE KEY UPDATE brand = VALUES(brand);

INSERT INTO drivers (full_name, phone, license_plate, vehicle_type, area, status, vehicle_id) VALUES
('Nguyễn Minh Quân', '0901234567', '59X3-482.19', 'MOTORBIKE', 'Quận 1, Quận 3', 'AVAILABLE', 1),
('Trần Hoàng Nam', '0912345678', '59C1-772.05', 'VAN', 'Thủ Đức, Bình Thạnh', 'BUSY', 2),
('Lê Thị Thu Hà', '0987654321', '59D2-119.84', 'MOTORBIKE', 'Quận 7, Nhà Bè', 'AVAILABLE', 3),
('Phạm Đức Anh', '0933445566', '51D-604.22', 'TRUCK', 'Tân Bình, Gò Vấp', 'OFFLINE', 4)
ON DUPLICATE KEY UPDATE area = VALUES(area);
