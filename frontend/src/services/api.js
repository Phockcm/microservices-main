/**
 * Centralized API Client kết nối tới 5 Java Spring Boot Microservices.
 *   - Driver Service     (MySQL)      : http://localhost:8081/api/drivers
 *   - Delivery Service   (SQL Server) : http://localhost:8082/api/deliveries
 *   - Assignment Service              : http://localhost:8083/api/assignments
 *   - Customer Service                : http://localhost:8084/api/customers
 *   - Payment / COD Service           : http://localhost:8085/api/payments
 */

export const SERVICES = {
	driver: {
		key: 'driver',
		name: 'driver-service',
		label: 'Driver :8081 (MySQL)',
		baseUrl: 'http://localhost:8081',
		endpoint: '/api/drivers'
	},
	delivery: {
		key: 'delivery',
		name: 'delivery-service',
		label: 'Delivery :8082 (SQL Server)',
		baseUrl: 'http://localhost:8082',
		endpoint: '/api/deliveries'
	},
	assignment: {
		key: 'assignment',
		name: 'assignment-service',
		label: 'Assignment :8083',
		baseUrl: 'http://localhost:8083',
		endpoint: '/api/assignments'
	},
	customer: {
		key: 'customer',
		name: 'customer-service',
		label: 'Customer :8084',
		baseUrl: 'http://localhost:8084',
		endpoint: '/api/customers'
	},
	payment: {
		key: 'payment',
		name: 'payment-service',
		label: 'Payment :8085',
		baseUrl: 'http://localhost:8085',
		endpoint: '/api/payments'
	}
};

const DEMO_SEED = {
	drivers: [
		{ id: 1, fullName: 'Nguyễn Minh Quân', phone: '0901234567', licensePlate: '59X3-482.19', vehicleType: 'MOTORBIKE', area: 'Quận 1, Quận 3', status: 'AVAILABLE' },
		{ id: 2, fullName: 'Trần Hoàng Nam', phone: '0912345678', licensePlate: '59C1-772.05', vehicleType: 'VAN', area: 'Thủ Đức, Bình Thạnh', status: 'BUSY' },
		{ id: 3, fullName: 'Lê Thị Thu Hà', phone: '0987654321', licensePlate: '59D2-119.84', vehicleType: 'MOTORBIKE', area: 'Quận 7, Nhà Bè', status: 'AVAILABLE' },
		{ id: 4, fullName: 'Phạm Đức Anh', phone: '0933445566', licensePlate: '51D-604.22', vehicleType: 'TRUCK', area: 'Tân Bình, Gò Vấp', status: 'OFFLINE' }
	],
	deliveries: [
		{
			id: 1001,
			trackingCode: 'A1-2026-001',
			senderName: 'Shop Công Nghệ K-Tech',
			senderPhone: '0909111222',
			pickupAddress: '120 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
			receiverName: 'Lê Văn Hùng',
			receiverPhone: '0908333444',
			deliveryAddress: '45 Lê Văn Việt, TP. Thủ Đức',
			packageDesc: 'Bàn phím cơ + chuột không dây',
			weightKg: 1.4,
			serviceType: 'EXPRESS',
			shippingFee: 35000,
			codAmount: 1250000,
			status: 'IN_TRANSIT',
			createdAt: '2026-11-20 08:30'
		},
		{
			id: 1002,
			trackingCode: 'A1-2026-002',
			senderName: 'Thời Trang Mây',
			senderPhone: '0918222333',
			pickupAddress: '88 Nguyễn Trãi, Q.1, TP.HCM',
			receiverName: 'Nguyễn Thảo Vy',
			receiverPhone: '0977555666',
			deliveryAddress: '210 Nguyễn Thị Thập, Q.7, TP.HCM',
			packageDesc: 'Hộp quần áo (2 áo khoác)',
			weightKg: 0.8,
			serviceType: 'STANDARD',
			shippingFee: 22000,
			codAmount: 680000,
			status: 'PENDING',
			createdAt: '2026-11-20 09:45'
		},
		{
			id: 1003,
			trackingCode: 'A1-2026-003',
			senderName: 'Hiệu Sách Minh Khai',
			senderPhone: '0903444555',
			pickupAddress: '249 Nguyễn Thị Minh Khai, Q.1, TP.HCM',
			receiverName: 'Trần Quốc Bảo',
			receiverPhone: '0938777888',
			deliveryAddress: '15 Cộng Hòa, Q. Tân Bình, TP.HCM',
			packageDesc: 'Bộ sách Spring Boot Microservices',
			weightKg: 2.2,
			serviceType: 'STANDARD',
			shippingFee: 28000,
			codAmount: 0,
			status: 'DELIVERED',
			createdAt: '2026-11-19 14:15'
		}
	],
	assignments: [
		{
			id: 501,
			deliveryId: 1001,
			trackingCode: 'A1-2026-001',
			driverId: 2,
			driverName: 'Trần Hoàng Nam',
			assignedAt: '2026-11-20 09:00',
			status: 'PICKED_UP',
			note: 'Đã lấy hàng tại Q.3, đang di chuyển về Thủ Đức'
		},
		{
			id: 502,
			deliveryId: 1003,
			trackingCode: 'A1-2026-003',
			driverId: 1,
			driverName: 'Nguyễn Minh Quân',
			assignedAt: '2026-11-19 15:00',
			status: 'COMPLETED',
			note: 'Khách đã ký nhận'
		}
	],
	customers: [
		{ id: 1, name: 'Shop Công Nghệ K-Tech', phone: '0909111222', email: 'ktech@shop.vn', defaultAddress: '120 Nguyễn Thị Minh Khai, Q.3, TP.HCM', type: 'SHOP' },
		{ id: 2, name: 'Thời Trang Mây', phone: '0918222333', email: 'mayfashion@shop.vn', defaultAddress: '88 Nguyễn Trãi, Q.1, TP.HCM', type: 'SHOP' },
		{ id: 3, name: 'Hiệu Sách Minh Khai', phone: '0903444555', email: 'books@minhkhai.vn', defaultAddress: '249 Nguyễn Thị Minh Khai, Q.1, TP.HCM', type: 'ENTERPRISE' }
	],
	payments: [
		{ id: 901, deliveryId: 1001, trackingCode: 'A1-2026-001', shippingFee: 35000, codAmount: 1250000, method: 'COD', status: 'PENDING_COLLECT' },
		{ id: 902, deliveryId: 1002, trackingCode: 'A1-2026-002', shippingFee: 22000, codAmount: 680000, method: 'COD', status: 'UNPAID' },
		{ id: 903, deliveryId: 1003, trackingCode: 'A1-2026-003', shippingFee: 28000, codAmount: 0, method: 'BANK_TRANSFER', status: 'SETTLED' }
	]
};

