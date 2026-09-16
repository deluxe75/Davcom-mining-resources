<?php
// Authentication Middleware for Protected Admin Endpoints
require_once __DIR__ . '/../config/database.php';

function requireAdminAuth(): array {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    $token = '';
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    } elseif (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Bearer\s(\S+)/', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            $token = $matches[1];
        }
    } elseif (!empty($_GET['token'])) {
        $token = $_GET['token'];
    }

    if (empty($token)) {
        sendResponse(false, 'Unauthorized. Authentication token is missing.', 401);
    }

    $db = Database::getConnection();
    $stmt = $db->prepare('SELECT id, name, email, created_at FROM admins WHERE token = :token LIMIT 1');
    $stmt->execute(['token' => $token]);
    $admin = $stmt->fetch();

    if (!$admin) {
        sendResponse(false, 'Unauthorized or session expired. Please log in again.', 401);
    }

    return $admin;
}
