# Script nạp nhanh toàn bộ Database vào MySQL XAMPP (E:\xampp\mysql\bin\mysql.exe)
# Chạy sau khi bạn đã nhấn "Start" cho MySQL trong XAMPP Control Panel.

param(
    [string]$MysqlExe = "E:\xampp\mysql\bin\mysql.exe",
    [string]$User = "root",
    [string]$Password = ""
)

if (-not (Test-Path $MysqlExe)) {
    Write-Error "Không tìm thấy mysql.exe tại $MysqlExe. Hãy truyền đường dẫn bằng -MysqlExe."
    exit 1
}

$sqlDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = @("01_driver_db.sql", "02_delivery_db.sql", "03_other_services_db.sql")

foreach ($file in $files) {
    $fullPath = Join-Path $sqlDir $file
    Write-Host "Đang nạp $file vào MySQL XAMPP..." -ForegroundColor Cyan
    if ([string]::IsNullOrEmpty($Password)) {
        Get-Content -Raw -Encoding UTF8 $fullPath | & $MysqlExe -u $User --default-character-set=utf8mb4
    } else {
        Get-Content -Raw -Encoding UTF8 $fullPath | & $MysqlExe -u $User "-p$Password" --default-character-set=utf8mb4
    }
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Lỗi khi nạp $file. Kiểm tra xem MySQL trong XAMPP Control Panel đã được Start chưa!"
        exit 1
    }
}

Write-Host "Hoàn tất! Đã tạo 5 database (driver_db, delivery_db, assignment_db, customer_db, payment_db) và nạp dữ liệu mẫu." -ForegroundColor Green
