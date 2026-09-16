<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

if (empty($_FILES['image'])) {
    sendResponse(false, 'No image file was provided in the upload request.', 422);
}

$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    sendResponse(false, 'File upload error code: ' . $file['error'], 400);
}

// Configurable max size: 10MB
$maxSize = 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    sendResponse(false, 'File size exceeds maximum allowed limit (10MB).', 422);
}

// Validate extension
$originalName = basename($file['name']);
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

if (!in_array($extension, $allowedExtensions, true)) {
    sendResponse(false, 'Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.', 422);
}

// Validate MIME type securely
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
if (!in_array($mimeType, $allowedMimes, true)) {
    sendResponse(false, 'Invalid image MIME type: ' . $mimeType, 422);
}

// Destination directory
$uploadDir = __DIR__ . '/../../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Safe unique filename
$uniqueName = 'davcom_' . bin2hex(random_bytes(10)) . '.' . $extension;
$targetPath = $uploadDir . $uniqueName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    sendResponse(false, 'Failed to save uploaded file to destination.', 500);
}

$imagePath = '/uploads/' . $uniqueName;
$title = trim($_POST['title'] ?? pathinfo($originalName, PATHINFO_FILENAME));
$caption = trim($_POST['caption'] ?? '');
$category = trim($_POST['category'] ?? 'general');

// Save to gallery database
$db = Database::getConnection();
$stmt = $db->prepare('INSERT INTO gallery (title, caption, category, image_path) VALUES (:title, :caption, :category, :image_path)');
$stmt->execute([
    'title' => $title,
    'caption' => $caption,
    'category' => $category,
    'image_path' => $imagePath
]);

$id = $db->lastInsertId();

$getStmt = $db->prepare('SELECT * FROM gallery WHERE id = :id');
$getStmt->execute(['id' => $id]);
$record = $getStmt->fetch();

sendResponse(true, [
    'gallery_item' => $record,
    'image_path' => $imagePath,
    'url' => $imagePath,
    'message' => 'Image uploaded and registered successfully.'
], 201);
