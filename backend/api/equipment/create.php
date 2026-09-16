<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$name = trim($input['name'] ?? '');
$description = trim($input['description'] ?? '');
$image = trim($input['image'] ?? '/uploads/excavator.jpg');
$status = trim($input['status'] ?? 'available');

if (empty($name) || empty($description)) {
    sendResponse(false, 'Equipment name and description are required.', 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('INSERT INTO equipment (name, description, image, status) VALUES (:name, :description, :image, :status)');
$stmt->execute([
    'name' => $name,
    'description' => $description,
    'image' => $image,
    'status' => $status
]);

$id = $db->lastInsertId();
$getStmt = $db->prepare('SELECT * FROM equipment WHERE id = :id');
$getStmt->execute(['id' => $id]);

sendResponse(true, $getStmt->fetch(), 201);
