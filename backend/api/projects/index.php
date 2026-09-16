<?php
require_once __DIR__ . '/../config/database.php';

$db = Database::getConnection();

$category = $_GET['category'] ?? null;
$status = $_GET['status'] ?? null;

$sql = 'SELECT p.* FROM projects p WHERE 1=1';
$params = [];

if ($category) {
    $sql .= ' AND p.category = :category';
    $params['category'] = $category;
}

if ($status) {
    $sql .= ' AND p.status = :status';
    $params['status'] = $status;
}

$sql .= ' ORDER BY p.id DESC';
$stmt = $db->prepare($sql);
$stmt->execute($params);
$projects = $stmt->fetchAll();

// Attach images to each project
$imgStmt = $db->prepare('SELECT * FROM project_images WHERE project_id = :project_id ORDER BY id ASC');
foreach ($projects as &$project) {
    $imgStmt->execute(['project_id' => $project['id']]);
    $project['images'] = $imgStmt->fetchAll();
    $project['primary_image'] = !empty($project['images']) ? $project['images'][0]['image_path'] : '/uploads/proj1_1.jpg';
}

sendResponse(true, $projects);
