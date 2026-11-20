export default function Header({ portal, setPortal, apiMode, setApiMode, onCheckHealth }) {
	return (
		<header
			className="site-header"
			style={{
				backgroundColor: 'var(--color-signal)',
				color: '#fff',
				borderBottom: '1px solid var(--paper-15)'
			}}
		>
			<nav className="site-header__inner" aria-label="Điều hướng chính">
				<div className="site-header__bar">
					<a
						href="#top"
						onClick={(e) => {
							e.preventDefault();
							setPortal('client');
						}}
					>
						<span className="logo">
							<span className="logo__mark" aria-hidden="true">A1</span>
							<span className="logo__name" style={{ color: '#fff' }}>
								{portal === 'admin' ? 'Dispatch Admin' : 'Express'}
							</span>
						</span>
					</a>

					<ul className="primary-nav">
						<li>
							<button
								type="button"
								className="nav-link"
								style={{
									background: 'transparent',
									border: 0,
									color: portal === 'client' ? 'var(--color-accent)' : '#fff',
									cursor: 'pointer'
								}}
								onClick={() => setPortal('client')}
							>
								Cổng Khách Hàng (Client)
							</button>
						</li>
						<li>
							<button
								type="button"
								className="nav-link"
								style={{
									background: 'transparent',
									border: 0,
									color: portal === 'admin' ? 'var(--color-accent)' : '#fff',
									cursor: 'pointer'
								}}
								onClick={() => setPortal('admin')}
							>
								Trang Quản Trị (Admin)
							</button>
						</li>
					</ul>

					<div className="header-tools">
						<select
							aria-label="Chế độ kết nối API"
							className="input-inline mono"
							style={{
								background: 'var(--color-signal-dark)',
								color: '#fff',
								borderColor: 'var(--paper-25)'
							}}
							value={apiMode}
							onChange={(e) => setApiMode(e.target.value)}
						>
							<option value="auto">Mode: Auto (Live → Demo)</option>
							<option value="live">Mode: Live Java API</option>
							<option value="demo">Mode: Demo Local</option>
						</select>

						{portal === 'admin' ? (
							<button
								type="button"
								className="button button--outline-light button--sm"
								onClick={onCheckHealth}
							>
								Ping Services
							</button>
						) : (
							<button
								type="button"
								className="button button--accent button--sm"
								onClick={() => setPortal('admin')}
							>
								Mở Admin Console →
							</button>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
