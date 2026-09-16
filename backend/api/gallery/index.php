<?php
require_once __DIR__ . '/../middleware/auth.php';

$db = Database::getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireAdminAuth();
    $data = getRequestBody();
    $title = trim($data['title'] ?? '');
    $category = trim($data['category'] ?? 'general');
    $caption = trim($data['caption'] ?? '');
    $imagePath = trim($data['image_path'] ?? '');

    if (empty($imagePath)) {
        sendResponse(false, 'Image path is required.', 422);
    }

    $stmt = $db->prepare('INSERT INTO gallery (title, category, caption, image_path) VALUES (?, ?, ?, ?)');
    $stmt->execute([$title, $category, $caption, $imagePath]);
    $newId = (int)$db->lastInsertId();

    $fetch = $db->prepare('SELECT * FROM gallery WHERE id = ?');
    $fetch->execute([$newId]);
    sendResponse(true, $fetch->fetch(), 201);
}

// GET list
$category = $_GET['category'] ?? null;
if ($category && $category !== 'all') {
    $stmt = $db->prepare('SELECT * FROM gallery WHERE category = :category ORDER BY id DESC');
    $stmt->execute(['category' => $category]);
} else {
    $stmt = $db->query('SELECT * FROM gallery ORDER BY id DESC');
}

$items = $stmt->fetchAll();
sendResponse(true, $items);
