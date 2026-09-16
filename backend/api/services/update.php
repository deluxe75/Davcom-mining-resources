<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid service ID is required.', 400);
}

$db = Database::getConnection();

$checkStmt = $db->prepare('SELECT * FROM services WHERE id = :id LIMIT 1');
$checkStmt->execute(['id' => $id]);
$service = $checkStmt->fetch();

if (!$service) {
    sendResponse(false, 'Service not found.', 404);
}

$name = trim($input['name'] ?? $service['name']);
$slug = trim($input['slug'] ?? $service['slug']);
$description = trim($input['description'] ?? $service['description']);
$icon = trim($input['icon'] ?? $service['icon']);
$image = trim($input['image'] ?? $service['image']);
$status = trim($input['status'] ?? $service['status']);

$stmt = $db->prepare('UPDATE services SET name = :name, slug = :slug, description = :description, icon = :icon, image = :image, status = :status WHERE id = :id');
$stmt->execute([
    'name' => $name,
    'slug' => $slug,
    'description' => $description,
    'icon' => $icon,
    'image' => $image,
    'status' => $status,
    'id' => $id
]);

$getStmt = $db->prepare('SELECT * FROM services WHERE id = :id');
$getStmt->execute(['id' => $id]);
$updatedService = $getStmt->fetch();

sendResponse(true, $updatedService);
