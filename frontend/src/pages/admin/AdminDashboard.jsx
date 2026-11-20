import { useState } from 'react';
import ServiceHealthBar from '../../components/ServiceHealthBar';
import StatusBadge from '../../components/StatusBadge';
import { apiRequest, calcShippingFee, formatVND } from '../../services/api';

const EMPTY_DRIVER = {
	id: null,
	fullName: '',
	phone: '',
	licensePlate: '',
	vehicleType: 'MOTORBIKE',
	area: '',
	status: 'AVAILABLE'
};

const EMPTY_DELIVERY = {
	id: null,
	senderName: '',
	senderPhone: '',
	pickupAddress: '',
	receiverName: '',
	receiverPhone: '',
	deliveryAddress: '',
	packageDesc: '',
	weightKg: 1.0,
	serviceType: 'STANDARD',
	codAmount: 0,
	status: 'PENDING'
};

export default function AdminDashboard({
	data,
	health,
	apiMode,
	onRefresh,
	onResetDemo,
	notify
}) {
	const [activeTab, setActiveTab] = useState('deliveries');
	const [deliveryQuery, setDeliveryQuery] = useState('');
	const [deliveryFilter, setDeliveryFilter] = useState('ALL');
	const [driverQuery, setDriverQuery] = useState('');
	const [driverFilter, setDriverFilter] = useState('ALL');

	// Modals
	const [driverModal, setDriverModal] = useState(null);
	const [deliveryModal, setDeliveryModal] = useState(null);

	// Assignment form
	const [assignDeliveryId, setAssignDeliveryId] = useState('');
	const [assignDriverId, setAssignDriverId] = useState('');
	const [assignNote, setAssignNote] = useState('');

	const { deliveries, drivers, assignments, customers, payments } = data;

	const pendingOrders = deliveries.filter((d) => d.status === 'PENDING');
	const availDrivers = drivers.filter((d) => d.status === 'AVAILABLE');
	const totalCod = deliveries.reduce((sum, d) => sum + (Number(d.codAmount) || 0), 0);

	const filteredDeliveries = deliveries.filter((d) => {
		if (deliveryFilter !== 'ALL' && d.status !== deliveryFilter) return false;
		const q = deliveryQuery.trim().toLowerCase();
		if (!q) return true;
		return [d.trackingCode, d.senderName, d.receiverName, d.deliveryAddress]
			.filter(Boolean)
			.some((v) => String(v).toLowerCase().includes(q));
	});

	const filteredDrivers = drivers.filter((d) => {
		if (driverFilter !== 'ALL' && d.status !== driverFilter) return false;
		const q = driverQuery.trim().toLowerCase();
		if (!q) return true;
		return [d.fullName, d.phone, d.licensePlate, d.area]
			.filter(Boolean)
			.some((v) => String(v).toLowerCase().includes(q));
	});

	// ── CRUD Delivery ───────────────────────────────────────────────────
	async function saveDelivery(e) {
		e.preventDefault();
		const payload = {
			...deliveryModal,
			weightKg: Number(deliveryModal.weightKg),
			codAmount: Number(deliveryModal.codAmount) || 0,
			shippingFee: calcShippingFee(deliveryModal.weightKg, deliveryModal.serviceType)
		};
		try {
			if (deliveryModal.id) {
				await apiRequest('delivery', 'deliveries', {
					method: 'PUT',
					path: `/${deliveryModal.id}`,
					body: payload,
					mode: apiMode
				});
				notify(`Đã cập nhật vận đơn #${deliveryModal.id}`);
			} else {
				await apiRequest('delivery', 'deliveries', {
					method: 'POST',
					body: payload,
					mode: apiMode
				});
				notify('Đã tạo đơn vận chuyển mới');
			}
			setDeliveryModal(null);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	async function deleteDelivery(id) {
		if (!window.confirm(`Xóa đơn vận chuyển #${id}?`)) return;
		try {
			await apiRequest('delivery', 'deliveries', {
				method: 'DELETE',
				path: `/${id}`,
				mode: apiMode
			});
			notify(`Đã xóa vận đơn #${id}`);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	// ── CRUD Driver ─────────────────────────────────────────────────────
	async function saveDriver(e) {
		e.preventDefault();
		try {
			if (driverModal.id) {
				await apiRequest('driver', 'drivers', {
					method: 'PUT',
					path: `/${driverModal.id}`,
					body: driverModal,
					mode: apiMode
				});
				notify(`Đã cập nhật tài xế #${driverModal.id}`);
			} else {
				await apiRequest('driver', 'drivers', {
					method: 'POST',
					body: driverModal,
					mode: apiMode
				});
				notify('Đã thêm tài xế mới');
			}
			setDriverModal(null);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	async function deleteDriver(id) {
		if (!window.confirm(`Xóa tài xế #${id}?`)) return;
		try {
			await apiRequest('driver', 'drivers', {
				method: 'DELETE',
				path: `/${id}`,
				mode: apiMode
			});
			notify(`Đã xóa tài xế #${id}`);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	// ── Cross-Service Assignment ────────────────────────────────────────
	async function handleAssign(e) {
		e.preventDefault();
		const delId = Number(assignDeliveryId || pendingOrders[0]?.id);
		const drvId = Number(assignDriverId || availDrivers[0]?.id);
		const delivery = deliveries.find((d) => Number(d.id) === delId);
		const driver = drivers.find((d) => Number(d.id) === drvId);
		if (!delivery || !driver) {
			notify('Cần ít nhất 1 đơn PENDING và 1 tài xế AVAILABLE', true);
			return;
		}
		try {
			await apiRequest('assignment', 'assignments', {
				method: 'POST',
				body: {
					deliveryId: delId,
					trackingCode: delivery.trackingCode || `#${delivery.id}`,
					driverId: drvId,
					driverName: driver.fullName,
					status: 'PICKED_UP',
					note: assignNote || 'Đã phân công giao hàng'
				},
				mode: apiMode
			});
			await apiRequest('delivery', 'deliveries', {
				method: 'PUT',
				path: `/${delId}`,
				body: { ...delivery, status: 'IN_TRANSIT' },
				mode: apiMode
			});
			await apiRequest('driver', 'drivers', {
				method: 'PUT',
				path: `/${drvId}`,
				body: { ...driver, status: 'BUSY' },
				mode: apiMode
			});
			setAssignNote('');
			notify(`Đã phân công ${driver.fullName} giao đơn ${delivery.trackingCode}`);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	async function completeAssignment(asg) {
		const delivery = deliveries.find((d) => Number(d.id) === Number(asg.deliveryId));
		const driver = drivers.find((d) => Number(d.id) === Number(asg.driverId));
		try {
			await apiRequest('assignment', 'assignments', {
				method: 'PUT',
				path: `/${asg.id}`,
				body: { ...asg, status: 'COMPLETED' },
				mode: apiMode
			});
			if (delivery) {
				await apiRequest('delivery', 'deliveries', {
					method: 'PUT',
					path: `/${delivery.id}`,
					body: { ...delivery, status: 'DELIVERED' },
					mode: apiMode
				});
			}
			if (driver) {
				await apiRequest('driver', 'drivers', {
					method: 'PUT',
					path: `/${driver.id}`,
					body: { ...driver, status: 'AVAILABLE' },
					mode: apiMode
				});
			}
			notify(`Đơn ${asg.trackingCode} đã hoàn tất giao hàng!`);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	async function settlePayment(pay) {
		try {
			await apiRequest('payment', 'payments', {
				method: 'PUT',
				path: `/${pay.id}`,
				body: { ...pay, status: 'SETTLED' },
				mode: apiMode
			});
			notify(`Đã đối soát COD cho đơn ${pay.trackingCode}`);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	return (
		<>
			<ServiceHealthBar health={health} onResetDemo={onResetDemo} />

			{/* KPI Strip */}
			<section className="kpi-strip">
				<div className="kpi-cell">
					<p className="kpi-cell__label">Tổng đơn vận chuyển</p>
					<p className="kpi-cell__value">{deliveries.length}</p>
					<p className="kpi-cell__sub">{pendingOrders.length} đơn chờ lấy hàng</p>
				</div>
				<div className="kpi-cell">
					<p className="kpi-cell__label">Tài xế sẵn sàng</p>
					<p className="kpi-cell__value">{availDrivers.length}</p>
					<p className="kpi-cell__sub">Trên tổng {drivers.length} tài xế</p>
				</div>
				<div className="kpi-cell">
					<p className="kpi-cell__label">Lượt phân công</p>
					<p className="kpi-cell__value">{assignments.length}</p>
					<p className="kpi-cell__sub">Giao tiếp Delivery ↔ Driver</p>
				</div>
				<div className="kpi-cell">
					<p className="kpi-cell__label">Tổng thu hộ COD</p>
					<p className="kpi-cell__value" style={{ fontSize: '1.5rem' }}>{formatVND(totalCod)}</p>
					<p className="kpi-cell__sub">Payment Service :8085</p>
				</div>
			</section>

			{/* Tabs */}
			<div className="admin-tabs" role="tablist">
				{[
					{ id: 'deliveries', label: '01 · Đơn vận chuyển (:8082)' },
					{ id: 'drivers', label: '02 · Tài xế / Shipper (:8081)' },
					{ id: 'assignments', label: '03 · Phân công giao hàng (:8083)' },
					{ id: 'customers', label: '04 · Khách hàng & COD (:8084 / :8085)' }
				].map((t) => (
					<button
						key={t.id}
						type="button"
						role="tab"
						aria-selected={activeTab === t.id}
						className={`admin-tab ${activeTab === t.id ? 'is-active' : ''}`}
						onClick={() => setActiveTab(t.id)}
					>
						{t.label}
					</button>
				))}
			</div>

			<section className="logi-section" style={{ paddingBlock: '2.5rem' }}>
				<div className="shell">
					{/* TAB 1: DELIVERIES */}
					{activeTab === 'deliveries' && (
						<div>
							<div className="toolbar">
								<div className="toolbar__group">
									<input
										type="search"
										className="input-inline"
										placeholder="Tìm mã vận đơn, người gửi/nhận..."
										style={{ minWidth: '16rem' }}
										value={deliveryQuery}
										onChange={(e) => setDeliveryQuery(e.target.value)}
									/>
									<select
										className="input-inline"
										value={deliveryFilter}
										onChange={(e) => setDeliveryFilter(e.target.value)}
									>
										<option value="ALL">Tất cả trạng thái</option>
										<option value="PENDING">PENDING</option>
										<option value="ASSIGNED">ASSIGNED</option>
										<option value="IN_TRANSIT">IN_TRANSIT</option>
										<option value="DELIVERED">DELIVERED</option>
										<option value="CANCELLED">CANCELLED</option>
									</select>
								</div>
								<div className="toolbar__group">
									<button type="button" className="button button--secondary button--sm" onClick={onRefresh}>
										Tải lại
									</button>
									<button
										type="button"
										className="button button--primary button--sm"
										onClick={() => setDeliveryModal({ ...EMPTY_DELIVERY })}
									>
										+ Tạo đơn vận chuyển
									</button>
								</div>
							</div>

							<div className="panel" style={{ padding: 0 }}>
								<div className="table-wrap" tabIndex="0">
									<table className="table table--flush">
										<thead>
											<tr>
												<th>Mã đơn</th>
												<th>Người gửi</th>
												<th>Người nhận &amp; Địa chỉ</th>
												<th>Kiện hàng</th>
												<th className="table__cell--numeric">Cước</th>
												<th className="table__cell--numeric">COD</th>
												<th>Trạng thái</th>
												<th>CRUD</th>
											</tr>
										</thead>
										<tbody>
											{filteredDeliveries.length === 0 ? (
												<tr>
													<td colSpan="8">Không có đơn vận chuyển phù hợp.</td>
												</tr>
											) : (
												filteredDeliveries.map((d) => (
													<tr key={d.id}>
														<th className="mono">{d.trackingCode || `#${d.id}`}</th>
														<td>
															{d.senderName}
															<br />
															<span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)' }}>
																{d.senderPhone}
															</span>
														</td>
														<td>
															<strong>{d.receiverName}</strong>
															<br />
															<span style={{ fontSize: '0.8125rem', color: 'var(--color-ink-3)' }}>
																{d.deliveryAddress}
															</span>
														</td>
														<td>
															{d.packageDesc}
															<br />
															<span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)' }}>
																{d.weightKg} kg · {d.serviceType}
															</span>
														</td>
														<td className="table__cell--numeric">{formatVND(d.shippingFee)}</td>
														<td className="table__cell--numeric">{formatVND(d.codAmount)}</td>
														<td>
															<StatusBadge status={d.status} />
														</td>
														<td>
															<div className="row-actions">
																<button type="button" className="btn-micro" onClick={() => setDeliveryModal({ ...d })}>
																	Sửa
																</button>
																<button
																	type="button"
																	className="btn-micro btn-micro--danger"
																	onClick={() => deleteDelivery(d.id)}
																>
																	Xóa
																</button>
															</div>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}

					{/* TAB 2: DRIVERS */}
					{activeTab === 'drivers' && (
						<div>
							<div className="toolbar">
								<div className="toolbar__group">
									<input
										type="search"
										className="input-inline"
										placeholder="Tìm tên tài xế, biển số, khu vực..."
										style={{ minWidth: '16rem' }}
										value={driverQuery}
										onChange={(e) => setDriverQuery(e.target.value)}
									/>
									<select
										className="input-inline"
										value={driverFilter}
										onChange={(e) => setDriverFilter(e.target.value)}
									>
										<option value="ALL">Tất cả trạng thái</option>
										<option value="AVAILABLE">AVAILABLE</option>
										<option value="BUSY">BUSY</option>
										<option value="OFFLINE">OFFLINE</option>
									</select>
								</div>
								<div className="toolbar__group">
									<button type="button" className="button button--secondary button--sm" onClick={onRefresh}>
										Tải lại
									</button>
									<button
										type="button"
										className="button button--primary button--sm"
										onClick={() => setDriverModal({ ...EMPTY_DRIVER })}
									>
										+ Thêm tài xế
									</button>
								</div>
							</div>

							<div className="panel" style={{ padding: 0 }}>
								<div className="table-wrap" tabIndex="0">
									<table className="table table--flush">
										<thead>
											<tr>
												<th>ID</th>
												<th>Họ tên tài xế</th>
												<th>SĐT</th>
												<th>Biển số xe</th>
												<th>Phương tiện</th>
												<th>Khu vực</th>
												<th>Trạng thái</th>
												<th>CRUD</th>
											</tr>
										</thead>
										<tbody>
											{filteredDrivers.length === 0 ? (
												<tr>
													<td colSpan="8">Không có tài xế phù hợp.</td>
												</tr>
											) : (
												filteredDrivers.map((d) => (
													<tr key={d.id}>
														<th className="mono">#{d.id}</th>
														<td><strong>{d.fullName}</strong></td>
														<td className="mono">{d.phone}</td>
														<td className="mono">{d.licensePlate}</td>
														<td><span className="badge badge--outline badge--sm">{d.vehicleType}</span></td>
														<td>{d.area}</td>
														<td><StatusBadge status={d.status} /></td>
														<td>
															<div className="row-actions">
																<button type="button" className="btn-micro" onClick={() => setDriverModal({ ...d })}>
																	Sửa
																</button>
																<button
																	type="button"
																	className="btn-micro btn-micro--danger"
																	onClick={() => deleteDriver(d.id)}
																>
																	Xóa
																</button>
															</div>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}

					{/* TAB 3: ASSIGNMENTS */}
					{activeTab === 'assignments' && (
						<div>
							<div className="panel" style={{ marginBottom: '1.5rem' }}>
								<div className="panel__head">
									<div>
										<p className="label">Quy trình liên Microservice</p>
										<h3 style={{ fontSize: 'var(--text-h3)', marginTop: '0.25rem' }}>
											Điều phối &amp; Phân công tài xế giao hàng
										</h3>
									</div>
									<span className="badge badge--signal badge--sm">Assignment ↔ Delivery ↔ Driver</span>
								</div>

								<form className="logi-grid-form--3" style={{ alignItems: 'end' }} onSubmit={handleAssign}>
									<div className="field">
										<label className="field__label">Đơn chờ lấy hàng (PENDING)</label>
										<select
											className="field__control field__control--select"
											style={{ height: '3rem' }}
											value={assignDeliveryId}
											onChange={(e) => setAssignDeliveryId(e.target.value)}
										>
											{pendingOrders.length === 0 ? (
												<option value="">Không có đơn PENDING</option>
											) : (
												pendingOrders.map((d) => (
													<option key={d.id} value={d.id}>
														{d.trackingCode || `#${d.id}`} — {d.receiverName}
													</option>
												))
											)}
										</select>
									</div>

									<div className="field">
										<label className="field__label">Tài xế sẵn sàng (AVAILABLE)</label>
										<select
											className="field__control field__control--select"
											style={{ height: '3rem' }}
											value={assignDriverId}
											onChange={(e) => setAssignDriverId(e.target.value)}
										>
											{availDrivers.length === 0 ? (
												<option value="">Không có tài xế AVAILABLE</option>
											) : (
												availDrivers.map((d) => (
													<option key={d.id} value={d.id}>
														#{d.id} {d.fullName} ({d.area})
													</option>
												))
											)}
										</select>
									</div>

									<div className="field">
										<label className="field__label">Ghi chú điều phối</label>
										<input
											type="text"
											className="field__control"
											style={{ height: '3rem' }}
											placeholder="VD: Giao trước 17h"
											value={assignNote}
											onChange={(e) => setAssignNote(e.target.value)}
										/>
									</div>

									<div className="logi-span-full">
										<button type="submit" className="button button--primary button--md">
											Xác nhận phân công tài xế
										</button>
									</div>
								</form>
							</div>

							<div className="panel" style={{ padding: 0 }}>
								<div className="table-wrap" tabIndex="0">
									<table className="table table--flush">
										<thead>
											<tr>
												<th>Mã phân công</th>
												<th>Mã vận đơn</th>
												<th>Tài xế</th>
												<th>Thời gian</th>
												<th>Ghi chú</th>
												<th>Trạng thái</th>
												<th>Hành động</th>
											</tr>
										</thead>
										<tbody>
											{assignments.map((a) => (
												<tr key={a.id}>
													<th className="mono">#{a.id}</th>
													<td className="mono"><strong>{a.trackingCode || `#${a.deliveryId}`}</strong></td>
													<td>{a.driverName || `Tài xế #${a.driverId}`}</td>
													<td className="mono">{a.assignedAt}</td>
													<td>{a.note || '—'}</td>
													<td><StatusBadge status={a.status} /></td>
													<td>
														{a.status !== 'COMPLETED' ? (
															<button type="button" className="btn-micro" onClick={() => completeAssignment(a)}>
																Xác nhận đã giao
															</button>
														) : (
															<span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)' }}>
																Đã xong
															</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}

					{/* TAB 4: CUSTOMERS & COD */}
					{activeTab === 'customers' && (
						<div className="logi-grid-2">
							<div className="panel" style={{ padding: 0 }}>
								<div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div>
										<p className="label">Customer Service :8084</p>
										<h3 style={{ fontSize: 'var(--text-h3)' }}>Khách hàng / Shop</h3>
									</div>
									<span className="badge badge--outline badge--sm">{customers.length}</span>
								</div>
								<div className="table-wrap" tabIndex="0">
									<table className="table table--flush table--compact">
										<thead>
											<tr>
												<th>Khách hàng</th>
												<th>Liên hệ</th>
												<th>Địa chỉ</th>
												<th>Loại</th>
											</tr>
										</thead>
										<tbody>
											{customers.map((c) => (
												<tr key={c.id}>
													<th>{c.name}</th>
													<td className="mono" style={{ fontSize: '0.75rem' }}>
														{c.phone}
														<br />
														{c.email}
													</td>
													<td>{c.defaultAddress}</td>
													<td><span className="badge badge--outline badge--sm">{c.type}</span></td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							<div className="panel" style={{ padding: 0 }}>
								<div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div>
										<p className="label">Payment Service :8085</p>
										<h3 style={{ fontSize: 'var(--text-h3)' }}>Đối soát cước &amp; COD</h3>
									</div>
									<span className="badge badge--outline badge--sm">{payments.length}</span>
								</div>
								<div className="table-wrap" tabIndex="0">
									<table className="table table--flush table--compact">
										<thead>
											<tr>
												<th>Mã đơn</th>
												<th className="table__cell--numeric">Cước</th>
												<th className="table__cell--numeric">COD</th>
												<th>Trạng thái</th>
												<th>Đối soát</th>
											</tr>
										</thead>
										<tbody>
											{payments.map((p) => (
												<tr key={p.id}>
													<th className="mono">{p.trackingCode || `#${p.deliveryId}`}</th>
													<td className="table__cell--numeric">{formatVND(p.shippingFee)}</td>
													<td className="table__cell--numeric">{formatVND(p.codAmount)}</td>
													<td><StatusBadge status={p.status} /></td>
													<td>
														{p.status !== 'SETTLED' ? (
															<button type="button" className="btn-micro" onClick={() => settlePayment(p)}>
																Đối soát
															</button>
														) : (
															<span className="mono" style={{ fontSize: '0.75rem', color: 'var(--color-ink-3)' }}>OK</span>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* MODAL DRIVER */}
			{driverModal && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 80,
						backgroundColor: 'rgb(7 42 29 / 0.55)',
						display: 'grid',
						placeItems: 'center',
						padding: '1rem'
					}}
				>
					<form className="logi-modal" style={{ display: 'block' }} onSubmit={saveDriver}>
						<div className="logi-modal__head">
							<h3 style={{ fontSize: 'var(--text-h3)', color: '#fff' }}>
								{driverModal.id ? `Cập nhật tài xế #${driverModal.id}` : 'Thêm tài xế mới'}
							</h3>
							<button
								type="button"
								className="btn-micro"
								style={{ color: '#fff', borderColor: 'var(--paper-30)' }}
								onClick={() => setDriverModal(null)}
							>
								Đóng
							</button>
						</div>
						<div className="logi-modal__body logi-grid-form">
							<div className="field">
								<label className="field__label">Họ tên tài xế</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={driverModal.fullName}
									onChange={(e) => setDriverModal({ ...driverModal, fullName: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Số điện thoại</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={driverModal.phone}
									onChange={(e) => setDriverModal({ ...driverModal, phone: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Biển số xe</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={driverModal.licensePlate}
									onChange={(e) => setDriverModal({ ...driverModal, licensePlate: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Loại xe</label>
								<select
									className="field__control field__control--select"
									style={{ height: '2.75rem' }}
									value={driverModal.vehicleType}
									onChange={(e) => setDriverModal({ ...driverModal, vehicleType: e.target.value })}
								>
									<option value="MOTORBIKE">MOTORBIKE</option>
									<option value="VAN">VAN</option>
									<option value="TRUCK">TRUCK</option>
								</select>
							</div>
							<div className="field">
								<label className="field__label">Khu vực</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={driverModal.area}
									onChange={(e) => setDriverModal({ ...driverModal, area: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Trạng thái</label>
								<select
									className="field__control field__control--select"
									style={{ height: '2.75rem' }}
									value={driverModal.status}
									onChange={(e) => setDriverModal({ ...driverModal, status: e.target.value })}
								>
									<option value="AVAILABLE">AVAILABLE</option>
									<option value="BUSY">BUSY</option>
									<option value="OFFLINE">OFFLINE</option>
								</select>
							</div>
						</div>
						<div className="logi-modal__foot">
							<button type="button" className="button button--secondary button--sm" onClick={() => setDriverModal(null)}>
								Hủy
							</button>
							<button type="submit" className="button button--primary button--sm">
								Lưu tài xế
							</button>
						</div>
					</form>
				</div>
			)}

			{/* MODAL DELIVERY */}
			{deliveryModal && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 80,
						backgroundColor: 'rgb(7 42 29 / 0.55)',
						display: 'grid',
						placeItems: 'center',
						padding: '1rem'
					}}
				>
					<form className="logi-modal" style={{ display: 'block', maxHeight: '90vh', overflowY: 'auto' }} onSubmit={saveDelivery}>
						<div className="logi-modal__head">
							<h3 style={{ fontSize: 'var(--text-h3)', color: '#fff' }}>
								{deliveryModal.id ? `Cập nhật vận đơn #${deliveryModal.id}` : 'Tạo đơn vận chuyển mới'}
							</h3>
							<button
								type="button"
								className="btn-micro"
								style={{ color: '#fff', borderColor: 'var(--paper-30)' }}
								onClick={() => setDeliveryModal(null)}
							>
								Đóng
							</button>
						</div>
						<div className="logi-modal__body logi-grid-form">
							<div className="field">
								<label className="field__label">Người gửi</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.senderName}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, senderName: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">SĐT người gửi</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.senderPhone}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, senderPhone: e.target.value })}
									required
								/>
							</div>
							<div className="field logi-span-full">
								<label className="field__label">Địa chỉ lấy hàng</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.pickupAddress}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, pickupAddress: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Người nhận</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.receiverName}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, receiverName: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">SĐT người nhận</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.receiverPhone}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, receiverPhone: e.target.value })}
									required
								/>
							</div>
							<div className="field logi-span-full">
								<label className="field__label">Địa chỉ giao hàng</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.deliveryAddress}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, deliveryAddress: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Mô tả kiện hàng</label>
								<input
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.packageDesc}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, packageDesc: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Khối lượng (kg)</label>
								<input
									type="number"
									step="0.1"
									min="0.1"
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.weightKg}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, weightKg: e.target.value })}
									required
								/>
							</div>
							<div className="field">
								<label className="field__label">Dịch vụ</label>
								<select
									className="field__control field__control--select"
									style={{ height: '2.75rem' }}
									value={deliveryModal.serviceType}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, serviceType: e.target.value })}
								>
									<option value="STANDARD">STANDARD</option>
									<option value="EXPRESS">EXPRESS</option>
								</select>
							</div>
							<div className="field">
								<label className="field__label">COD (VNĐ)</label>
								<input
									type="number"
									step="1000"
									min="0"
									className="field__control"
									style={{ height: '2.75rem' }}
									value={deliveryModal.codAmount}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, codAmount: e.target.value })}
								/>
							</div>
							<div className="field logi-span-full">
								<label className="field__label">Trạng thái</label>
								<select
									className="field__control field__control--select"
									style={{ height: '2.75rem' }}
									value={deliveryModal.status}
									onChange={(e) => setDeliveryModal({ ...deliveryModal, status: e.target.value })}
								>
									<option value="PENDING">PENDING</option>
									<option value="ASSIGNED">ASSIGNED</option>
									<option value="IN_TRANSIT">IN_TRANSIT</option>
									<option value="DELIVERED">DELIVERED</option>
									<option value="CANCELLED">CANCELLED</option>
								</select>
							</div>
						</div>
						<div className="logi-modal__foot">
							<button type="button" className="button button--secondary button--sm" onClick={() => setDeliveryModal(null)}>
								Hủy
							</button>
							<button type="submit" className="button button--primary button--sm">
								Lưu vận đơn
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}
