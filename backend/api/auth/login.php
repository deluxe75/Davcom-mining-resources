<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

$input = getJsonInput();
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    sendResponse(false, 'Email and password are required.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Please provide a valid email address.', 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('SELECT id, name, email, password FROM admins WHERE email = :email LIMIT 1');
$stmt->execute(['email' => $email]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password'])) {
    sendResponse(false, 'Invalid email or password.', 401);
}

// Generate secure token
$token = bin2hex(random_bytes(32));

$updateStmt = $db->prepare('UPDATE admins SET token = :token WHERE id = :id');
$updateStmt->execute([
    'token' => $token,
    'id' => $admin['id']
]);

sendResponse(true, [
    'token' => $token,
    'admin' => [
        'id' => (int)$admin['id'],
        'name' => $admin['name'],
        'email' => $admin['email']
    ],
    'message' => 'Login successful'
], 200);
