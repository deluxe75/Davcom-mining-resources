<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

$input = getJsonInput();

$name = trim($input['name'] ?? '');
$company = trim($input['company'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$service = trim($input['service'] ?? '');
$location = trim($input['location'] ?? ($input['project_location'] ?? ''));
$description = trim($input['description'] ?? ($input['project_description'] ?? ''));
$preferred_contact_method = trim($input['preferred_contact_method'] ?? 'email');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($phone) || empty($service) || empty($description)) {
    sendResponse(false, 'Please fill in all required fields (Name, Email, Phone, Service, and Project Description).', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Please enter a valid email address.', 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('INSERT INTO service_requests (name, company, email, phone, service, location, description, preferred_contact_method, message, status) VALUES (:name, :company, :email, :phone, :service, :location, :description, :preferred_contact_method, :message, "Pending")');
$stmt->execute([
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'company' => htmlspecialchars($company, ENT_QUOTES, 'UTF-8'),
    'email' => $email,
    'phone' => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
    'service' => htmlspecialchars($service, ENT_QUOTES, 'UTF-8'),
    'location' => htmlspecialchars($location, ENT_QUOTES, 'UTF-8'),
    'description' => htmlspecialchars($description, ENT_QUOTES, 'UTF-8'),
    'preferred_contact_method' => htmlspecialchars($preferred_contact_method, ENT_QUOTES, 'UTF-8'),
    'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8')
]);

$requestId = $db->lastInsertId();

sendResponse(true, [
    'request_id' => (int)$requestId,
    'message' => 'Your service request has been logged successfully. A DAVCOM technical representative will contact you via your preferred method.'
], 201);
