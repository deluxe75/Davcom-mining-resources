<?php
require_once __DIR__ . '/../middleware/auth.php';

requireAdminAuth();

$db = Database::getConnection();
$status = $_GET['status'] ?? null;

if ($status) {
    $stmt = $db->prepare('SELECT * FROM service_requests WHERE status = :status ORDER BY id DESC');
    $stmt->execute(['status' => $status]);
} else {
    $stmt = $db->query('SELECT * FROM service_requests ORDER BY id DESC');
}

$requests = $stmt->fetchAll();
sendResponse(true, $requests);