const STORAGE_KEY = 'a1_express_jsx_demo_db_v1';

function loadDemoDb() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw);
	} catch (_) {}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_SEED));
	return JSON.parse(JSON.stringify(DEMO_SEED));
}

function saveDemoDb(db) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function formatVND(amount) {
	return `${new Intl.NumberFormat('vi-VN').format(Number(amount) || 0)} đ`;
}

export function calcShippingFee(weightKg, serviceType, distanceKm = 10) {
	const w = Math.max(0.5, Number(weightKg) || 0.5);
	const d = Math.max(1, Number(distanceKm) || 10);
	const base = serviceType === 'EXPRESS' ? 30000 : 18000;
	const weightFee = w > 1 ? Math.ceil(w - 1) * 5000 : 0;
	const distFee = d > 10 ? Math.ceil((d - 10) / 5) * 4000 : 0;
	return base + weightFee + distFee;
}

export function resetDemoData() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_SEED));
	return loadDemoDb();
}

export async function checkServiceHealth(serviceKey) {
	const svc = SERVICES[serviceKey];
	if (!svc) return false;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 1400);
	try {
		const res = await fetch(svc.baseUrl + svc.endpoint, { method: 'GET', signal: controller.signal });
		clearTimeout(timer);
		return res.ok;
	} catch (_) {
		clearTimeout(timer);
		return false;
	}
}

export async function apiRequest(serviceKey, resourceKey, { method = 'GET', path = '', body = null, mode = 'auto' } = {}) {
	const svc = SERVICES[serviceKey];
	const url = svc.baseUrl + svc.endpoint + path;

	if (mode !== 'demo') {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 2200);
		try {
			const res = await fetch(url, {
				method,
				headers: body ? { 'Content-Type': 'application/json' } : undefined,
				body: body ? JSON.stringify(body) : undefined,
				signal: controller.signal
			});
			clearTimeout(timer);
			if (!res.ok) {
				const errText = await res.text().catch(() => res.statusText);
				throw new Error(`HTTP ${res.status}: ${errText || res.statusText}`);
			}
			const data = res.status === 204 ? null : await res.json().catch(() => null);
			return { data, source: 'live' };
		} catch (err) {
			clearTimeout(timer);
			if (mode === 'live') {
				throw new Error(`Không kết nối được ${svc.name} (${url}). Kiểm tra Spring Boot & @CrossOrigin.`);
			}
		}
	}

	const db = loadDemoDb();
	const list = db[resourceKey] || [];
	const idMatch = path.match(/^\/(\d+)$/);

	if (method === 'GET') {
		if (idMatch) {
			const item = list.find((x) => Number(x.id) === Number(idMatch[1]));
			if (!item) throw new Error('Không tìm thấy bản ghi (404)');
			return { data: item, source: 'demo' };
		}
		return { data: list, source: 'demo' };
	}

	if (method === 'POST') {
		const nextId = list.length ? Math.max(...list.map((x) => Number(x.id) || 0)) + 1 : 1;
		const created = { id: nextId, ...body };
		if (resourceKey === 'deliveries' && !created.trackingCode) {
			created.trackingCode = `A1-2026-${String(nextId).slice(-3).padStart(3, '0')}`;
		}
		const now = new Date();
		const pad = (n) => String(n).padStart(2, '0');
		const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
		if (resourceKey === 'deliveries' && !created.createdAt) created.createdAt = stamp;
		if (resourceKey === 'assignments' && !created.assignedAt) created.assignedAt = stamp;
		list.unshift(created);
		db[resourceKey] = list;
		saveDemoDb(db);
		return { data: created, source: 'demo' };
	}

	if (method === 'PUT' && idMatch) {
		const idx = list.findIndex((x) => Number(x.id) === Number(idMatch[1]));
		if (idx === -1) throw new Error('Không tìm thấy bản ghi để cập nhật');
		list[idx] = { ...list[idx], ...body, id: Number(idMatch[1]) };
		db[resourceKey] = list;
		saveDemoDb(db);
		return { data: list[idx], source: 'demo' };
	}

	if (method === 'DELETE' && idMatch) {
		const idx = list.findIndex((x) => Number(x.id) === Number(idMatch[1]));
		if (idx === -1) throw new Error('Không tìm thấy bản ghi để xóa');
		list.splice(idx, 1);
		db[resourceKey] = list;
		saveDemoDb(db);
		return { data: null, source: 'demo' };
	}

	throw new Error('Phương thức không hỗ trợ');
}
