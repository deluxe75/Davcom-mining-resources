<?php
require_once __DIR__ . '/../middleware/auth.php';

$admin = requireAdminAuth();
$db = Database::getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Method Not Allowed', 405);
}

// Collect real counts
$tables = ['services', 'projects', 'equipment', 'gallery', 'contact_messages', 'service_requests', 'admins'];
$counts = [];

foreach ($tables as $tbl) {
    try {
        $stmt = $db->query("SELECT COUNT(*) as count FROM {$tbl}");
        $row = $stmt->fetch();
        $counts[$tbl] = (int)($row['count'] ?? 0);
    } catch (Throwable $e) {
        $counts[$tbl] = 0;
    }
}

$driver = Database::getDriverType();

$diagnostics = [
    'driver' => strtoupper($driver),
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'PHP CLI Server',
    'database_name' => $driver === 'sqlite' ? 'davcom.sqlite (Self-Contained Persistent Store)' : 'davcom_db (MariaDB/MySQL)',
    'table_counts' => $counts,
    'total_database_records' => array_sum($counts),
    'memory_usage_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
    'server_time' => date('Y-m-d H:i:s T'),
    'uptime_status' => 'Operational & Stable'
];

sendResponse(true, $diagnostics);
