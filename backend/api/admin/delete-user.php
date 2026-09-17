<?php
require_once __DIR__ . '/../middleware/auth.php';

$currentAdmin = requireSuperAdminAuth();
$db = Database::getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

$data = getJsonInput();
$targetId = (int)($data['id'] ?? 0);

if ($targetId <= 0) {
    sendResponse(false, 'Valid user ID is required.', 422);
}

if ($targetId === (int)$currentAdmin['id']) {
    sendResponse(false, 'You cannot delete your own active administrator account.', 400);
}

// Ensure there is at least one super admin remaining
$stmtCheck = $db->query("SELECT COUNT(*) as count FROM admins WHERE role = 'super_admin'");
$resCheck = $stmtCheck->fetch();
$targetUserStmt = $db->prepare('SELECT role FROM admins WHERE id = ?');
$targetUserStmt->execute([$targetId]);
$targetUser = $targetUserStmt->fetch();

if ($targetUser && $targetUser['role'] === 'super_admin' && ((int)$resCheck['count'] <= 1)) {
    sendResponse(false, 'Cannot delete the only Super Administrator in the system.', 400);
}

$stmt = $db->prepare('DELETE FROM admins WHERE id = ?');
$stmt->execute([$targetId]);

sendResponse(true, ['message' => 'Administrator account removed successfully.']);
