<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid equipment ID is required.', 400);
}

$db = Database::getConnection();
$stmt = $db->prepare('DELETE FROM equipment WHERE id = :id');
$stmt->execute(['id' => $id]);

if ($stmt->rowCount() === 0) {
    sendResponse(false, 'Equipment not found or already deleted.', 404);
}

sendResponse(true, ['message' => 'Equipment deleted successfully.', 'id' => $id]);
