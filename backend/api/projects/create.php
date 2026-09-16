<?php
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

requireAdminAuth();

$input = getJsonInput();
$title = trim($input['title'] ?? '');
$category = trim($input['category'] ?? 'Mining');
$location = trim($input['location'] ?? 'Nigeria');
$description = trim($input['description'] ?? '');
$status = trim($input['status'] ?? 'completed');
$completion_date = !empty($input['completion_date']) ? $input['completion_date'] : null;

if (empty($title) || empty($description)) {
    sendResponse(false, 'Project title and description are required.', 422);
}

$slug = trim($input['slug'] ?? '');
if (empty($slug)) {
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
}

$db = Database::getConnection();

// Check unique slug
$checkStmt = $db->prepare('SELECT id FROM projects WHERE slug = :slug LIMIT 1');
$checkStmt->execute(['slug' => $slug]);
if ($checkStmt->fetch()) {
    $slug .= '-' . time();
}

$stmt = $db->prepare('INSERT INTO projects (title, slug, category, location, description, status, completion_date) VALUES (:title, :slug, :category, :location, :description, :status, :completion_date)');
$stmt->execute([
    'title' => $title,
    'slug' => $slug,
    'category' => $category,
    'location' => $location,
    'description' => $description,
    'status' => $status,
    'completion_date' => $completion_date
]);

$projectId = (int)$db->lastInsertId();

// Handle images if provided
$images = $input['images'] ?? [];
if (!empty($input['image_path'])) {
    $images[] = ['image_path' => $input['image_path'], 'caption' => $title];
}

if (is_array($images)) {
    $imgStmt = $db->prepare('INSERT INTO project_images (project_id, image_path, caption) VALUES (:project_id, :image_path, :caption)');
    foreach ($images as $img) {
        $path = is_array($img) ? ($img['image_path'] ?? '') : (string)$img;
        $caption = is_array($img) ? ($img['caption'] ?? $title) : $title;
        if (!empty($path)) {
            $imgStmt->execute([
                'project_id' => $projectId,
                'image_path' => $path,
                'caption' => $caption
            ]);
        }
    }
}

// Fetch complete record with images
$getStmt = $db->prepare('SELECT * FROM projects WHERE id = :id');
$getStmt->execute(['id' => $projectId]);
$project = $getStmt->fetch();

$allImagesStmt = $db->prepare('SELECT * FROM project_images WHERE project_id = :project_id');
$allImagesStmt->execute(['project_id' => $projectId]);
$project['images'] = $allImagesStmt->fetchAll();

sendResponse(true, $project, 201);
