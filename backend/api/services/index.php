<?php
require_once __DIR__ . '/../config/database.php';

$db = Database::getConnection();

$status = $_GET['status'] ?? null;
if ($status) {
    $stmt = $db->prepare('SELECT * FROM services WHERE status = :status ORDER BY id ASC');
    $stmt->execute(['status' => $status]);
} else {
    $stmt = $db->query('SELECT * FROM services ORDER BY id ASC');
}

$services = $stmt->fetchAll();
sendResponse(true, $services);
