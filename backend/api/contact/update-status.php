<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));
$status = trim($input['status'] ?? '');

$allowedStatuses = ['New', 'Contacted', 'Resolved', 'Closed'];
if (!$id || !in_array($status, $allowedStatuses, true)) {
    sendResponse(false, 'Valid ID and status (New, Contacted, Resolved, Closed) are required.', 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('UPDATE contact_messages SET status = :status WHERE id = :id');
$stmt->execute([
    'status' => $status,
    'id' => $id
]);

if ($stmt->rowCount() === 0) {
    // Verify existence
    $check = $db->prepare('SELECT id FROM contact_messages WHERE id = :id');
    $check->execute(['id' => $id]);
    if (!$check->fetch()) {
        sendResponse(false, 'Enquiry not found.', 404);
    }
}

$getStmt = $db->prepare('SELECT * FROM contact_messages WHERE id = :id');
$getStmt->execute(['id' => $id]);

sendResponse(true, $getStmt->fetch());
