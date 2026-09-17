<?php
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/mailer.php';

requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

$input = getJsonInput();
$settings = DavcomMailer::getSettings();
$targetEmail = trim($input['target_email'] ?? ($settings['quote_notification_email'] ?? ($settings['official_email'] ?? 'info@davcom.com.ng')));

if (empty($targetEmail) || !filter_var($targetEmail, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Please provide a valid destination email address.', 422);
}

$result = DavcomMailer::sendTestEmail($targetEmail);

sendResponse(true, [
    'message' => "Test quote notification email dispatched to {$targetEmail}.",
    'target_email' => $targetEmail,
    'result' => $result
]);
