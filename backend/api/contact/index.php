<?php
require_once __DIR__ . '/../middleware/auth.php';

requireAdminAuth();

$db = Database::getConnection();
$status = $_GET['status'] ?? null;

if ($status) {
    $stmt = $db->prepare('SELECT * FROM contact_messages WHERE status = :status ORDER BY id DESC');
    $stmt->execute(['status' => $status]);
} else {
    $stmt = $db->query('SELECT * FROM contact_messages ORDER BY id DESC');
}

$messages = $stmt->fetchAll();
sendResponse(true, $messages);
