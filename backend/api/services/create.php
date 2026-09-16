<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$name = trim($input['name'] ?? '');
$description = trim($input['description'] ?? '');
$icon = trim($input['icon'] ?? 'Wrench');
$image = trim($input['image'] ?? '/uploads/engineering.jpg');
$status = trim($input['status'] ?? 'active');

if (empty($name) || empty($description)) {
    sendResponse(false, 'Service name and description are required.', 422);
}

$slug = trim($input['slug'] ?? '');
if (empty($slug)) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
}

$db = Database::getConnection();

// Check unique slug
$checkStmt = $db->prepare('SELECT id FROM services WHERE slug = :slug LIMIT 1');
$checkStmt->execute(['slug' => $slug]);
if ($checkStmt->fetch()) {
    $slug .= '-' . time();
}

$stmt = $db->prepare('INSERT INTO services (name, slug, description, icon, image, status) VALUES (:name, :slug, :description, :icon, :image, :status)');
$stmt->execute([
    'name' => $name,
    'slug' => $slug,
    'description' => $description,
    'icon' => $icon,
    'image' => $image,
    'status' => $status
]);

$id = $db->lastInsertId();

$getStmt = $db->prepare('SELECT * FROM services WHERE id = :id');
$getStmt->execute(['id' => $id]);
$newService = $getStmt->fetch();

sendResponse(true, $newService, 201);
