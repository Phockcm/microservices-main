# BÁO CÁO PHÂN TÍCH HỆ THỐNG — LAB 02 (LẬP TRÌNH WEB 3)

- **Đề tài:** Hệ thống Quản lý Vận chuyển & Giao hàng (**A1 Express**)
- **Kiến trúc:** Spring Boot Microservices (Backend Java) + React Vite JSX (Frontend) + MySQL XAMPP

---

## A. Xác định các chức năng của hệ thống

### 1. Admin – Trang quản trị & điều phối (Dành cho nhân viên)

| STT | Nhóm chức năng | Chức năng dự kiến |
| :-: | :--- | :--- |
| 1 | Quản lý đơn vận chuyển | Xem danh sách, lọc theo trạng thái, tạo đơn mới, cập nhật trạng thái (`PENDING` → `IN_TRANSIT` → `DELIVERED`), xóa đơn |
| 2 | Quản lý tài xế & phương tiện | Thêm, sửa, xóa tài xế (shipper), quản lý phương tiện (xe máy/xe tải, biển số), khu vực phụ trách, trạng thái sẵn sàng |
| 3 | Điều phối & phân công giao hàng | Ghép đơn chờ lấy hàng (`PENDING`) với tài xế đang rảnh (`AVAILABLE`), cập nhật xác nhận giao thành công |
| 4 | Quản lý khách hàng / Shop | Xem danh sách shop/khách gửi, thông tin liên hệ và địa chỉ lấy hàng mặc định |
| 5 | Quản lý thanh toán & đối soát COD | Theo dõi cước vận chuyển, tiền thu hộ COD, xác nhận đối soát hoàn tất |
| 6 | Giám sát trạng thái Microservices | Kiểm tra tình trạng hoạt động (Online/Offline) của từng Service theo cổng (`8081`–`8085`) |

### 2. Client – Trang khách hàng (Dành cho người gửi / người nhận)

| STT | Nhóm chức năng | Chức năng dự kiến |
| :-: | :--- | :--- |
| 1 | Tra cứu vận đơn (Tracking) | Nhập mã vận đơn (VD: `A1-2026-001`) để xem chi tiết thông tin và tiến độ giao hàng 4 chặng |
| 2 | Tạo đơn vận chuyển mới | Nhập thông tin người gửi, người nhận, kiện hàng, chọn gói dịch vụ (Chuẩn / Hỏa tốc), tiền thu hộ COD |
| 3 | Ước tính cước phí trực tuyến | Tự động tính cước theo khối lượng (kg), khoảng cách (km) và gói dịch vụ |
| 4 | Xem lịch sử vận đơn | Theo dõi danh sách đơn đã tạo và nhấn tra cứu nhanh từng đơn |

---

## B. Xác định các quy trình nghiệp vụ chính

| STT | Quy trình nghiệp vụ | Đối tượng thực hiện | Service liên quan |
| :-: | :--- | :--- | :--- |
| 1 | Quản lý tài xế và phương tiện | Admin | Driver Service |
| 2 | Tạo đơn vận chuyển & khởi tạo hành trình | Client / Admin | Delivery Service, Customer Service, Payment Service |
| 3 | Tra cứu hành trình vận đơn | Client | Delivery Service |
| 4 | Điều phối & phân công tài xế giao hàng | Admin | Assignment Service, Delivery Service, Driver Service |
| 5 | Xác nhận giao hàng thành công & giải phóng tài xế | Admin / Tài xế | Assignment Service, Delivery Service, Driver Service |
| 6 | Đối soát cước phí & tiền thu hộ COD | Admin | Payment Service, Delivery Service |

---

## C. Danh sách các Business Microservices

| STT | Tên Service | Port | Database | Chức năng phụ trách | Service cần giao tiếp |
| :-: | :--- | :-: | :--- | :--- | :--- |
| 1 | **Driver Service** | `8081` | `driver_db` (MySQL) | Quản lý tài xế (`drivers`), phương tiện (`vehicles`), trạng thái sẵn sàng | Assignment Service |
| 2 | **Delivery Service** | `8082` | `delivery_db` (MySQL / SQL Server) | Quản lý vận đơn (`deliveries`), lịch sử hành trình (`tracking_histories`) | Assignment, Customer, Payment |
| 3 | **Assignment Service** | `8083` | `assignment_db` (MySQL) | Phân công tài xế (`assignments`), giao tiếp `RestClient` với Driver & Delivery | Driver Service, Delivery Service |
| 4 | **Customer Service** | `8084` | `customer_db` (MySQL) | Quản lý danh bạ khách hàng / shop (`customers`) | Delivery Service |
| 5 | **Payment Service** | `8085` | `payment_db` (MySQL) | Quản lý cước phí, thu hộ COD và đối soát (`payments`) | Delivery Service |
