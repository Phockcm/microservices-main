import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CANDIDATE_BINS = [
	process.env.MYSQL_BIN,
	'E:\\xampp\\mysql\\bin\\mysql.exe',
	'C:\\xampp\\mysql\\bin\\mysql.exe',
	'D:\\xampp\\mysql\\bin\\mysql.exe',
	'mysql'
].filter(Boolean);

function findMysqlBin() {
	for (const bin of CANDIDATE_BINS) {
		if (bin === 'mysql' || existsSync(bin)) return bin;
	}
	return null;
}

const mysqlBin = findMysqlBin();
if (!mysqlBin) {
	console.error('❌ Không tìm thấy mysql.exe của XAMPP. Hãy đặt biến môi trường MYSQL_BIN.');
	process.exit(1);
}

const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const host = process.env.MYSQL_HOST || '127.0.0.1';
const port = process.env.MYSQL_PORT || '3306';

const sqlFiles = ['01_driver_db.sql', '02_delivery_db.sql', '03_other_services_db.sql'];

console.log(`→ Đang chạy migrate với MySQL XAMPP (${mysqlBin})...`);

for (const file of sqlFiles) {
	const fullPath = join(__dirname, file);
	const sql = readFileSync(fullPath, 'utf8');
	const args = ['-h', host, '-P', port, '-u', user, '--default-character-set=utf8mb4'];
	if (password) args.push(`-p${password}`);

	process.stdout.write(`  • Nạp ${file}... `);
	const res = spawnSync(mysqlBin, args, {
		input: sql,
		encoding: 'utf8'
	});

	if (res.status !== 0) {
		console.log('THẤT BẠI');
		console.error(res.stderr || res.error?.message || 'Không kết nối được MySQL.');
		console.error('💡 Gợi ý: Mở XAMPP Control Panel và nhấn "Start" cho MySQL rồi chạy lại `npm run migrate`.');
		process.exit(1);
	}
	console.log('OK');
}

console.log('✅ Migrate hoàn tất! Đã cập nhật 5 database (driver_db, delivery_db, assignment_db, customer_db, payment_db) lên MySQL XAMPP.');
