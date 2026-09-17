<?php
// Manage Administrative Accounts (Super Admin only)
require_once __DIR__ . '/../middleware/auth.php';

$currentAdmin = requireAdminAuth();
$db = Database::getConnection();

// GET all admin users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->query('SELECT id, name, email, role, designation, created_at, updated_at FROM admins ORDER BY id ASC');
    $users = $stmt->fetchAll();
    sendResponse(true, $users);
}

// POST create new admin / manager
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $role = trim($data['role'] ?? 'admin');
    $designation = trim($data['designation'] ?? 'Operations Manager');

    if (empty($name) || empty($email) || empty($password)) {
        sendResponse(false, 'Full name, email address, and password are required.', 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(false, 'Please provide a valid corporate email address.', 422);
    }

    if (strlen($password) < 6) {
        sendResponse(false, 'Password must be at least 6 characters long.', 422);
    }

    // Check unique email
    $check = $db->prepare('SELECT id FROM admins WHERE email = :email LIMIT 1');
    $check->execute(['email' => $email]);
    if ($check->fetch()) {
        sendResponse(false, 'An administrative account with this email already exists.', 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO admins (name, email, password, role, designation) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$name, $email, $hash, $role, $designation]);
    $newId = (int)$db->lastInsertId();

    $fetch = $db->prepare('SELECT id, name, email, role, designation, created_at FROM admins WHERE id = ?');
    $fetch->execute([$newId]);
    $newUser = $fetch->fetch();

    sendResponse(true, [
        'user' => $newUser,
        'message' => 'New administrator account provisioned successfully.'
    ], 201);
}

sendResponse(false, 'Method Not Allowed', 405);
