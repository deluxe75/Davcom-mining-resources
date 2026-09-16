<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendResponse(false, 'Method Not Allowed', 405);
}

$admin = requireAdminAuth();
$db = Database::getConnection();

$stmt = $db->prepare('UPDATE admins SET token = NULL WHERE id = :id');
$stmt->execute(['id' => $admin['id']]);

sendResponse(true, ['message' => 'Logged out successfully.'], 200);
