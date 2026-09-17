<?php
require_once __DIR__ . '/../middleware/auth.php';

$db = Database::getConnection();

// GET settings (can be read by admin or public if needed, but let's allow read)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->query('SELECT setting_key, setting_value, updated_at FROM company_settings');
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    sendResponse(true, $settings);
}

// POST update settings (admin/super admin only)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $admin = requireAdminAuth();
    $data = getJsonInput();

    if (empty($data) || !is_array($data)) {
        sendResponse(false, 'Invalid payload: settings dictionary expected.', 422);
    }

    $stmt = $db->prepare('INSERT INTO company_settings (setting_key, setting_value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = CURRENT_TIMESTAMP');

    // MySQL fallback compatibility if running on MySQL
    if (Database::getDriverType() === 'mysql') {
        $stmt = $db->prepare('INSERT INTO company_settings (setting_key, setting_value) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = CURRENT_TIMESTAMP');
    }

    foreach ($data as $key => $val) {
        if (is_string($key) && $val !== null) {
            $stmt->execute([$key, (string)$val]);
        }
    }

    // Return updated
    $fetchStmt = $db->query('SELECT setting_key, setting_value FROM company_settings');
    $updated = [];
    foreach ($fetchStmt->fetchAll() as $r) {
        $updated[$r['setting_key']] = $r['setting_value'];
    }

    sendResponse(true, [
        'settings' => $updated,
        'message' => 'Corporate settings updated successfully.'
    ]);
}

sendResponse(false, 'Method Not Allowed', 405);
