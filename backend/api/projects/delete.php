<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid project ID is required.', 400);
}

$db = Database::getConnection();

// Delete associated images first (if foreign key cascade not enforced)
$delImg = $db->prepare('DELETE FROM project_images WHERE project_id = :project_id');
$delImg->execute(['project_id' => $id]);

$stmt = $db->prepare('DELETE FROM projects WHERE id = :id');
$stmt->execute(['id' => $id]);

if ($stmt->rowCount() === 0) {
    sendResponse(false, 'Project not found or already deleted.', 404);
}

sendResponse(true, ['message' => 'Project deleted successfully.', 'id' => $id]);
