import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClientPortal from './pages/client/ClientPortal';
import { apiRequest, checkServiceHealth, resetDemoData, SERVICES } from './services/api';

export default function App() {
	const [portal, setPortal] = useState('client'); // 'client' | 'admin'
	const [apiMode, setApiMode] = useState(() => localStorage.getItem('a1_jsx_mode') || 'auto');
	const [dataSource, setDataSource] = useState('demo');
	const [health, setHealth] = useState({});
	const [toast, setToast] = useState({ visible: false, message: '', isError: false });
	const [data, setData] = useState({
		deliveries: [],
		drivers: [],
		assignments: [],
		customers: [],
		payments: []
	});

	const notify = useCallback((message, isError = false) => {
		setToast({ visible: true, message, isError });
		clearTimeout(window.__a1ToastTimer);
		window.__a1ToastTimer = setTimeout(() => {
			setToast((prev) => ({ ...prev, visible: false }));
		}, 3200);
	}, []);

	const refreshAll = useCallback(async () => {
		try {
			const [delRes, drvRes, asgRes, cusRes, payRes] = await Promise.all([
				apiRequest('delivery', 'deliveries', { mode: apiMode }),
				apiRequest('driver', 'drivers', { mode: apiMode }),
				apiRequest('assignment', 'assignments', { mode: apiMode }),
				apiRequest('customer', 'customers', { mode: apiMode }),
				apiRequest('payment', 'payments', { mode: apiMode })
			]);
			setData({
				deliveries: Array.isArray(delRes.data) ? delRes.data : [],
				drivers: Array.isArray(drvRes.data) ? drvRes.data : [],
				assignments: Array.isArray(asgRes.data) ? asgRes.data : [],
				customers: Array.isArray(cusRes.data) ? cusRes.data : [],
				payments: Array.isArray(payRes.data) ? payRes.data : []
			});
			setDataSource(delRes.source);
		} catch (err) {
			notify(err.message, true);
		}
	}, [apiMode, notify]);

	const checkHealth = useCallback(async () => {
		const keys = Object.keys(SERVICES);
		const results = await Promise.all(keys.map(async (k) => [k, await checkServiceHealth(k)]));
		setHealth(Object.fromEntries(results));
	}, []);

	useEffect(() => {
		localStorage.setItem('a1_jsx_mode', apiMode);
		refreshAll();
	}, [apiMode, refreshAll]);

	useEffect(() => {
		checkHealth();
	}, [checkHealth]);

	function handleResetDemo() {
		resetDemoData();
		refreshAll();
		notify('Đã khôi phục dữ liệu mẫu');
	}

	return (
		<div className="page" id="top">
			<Header
				portal={portal}
				setPortal={setPortal}
				apiMode={apiMode}
				setApiMode={setApiMode}
				onCheckHealth={async () => {
					await checkHealth();
					notify('Đã kiểm tra trạng thái 5 Java Microservices');
				}}
			/>

			<main className="page__main">
				{portal === 'client' ? (
					<ClientPortal
						deliveries={data.deliveries}
						dataSource={dataSource}
						apiMode={apiMode}
						onRefresh={refreshAll}
						notify={notify}
					/>
				) : (
					<AdminDashboard
						data={data}
						health={health}
						apiMode={apiMode}
						onRefresh={refreshAll}
						onResetDemo={handleResetDemo}
						notify={notify}
					/>
				)}
			</main>

			<footer
				style={{
					backgroundColor: 'var(--color-signal-dark)',
					color: 'var(--paper-75)',
					paddingBlock: '2rem',
					borderTop: '1px solid var(--paper-15)'
				}}
			>
				<div className="shell" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
					<div>
						<span className="logo">
							<span className="logo__mark" aria-hidden="true">A1</span>
							<span className="logo__name" style={{ color: '#fff' }}>Express Logistics</span>
						</span>
						<p style={{ fontSize: '0.8125rem', color: 'var(--paper-55)', marginTop: '0.35rem' }}>
							Backend: Java Spring Boot Microservices · Frontend: React + Vite (JSX)
						</p>
					</div>
					<button
						type="button"
						className="button button--outline-light button--sm"
						onClick={() => setPortal(portal === 'client' ? 'admin' : 'client')}
					>
						{portal === 'client' ? 'Chuyển sang Admin Console →' : '← Quay lại Cổng Khách Hàng'}
					</button>
				</div>
			</footer>

			<div
				className={`logi-toast ${toast.visible ? 'is-visible' : ''} ${toast.isError ? 'logi-toast--error' : ''}`}
				role="status"
			>
				{toast.message}
			</div>
		</div>
	);
}
