import { SERVICES } from '../services/api';

export default function ServiceHealthBar({ health, onResetDemo }) {
	return (
		<div className="service-bar">
			<div className="shell service-bar__inner">
				<div className="service-pills">
					{Object.values(SERVICES).map((svc) => {
						const isUp = health[svc.key];
						const dotClass =
							isUp === true
								? 'status-dot status-dot--up'
								: isUp === false
									? 'status-dot status-dot--down'
									: 'status-dot';
						return (
							<span className="service-pill" key={svc.key}>
								<span className={dotClass} />
								{svc.label}
							</span>
						);
					})}
				</div>
				<button
					type="button"
					className="btn-micro"
					style={{ color: 'var(--paper-75)', borderColor: 'var(--paper-25)' }}
					onClick={onResetDemo}
				>
					Khôi phục dữ liệu mẫu
				</button>
			</div>
		</div>
	);
}
