<?php
require_once __DIR__ . '/middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

if (empty($_FILES['image'])) {
    sendResponse(false, 'No image file was uploaded.', 422);
}

$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    sendResponse(false, 'Upload error code: ' . $file['error'], 400);
}

// 10MB limit
if ($file['size'] > 10 * 1024 * 1024) {
    sendResponse(false, 'File exceeds 10MB limit.', 422);
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
    sendResponse(false, 'Allowed formats: JPG, PNG, WEBP, GIF', 422);
}

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$uniqueName = 'davcom_' . bin2hex(random_bytes(8)) . '.' . $ext;
$target = $uploadDir . $uniqueName;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    sendResponse(false, 'Failed to save file to server.', 500);
}

sendResponse(true, [
    'file_path' => '/uploads/' . $uniqueName,
    'filename' => $uniqueName,
    'message' => 'Image uploaded successfully'
]);
