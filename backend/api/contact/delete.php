<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$data = getRequestBody();
$id = (int)($data['id'] ?? ($_GET['id'] ?? 0));

if ($id <= 0) {
    sendResponse(false, 'Valid contact message ID is required.', 422);
}

$db = Database::getConnection();

$stmt = $db->prepare('SELECT id FROM contact_messages WHERE id = ?');
$stmt->execute([$id]);
if (!$stmt->fetch()) {
    sendResponse(false, 'Contact message not found.', 404);
}

$del = $db->prepare('DELETE FROM contact_messages WHERE id = ?');
$del->execute([$id]);

sendResponse(true, ['message' => 'Contact message deleted successfully.']);
