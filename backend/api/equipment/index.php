<?php
require_once __DIR__ . '/../config/database.php';

$db = Database::getConnection();

$status = $_GET['status'] ?? null;
if ($status) {
    $stmt = $db->prepare('SELECT * FROM equipment WHERE status = :status ORDER BY id ASC');
    $stmt->execute(['status' => $status]);
} else {
    $stmt = $db->query('SELECT * FROM equipment ORDER BY id ASC');
}

$equipment = $stmt->fetchAll();
sendResponse(true, $equipment);
