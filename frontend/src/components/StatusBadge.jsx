const BADGE_MAP = {
	PENDING: { label: 'Chờ lấy hàng', tone: 'badge--caution' },
	ASSIGNED: { label: 'Đã phân tài xế', tone: 'badge--moss' },
	IN_TRANSIT: { label: 'Đang giao hàng', tone: 'badge--signal' },
	DELIVERED: { label: 'Giao thành công', tone: 'badge--affirm' },
	CANCELLED: { label: 'Đã hủy', tone: 'badge--danger' },
	AVAILABLE: { label: 'Sẵn sàng', tone: 'badge--affirm' },
	BUSY: { label: 'Đang giao hàng', tone: 'badge--caution' },
	OFFLINE: { label: 'Ngoại tuyến', tone: 'badge--neutral' },
	PICKED_UP: { label: 'Đang giao', tone: 'badge--signal' },
	COMPLETED: { label: 'Hoàn tất', tone: 'badge--affirm' },
	UNPAID: { label: 'Chưa thu', tone: 'badge--neutral' },
	PENDING_COLLECT: { label: 'Chờ thu COD', tone: 'badge--caution' },
	SETTLED: { label: 'Đã đối soát', tone: 'badge--affirm' }
};

export default function StatusBadge({ status }) {
	const meta = BADGE_MAP[status] || { label: status || 'N/A', tone: 'badge--neutral' };
	return <span className={`badge ${meta.tone} badge--sm`}>{meta.label}</span>;
}
