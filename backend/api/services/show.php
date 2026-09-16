<?php
require_once __DIR__ . '/../config/database.php';

$slug = $_GET['slug'] ?? '';
$id = $_GET['id'] ?? '';

if (empty($slug) && empty($id)) {
    sendResponse(false, 'Service slug or ID is required.', 400);
}

$db = Database::getConnection();

if (!empty($slug)) {
    $stmt = $db->prepare('SELECT * FROM services WHERE slug = :slug LIMIT 1');
    $stmt->execute(['slug' => $slug]);
} else {
    $stmt = $db->prepare('SELECT * FROM services WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
}

$service = $stmt->fetch();

if (!$service) {
    sendResponse(false, 'Service not found.', 404);
}

sendResponse(true, $service);
