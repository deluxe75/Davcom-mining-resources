<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));
$status = trim($input['status'] ?? '');
$adminNotes = isset($input['admin_notes']) ? trim($input['admin_notes']) : null;

if (!$id) {
    sendResponse(false, 'Valid Service Request ID is required.', 422);
}

// Normalize status
$statusMap = [
    'pending' => 'Pending',
    'in_review' => 'In Review',
    'in review' => 'In Review',
    'approved' => 'Approved',
    'completed' => 'Completed',
    'rejected' => 'Rejected',
    'cancelled' => 'Cancelled'
];

$normalizedStatus = $statusMap[strtolower($status)] ?? $status;

$db = Database::getConnection();

if ($adminNotes !== null) {
    $stmt = $db->prepare('UPDATE service_requests SET status = :status, admin_notes = :admin_notes WHERE id = :id');
    $stmt->execute([
        'status' => $normalizedStatus,
        'admin_notes' => $adminNotes,
        'id' => $id
    ]);
} else {
    $stmt = $db->prepare('UPDATE service_requests SET status = :status WHERE id = :id');
    $stmt->execute([
        'status' => $normalizedStatus,
        'id' => $id
    ]);
}

$getStmt = $db->prepare('SELECT * FROM service_requests WHERE id = :id');
$getStmt->execute(['id' => $id]);

sendResponse(true, $getStmt->fetch());
