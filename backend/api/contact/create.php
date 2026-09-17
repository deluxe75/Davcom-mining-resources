<?php
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

$input = getJsonInput();

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$company = trim($input['company'] ?? '');
$subject = trim($input['subject'] ?? '');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    sendResponse(false, 'Please fill in all required fields (Name, Email, Subject, and Message).', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Please provide a valid email address.', 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('INSERT INTO contact_messages (name, email, phone, company, subject, message, status) VALUES (:name, :email, :phone, :company, :subject, :message, "New")');
$stmt->execute([
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'email' => $email,
    'phone' => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
    'company' => htmlspecialchars($company, ENT_QUOTES, 'UTF-8'),
    'subject' => htmlspecialchars($subject, ENT_QUOTES, 'UTF-8'),
    'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8')
]);

// Dispatch email notification to company email
require_once __DIR__ . '/../utils/mailer.php';
DavcomMailer::sendContactNotification([
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'company' => $company,
    'subject' => $subject,
    'message' => $message
]);

sendResponse(true, [
    'message' => 'Your message has been sent successfully to DAVCOM executive desk. Our team will review your inquiry and respond promptly.'
], 201);
