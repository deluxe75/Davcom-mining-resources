<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid service ID is required.', 400);
}

$db = Database::getConnection();
$stmt = $db->prepare('DELETE FROM services WHERE id = :id');
$stmt->execute(['id' => $id]);

if ($stmt->rowCount() === 0) {
    sendResponse(false, 'Service not found or already deleted.', 404);
}

sendResponse(true, ['message' => 'Service deleted successfully.', 'id' => $id]);
