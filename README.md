# A1 Express — Đồ án Quản lý Vận chuyển & Giao hàng
**Backend:** Java Spring Boot Microservices · **Frontend:** React + Vite (JSX)

## Khung thư mục dự án

```text
e:\web 3\
├── backend/                               # Java Spring Boot Microservices (Lab 02)
│   ├── driver-service/                    # Service 1 — Port 8081 (MySQL: driver_db)
│   │   ├── src/main/java/com/example/driverservice/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   └── DriverServiceApplication.java
│   │   ├── src/main/resources/application.properties
│   │   ├── .env.example
│   │   └── pom.xml
│   ├── delivery-service/                  # Service 2 — Port 8082 (SQL Server: delivery_db)
│   │   ├── src/main/java/com/example/deliveryservice/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   └── DeliveryServiceApplication.java
│   │   ├── src/main/resources/application.properties
│   │   ├── .env.example
│   │   └── pom.xml
│   ├── assignment-service/                # Service 3 — Port 8083 (Điều phối tài xế)
│   ├── customer-service/                  # Service 4 — Port 8084 (Khách hàng / Shop)
│   └── payment-service/                   # Service 5 — Port 8085 (Thanh toán & COD)
├── frontend/                              # React + Vite (JSX)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/                    # Header.jsx, StatusBadge.jsx, ServiceHealthBar.jsx
│   │   ├── pages/
│   │   │   ├── client/ClientPortal.jsx    # Giao diện Khách hàng
│   │   │   └── admin/AdminDashboard.jsx   # Giao diện Quản trị & Điều phối
│   │   ├── services/api.js                # REST API Client kết nối port 8081–8085
│   │   ├── styles/                        # Design System từ template A1
│   │   ├── fonts/                         # Archivo + IBM Plex Mono
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Cách chạy Frontend (React JSX)

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

## Cách chạy Backend (Java Spring Boot)

1. Tạo file `.env` từ `.env.example` trong `backend/driver-service/` và `backend/delivery-service/` để điền mật khẩu MySQL / SQL Server.
2. Thêm `@CrossOrigin(origins = "http://localhost:5173")` (hoặc `"*"`) vào các `@RestController`.
3. Chạy từng service:
   - `cd backend/driver-service && mvn spring-boot:run` (Port 8081)
   - `cd backend/delivery-service && mvn spring-boot:run` (Port 8082)
