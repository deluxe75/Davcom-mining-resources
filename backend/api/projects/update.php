<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$id = (int)($input['id'] ?? ($_GET['id'] ?? 0));

if (!$id) {
    sendResponse(false, 'Valid project ID is required.', 400);
}

$db = Database::getConnection();

$checkStmt = $db->prepare('SELECT * FROM projects WHERE id = :id LIMIT 1');
$checkStmt->execute(['id' => $id]);
$project = $checkStmt->fetch();

if (!$project) {
    sendResponse(false, 'Project not found.', 404);
}

$title = trim($input['title'] ?? $project['title']);
$slug = trim($input['slug'] ?? $project['slug']);
$category = trim($input['category'] ?? $project['category']);
$location = trim($input['location'] ?? $project['location']);
$description = trim($input['description'] ?? $project['description']);
$status = trim($input['status'] ?? $project['status']);
$completion_date = !empty($input['completion_date']) ? $input['completion_date'] : $project['completion_date'];

$stmt = $db->prepare('UPDATE projects SET title = :title, slug = :slug, category = :category, location = :location, description = :description, status = :status, completion_date = :completion_date WHERE id = :id');
$stmt->execute([
    'title' => $title,
    'slug' => $slug,
    'category' => $category,
    'location' => $location,
    'description' => $description,
    'status' => $status,
    'completion_date' => $completion_date,
    'id' => $id
]);

// If new image is supplied
if (!empty($input['image_path'])) {
    $imgStmt = $db->prepare('INSERT INTO project_images (project_id, image_path, caption) VALUES (:project_id, :image_path, :caption)');
    $imgStmt->execute([
        'project_id' => $id,
        'image_path' => $input['image_path'],
        'caption' => $title
    ]);
}

$getStmt = $db->prepare('SELECT * FROM projects WHERE id = :id');
$getStmt->execute(['id' => $id]);
$updatedProject = $getStmt->fetch();

$allImagesStmt = $db->prepare('SELECT * FROM project_images WHERE project_id = :project_id');
$allImagesStmt->execute(['project_id' => $id]);
$updatedProject['images'] = $allImagesStmt->fetchAll();

sendResponse(true, $updatedProject);
