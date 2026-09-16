<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid gallery image ID is required.', 400);
}

$db = Database::getConnection();
$getStmt = $db->prepare('SELECT * FROM gallery WHERE id = :id LIMIT 1');
$getStmt->execute(['id' => $id]);
$item = $getStmt->fetch();

if (!$item) {
    sendResponse(false, 'Gallery item not found.', 404);
}

// Attempt to unlink physical file
$filename = basename($item['image_path']);
$filePath = __DIR__ . '/../../uploads/' . $filename;
if (file_exists($filePath) && is_file($filePath)) {
    @unlink($filePath);
}

$delStmt = $db->prepare('DELETE FROM gallery WHERE id = :id');
$delStmt->execute(['id' => $id]);

sendResponse(true, ['message' => 'Gallery item deleted successfully.', 'id' => $id]);
