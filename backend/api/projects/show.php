<?php
require_once __DIR__ . '/../config/database.php';

$slug = $_GET['slug'] ?? '';
$id = $_GET['id'] ?? '';

if (empty($slug) && empty($id)) {
    sendResponse(false, 'Project slug or ID is required.', 400);
}

$db = Database::getConnection();

if (!empty($slug)) {
    $stmt = $db->prepare('SELECT * FROM projects WHERE slug = :slug LIMIT 1');
    $stmt->execute(['slug' => $slug]);
} else {
    $stmt = $db->prepare('SELECT * FROM projects WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
}

$project = $stmt->fetch();

if (!$project) {
    sendResponse(false, 'Project not found.', 404);
}

$imgStmt = $db->prepare('SELECT * FROM project_images WHERE project_id = :project_id ORDER BY id ASC');
$imgStmt->execute(['project_id' => $project['id']]);
$project['images'] = $imgStmt->fetchAll();
$project['primary_image'] = !empty($project['images']) ? $project['images'][0]['image_path'] : '/uploads/proj1_1.jpg';

sendResponse(true, $project);
