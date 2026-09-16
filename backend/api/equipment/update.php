<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid equipment ID is required.', 400);
}

$db = Database::getConnection();

$checkStmt = $db->prepare('SELECT * FROM equipment WHERE id = :id LIMIT 1');
$checkStmt->execute(['id' => $id]);
$equipment = $checkStmt->fetch();

if (!$equipment) {
    sendResponse(false, 'Equipment not found.', 404);
}

$name = trim($input['name'] ?? $equipment['name']);
$description = trim($input['description'] ?? $equipment['description']);
$image = trim($input['image'] ?? $equipment['image']);
$status = trim($input['status'] ?? $equipment['status']);

$stmt = $db->prepare('UPDATE equipment SET name = :name, description = :description, image = :image, status = :status WHERE id = :id');
$stmt->execute([
    'name' => $name,
    'description' => $description,
    'image' => $image,
    'status' => $status,
    'id' => $id
]);

$getStmt = $db->prepare('SELECT * FROM equipment WHERE id = :id');
$getStmt->execute(['id' => $id]);

sendResponse(true, $getStmt->fetch());
