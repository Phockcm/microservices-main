import { useMemo, useState } from 'react';
import StatusBadge from '../../components/StatusBadge';
import { apiRequest, calcShippingFee, formatVND } from '../../services/api';

const STEP_MAP = {
	PENDING: 1,
	ASSIGNED: 2,
	IN_TRANSIT: 3,
	DELIVERED: 4,
	CANCELLED: 0
};

const INITIAL_FORM = {
	senderName: '',
	senderPhone: '',
	pickupAddress: '',
	receiverName: '',
	receiverPhone: '',
	deliveryAddress: '',
	packageDesc: '',
	weightKg: 1.0,
	distanceKm: 8,
	serviceType: 'STANDARD',
	codAmount: 0
};

export default function ClientPortal({ deliveries, dataSource, apiMode, onRefresh, notify }) {
	const [trackInput, setTrackInput] = useState('');
	const [trackedOrder, setTrackedOrder] = useState(undefined);
	const [form, setForm] = useState(INITIAL_FORM);

	const estimatedFee = useMemo(
		() => calcShippingFee(form.weightKg, form.serviceType, form.distanceKm),
		[form.weightKg, form.serviceType, form.distanceKm]
	);

	const transitCount = deliveries.filter((d) => d.status === 'IN_TRANSIT').length;
	const deliveredCount = deliveries.filter((d) => d.status === 'DELIVERED').length;

	function handleTrack(code) {
		const q = String(code || '').trim().toLowerCase();
		if (!q) return;
		setTrackInput(code);
		const found = deliveries.find(
			(d) => String(d.trackingCode || '').toLowerCase() === q || String(d.id) === q
		);
		setTrackedOrder(found || null);
	}

	async function handleCreateDelivery(e) {
		e.preventDefault();
		const payload = {
			senderName: form.senderName,
			senderPhone: form.senderPhone,
			pickupAddress: form.pickupAddress,
			receiverName: form.receiverName,
			receiverPhone: form.receiverPhone,
			deliveryAddress: form.deliveryAddress,
			packageDesc: form.packageDesc,
			weightKg: Number(form.weightKg),
			serviceType: form.serviceType,
			shippingFee: estimatedFee,
			codAmount: Number(form.codAmount) || 0,
			status: 'PENDING'
		};

		try {
			const { data, source } = await apiRequest('delivery', 'deliveries', {
				method: 'POST',
				body: payload,
				mode: apiMode
			});
			notify(`Đã tạo vận đơn ${data.trackingCode || '#' + data.id} (${source.toUpperCase()})`);
			setForm(INITIAL_FORM);
			setTrackedOrder(data);
			await onRefresh();
		} catch (err) {
			notify(err.message, true);
		}
	}

	const activeStep = trackedOrder ? STEP_MAP[trackedOrder.status] ?? 1 : 0;

	return (
		<>
			{/* 01. HERO & TRA CỨU */}
			<section className="logi-hero" id="tracking" style={{ paddingTop: '3.5rem' }}>
				<div className="shell">
					<div className="logi-hero__grid">
						<div>
							<p className="logi-hero__eyebrow">
								<span className="logi-hero__dot" aria-hidden="true" />
								React JSX Frontend · Spring Boot Microservices
							</p>
							<h1 className="logi-hero__title">
								Giao hàng chính xác.
								<br />
								Theo dõi từng chặng.
							</h1>
							<p className="logi-hero__lead">
								Tạo vận đơn trực tuyến, ước tính cước phí minh bạch và kiểm tra hành trình kiện hàng theo thời gian thực qua REST API Java.
							</p>
						</div>

						<div className="track-box">
							<p className="track-box__title">01 / Tra cứu hành trình vận đơn (Delivery Service :8082)</p>
							<form
								className="track-box__form"
								onSubmit={(e) => {
									e.preventDefault();
									handleTrack(trackInput);
								}}
							>
								<input
									type="text"
									className="track-box__input"
									placeholder="Nhập mã vận đơn (VD: A1-2026-001)"
									value={trackInput}
									onChange={(e) => setTrackInput(e.target.value)}
									required
								/>
								<button type="submit" className="button button--accent button--md">
									Tra cứu
								</button>
							</form>
							<div className="track-box__hints">
								<span>Mã mẫu:</span>
								{['A1-2026-001', 'A1-2026-002', 'A1-2026-003'].map((code) => (
									<button
										key={code}
										type="button"
										className="track-chip"
										onClick={() => handleTrack(code)}
									>
										{code}
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Kết quả tra cứu */}
					{trackedOrder !== undefined && (
						<div className="tracking-card" style={{ color: 'var(--color-ink)' }}>
							{trackedOrder === null ? (
								<>
									<p className="label" style={{ color: 'var(--color-danger)' }}>
										Không tìm thấy vận đơn
									</p>
									<p style={{ marginTop: '0.5rem' }}>
										Vui lòng kiểm tra lại mã vận đơn (VD: <code className="mono">A1-2026-001</code>) hoặc ID đơn hàng.
									</p>
								</>
							) : (
								<>
									<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
										<div>
											<p className="label">Kết quả tra cứu vận đơn</p>
											<h3 className="mono" style={{ fontSize: '1.375rem', marginTop: '0.25rem' }}>
												{trackedOrder.trackingCode || `#${trackedOrder.id}`}
											</h3>
										</div>
										<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
											<StatusBadge status={trackedOrder.status} />
											<span className="badge badge--outline badge--sm">{trackedOrder.serviceType || 'STANDARD'}</span>
										</div>
									</div>

									<div className="logi-grid-2" style={{ marginTop: '1.25rem', fontSize: '0.875rem' }}>
										<div>
											<p className="label">Người gửi</p>
											<p>
												<strong>{trackedOrder.senderName}</strong> · <span className="mono">{trackedOrder.senderPhone}</span>
											</p>
											<p style={{ color: 'var(--color-ink-3)' }}>{trackedOrder.pickupAddress}</p>
										</div>
										<div>
											<p className="label">Người nhận</p>
											<p>
												<strong>{trackedOrder.receiverName}</strong> · <span className="mono">{trackedOrder.receiverPhone}</span>
											</p>
											<p style={{ color: 'var(--color-ink-3)' }}>{trackedOrder.deliveryAddress}</p>
										</div>
									</div>

									<div className="tracking-steps">
										{[
											{ code: 'STEP 01', name: 'Tiếp nhận đơn', time: trackedOrder.createdAt || 'Đã tạo' },
											{ code: 'STEP 02', name: 'Phân công tài xế', time: activeStep >= 2 ? 'Đã điều phối' : 'Chờ xử lý' },
											{ code: 'STEP 03', name: 'Đang giao hàng', time: activeStep >= 3 ? 'Shipper đang giao' : 'Chưa xuất tuyến' },
											{ code: 'STEP 04', name: 'Giao thành công', time: activeStep >= 4 ? 'Đã ký nhận POD' : 'Dự kiến hôm nay' }
										].map((st, idx) => {
											const n = idx + 1;
											const cls =
												n < activeStep
													? 'tracking-step--done'
													: n === activeStep
														? 'tracking-step--active'
														: '';
											return (
												<div className={`tracking-step ${cls}`} key={st.code}>
													<p className="tracking-step__code">{st.code}</p>
													<p className="tracking-step__name">{st.name}</p>
													<p className="tracking-step__time">{st.time}</p>
												</div>
											);
										})}
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</section>

			{/* 02. KPI STRIP */}
			<section className="kpi-strip" aria-label="Thống kê nhanh">
				<div className="kpi-cell">
					<p className="kpi-cell__label">Tổng vận đơn</p>
					<p className="kpi-cell__value">{deliveries.length}</p>
					<p className="kpi-cell__sub">Đang lưu trên Delivery Service</p>
				</div>
				<div className="kpi-cell">
					<p className="kpi-cell__label">Đang vận chuyển</p>
					<p className="kpi-cell__value">{transitCount}</p>
					<p className="kpi-cell__sub">Tài xế đang trên tuyến</p>
				</div>
				<div className="kpi-cell">
					<p className="kpi-cell__label">Giao thành công</p>
					<p className="kpi-cell__value">{deliveredCount}</p>
					<p className="kpi-cell__sub">Đã xác nhận ký nhận POD</p>
				</div>
				<div className="kpi-cell">
					<p className="kpi-cell__label">Nguồn dữ liệu</p>
					<p
						className="kpi-cell__value"
						style={{
							fontSize: '1.125rem',
							paddingTop: '0.35rem',
							color: dataSource === 'live' ? 'var(--color-signal)' : 'var(--color-caution)'
						}}
					>
						{dataSource === 'live' ? 'LIVE JAVA API' : 'DEMO LOCAL'}
					</p>
					<p className="kpi-cell__sub">Port 8082 (SQL Server)</p>
				</div>
			</section>

			{/* 03. TẠO ĐƠN VẬN CHUYỂN */}
			<section className="logi-section" id="create-order">
				<div className="shell">
					<div className="logi-section__head">
						<div>
							<p className="label">02 / Gửi hàng mới</p>
							<h2 style={{ fontSize: 'var(--text-h1)', marginTop: '0.25rem' }}>
								Tạo đơn vận chuyển &amp; Ước tính cước
							</h2>
						</div>
						<span className="badge badge--outline badge--md">POST /api/deliveries</span>
					</div>

					<div className="logi-grid-2">
						<form className="panel" onSubmit={handleCreateDelivery}>
							<div className="panel__head">
								<h3 style={{ fontSize: 'var(--text-h3)' }}>Thông tin vận đơn</h3>
								<span className="label">Bắt buộc nhập đầy đủ</span>
							</div>

							<div className="logi-grid-form">
								<div className="field">
									<div className="field__control-wrap">
										<input
											className="field__control field__control--input"
											id="f-sender-name"
											placeholder=" "
											value={form.senderName}
											onChange={(e) => setForm({ ...form, senderName: e.target.value })}
											required
										/>
										<label className="field__label-floating" htmlFor="f-sender-name">
											Tên người gửi / Shop
										</label>
									</div>
								</div>

								<div className="field">
									<div className="field__control-wrap">
										<input
											className="field__control field__control--input"
											id="f-sender-phone"
											type="tel"
											placeholder=" "
											value={form.senderPhone}
											onChange={(e) => setForm({ ...form, senderPhone: e.target.value })}
											required
										/>
										<label className="field__label-floating" htmlFor="f-sender-phone">
											SĐT người gửi
										</label>
									</div>
								</div>

								<div className="field logi-span-full">
									<div className="field__control-wrap">
										<input
											className="field__control field__control--input"
											id="f-pickup"
											placeholder=" "
											value={form.pickupAddress}
											onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
											required
										/>
										<label className="field__label-floating" htmlFor="f-pickup">
											Địa chỉ lấy hàng
										</label>
									</div>
								</div>

								<div className="field">
									<div className="field__control-wrap">
										<input
											className="field__control field__control--input"
											id="f-receiver-name"
											placeholder=" "
											value={form.receiverName}
											onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
											required
										/>
										<label className="field__label-floating" htmlFor="f-receiver-name">
											Tên người nhận
										</label>
									</div>
								</div>

								<div className="field">
									<div className="field__control-wrap">
										<input
											className="field__control field__control--input"
											id="f-receiver-phone"
											type="tel"
											placeholder=" "
											value={form.receiverPhone}
											onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
											required
										/>
										<label className="field__label-floating" htmlFor="f-receiver-phone">
											SĐT người nhận
										</label>
									</div>
								</div>

								<div className="field logi-span-full">
									<div className="field__control-wrap">
										<input
											className="field__control field__control--input"
											id="f-delivery-addr"
											placeholder=" "
											value={form.deliveryAddress}
											onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
											required
										/>
										<label className="field__label-floating" htmlFor="f-delivery-addr">
											Địa chỉ giao hàng
										</label>
									</div>
								</div>

								<div className="field logi-span-full">
									<div className="field__control-wrap">
										<input
											className="field__control field__control--input"
											id="f-pkg-desc"
											placeholder=" "
											value={form.packageDesc}
											onChange={(e) => setForm({ ...form, packageDesc: e.target.value })}
											required
										/>
										<label className="field__label-floating" htmlFor="f-pkg-desc">
											Mô tả kiện hàng
										</label>
									</div>
								</div>

								<div className="field">
									<label className="field__label" htmlFor="f-weight">Khối lượng (kg)</label>
									<input
										className="field__control"
										style={{ height: '3rem' }}
										id="f-weight"
										type="number"
										step="0.1"
										min="0.1"
										value={form.weightKg}
										onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
										required
									/>
								</div>

								<div className="field">
									<label className="field__label" htmlFor="f-distance">Khoảng cách (km)</label>
									<input
										className="field__control"
										style={{ height: '3rem' }}
										id="f-distance"
										type="number"
										min="1"
										value={form.distanceKm}
										onChange={(e) => setForm({ ...form, distanceKm: e.target.value })}
										required
									/>
								</div>

								<div className="field">
									<label className="field__label" htmlFor="f-service">Gói dịch vụ</label>
									<select
										className="field__control field__control--select"
										style={{ height: '3rem' }}
										id="f-service"
										value={form.serviceType}
										onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
									>
										<option value="STANDARD">Giao Chuẩn (24h - 48h)</option>
										<option value="EXPRESS">Giao Hỏa Tốc (Trong ngày)</option>
									</select>
								</div>

								<div className="field">
									<label className="field__label" htmlFor="f-cod">Tiền thu hộ COD (VNĐ)</label>
									<input
										className="field__control"
										style={{ height: '3rem' }}
										id="f-cod"
										type="number"
										step="1000"
										min="0"
										value={form.codAmount}
										onChange={(e) => setForm({ ...form, codAmount: e.target.value })}
									/>
								</div>
							</div>

							<div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
								<button type="submit" className="button button--primary button--md">
									Xác nhận tạo vận đơn
								</button>
								<button
									type="button"
									className="button button--secondary button--md"
									onClick={() => setForm(INITIAL_FORM)}
								>
									Làm mới
								</button>
							</div>
						</form>

						<div className="fee-summary">
							<div>
								<p className="label" style={{ color: 'var(--color-accent)' }}>
									Ước tính chi phí vận chuyển
								</p>
								<h3 style={{ fontSize: 'var(--text-h2)', color: '#fff', marginTop: '0.5rem' }}>
									Chi tiết cước phí dự kiến
								</h3>
								<div style={{ marginTop: '1.5rem' }}>
									<div className="fee-summary__row">
										<span>Gói dịch vụ</span>
										<strong className="mono">{form.serviceType === 'EXPRESS' ? 'HỎA TỐC' : 'TIÊU CHUẨN'}</strong>
									</div>
									<div className="fee-summary__row">
										<span>Khối lượng quy đổi</span>
										<strong className="mono">{Number(form.weightKg || 0).toFixed(1)} kg</strong>
									</div>
									<div className="fee-summary__row">
										<span>Khoảng cách tuyến</span>
										<strong className="mono">{form.distanceKm || 0} km</strong>
									</div>
									<div className="fee-summary__row">
										<span>Tiền thu hộ (COD)</span>
										<strong className="mono">{formatVND(form.codAmount)}</strong>
									</div>
								</div>
							</div>

							<div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--paper-25)' }}>
								<p className="label" style={{ color: 'var(--paper-60)' }}>Tổng cước vận chuyển</p>
								<p className="fee-summary__total">{formatVND(estimatedFee)}</p>
								<p style={{ fontSize: '0.8125rem', color: 'var(--paper-60)', marginTop: '0.5rem' }}>
									Cước cơ bản: 18.000đ (Chuẩn) / 30.000đ (Hỏa tốc). Phụ phí +5.000đ/kg vượt quá 1kg và +4.000đ mỗi 5km vượt quá 10km.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* 04. DANH SÁCH ĐƠN GẦN ĐÂY */}
			<section className="logi-section logi-section--surface">
				<div className="shell">
					<div className="logi-section__head">
						<div>
							<p className="label">03 / Lịch sử gửi hàng</p>
							<h2 style={{ fontSize: 'var(--text-h1)', marginTop: '0.25rem' }}>Danh sách vận đơn gần đây</h2>
						</div>
						<button type="button" className="button button--secondary button--sm" onClick={onRefresh}>
							Tải lại từ API
						</button>
					</div>

					<div className="table-wrap" tabIndex="0">
						<table className="table">
							<thead>
								<tr>
									<th>Mã vận đơn</th>
									<th>Người gửi</th>
									<th>Người nhận &amp; Địa chỉ giao</th>
									<th>Kiện hàng</th>
									<th>Dịch vụ</th>
									<th className="table__cell--numeric">Cước phí</th>
									<th className="table__cell--numeric">Thu hộ COD</th>
									<th>Trạng thái</th>
									<th>Thao tác</th>
								</tr>
							</thead>
							<tbody>
								{deliveries.length === 0 ? (
									<tr>
										<td colSpan="9">Chưa có vận đơn nào.</td>
									</tr>
								) : (
									deliveries.map((d) => (
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
													{d.weightKg} kg
												</span>
											</td>
											<td>
												<span className="badge badge--outline badge--sm">{d.serviceType || 'STANDARD'}</span>
											</td>
											<td className="table__cell--numeric">{formatVND(d.shippingFee)}</td>
											<td className="table__cell--numeric">{formatVND(d.codAmount)}</td>
											<td>
												<StatusBadge status={d.status} />
											</td>
											<td>
												<button
													type="button"
													className="btn-micro"
													onClick={() => handleTrack(d.trackingCode || d.id)}
												>
													Theo dõi
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</>
	);
}
