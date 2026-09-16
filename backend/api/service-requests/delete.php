<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid ID is required.', 400);
}

$db = Database::getConnection();
$stmt = $db->prepare('DELETE FROM service_requests WHERE id = :id');
$stmt->execute(['id' => $id]);

sendResponse(true, ['message' => 'Service request deleted successfully.', 'id' => $id]);
