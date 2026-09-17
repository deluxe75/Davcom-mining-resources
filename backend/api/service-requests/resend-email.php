<?php
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../utils/mailer.php';

requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Method Not Allowed', 405);
}

$input = getJsonInput();
$id = (int)($input['id'] ?? 0);
$customEmail = trim($input['custom_email'] ?? '');

if ($id <= 0) {
    sendResponse(false, 'Valid service request ID is required.', 422);
}

$db = Database::getConnection();
$stmt = $db->prepare('SELECT * FROM service_requests WHERE id = :id');
$stmt->execute(['id' => $id]);
$req = $stmt->fetch();

if (!$req) {
    sendResponse(false, 'Service request not found.', 404);
}

// If custom email is specified, send to it; otherwise standard routing to company email
if (!empty($customEmail) && filter_var($customEmail, FILTER_VALIDATE_EMAIL)) {
    $settings = DavcomMailer::getSettings();
    $companyName = $settings['company_name'] ?? 'DAVCOM MINING RESOURCES NIG LTD';
    $subject = "[Forwarded Technical Quote] DMR-{$req['id']} - {$req['service']} ({$req['name']})";
    
    $htmlBody = "<div style='font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;'>
        <div style='max-width: 650px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 24px;'>
            <div style='background: #f59e0b; color: #0f172a; padding: 6px 12px; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; margin-bottom: 12px;'>
                FORWARDED SERVICE QUOTE SPECIFICATION
            </div>
            <h2 style='margin: 0 0 8px 0; color: #ffffff;'>{$companyName}</h2>
            <p style='color: #94a3b8; font-size: 13px; margin: 0 0 20px 0;'>Ref: DMR-{$req['id']} · Service: {$req['service']}</p>
            <table style='width: 100%; border-collapse: collapse; font-size: 13px;'>
                <tr><td style='padding: 6px 0; color: #94a3b8; width: 30%;'>Client Name:</td><td style='color: #ffffff; font-weight: bold;'>{$req['name']}</td></tr>
                <tr><td style='padding: 6px 0; color: #94a3b8;'>Company:</td><td style='color: #e2e8f0;'>{$req['company']}</td></tr>
                <tr><td style='padding: 6px 0; color: #94a3b8;'>Email:</td><td><a href='mailto:{$req['email']}' style='color: #38bdf8;'>{$req['email']}</a></td></tr>
                <tr><td style='padding: 6px 0; color: #94a3b8;'>Phone:</td><td style='color: #ffffff;'>{$req['phone']}</td></tr>
                <tr><td style='padding: 6px 0; color: #94a3b8;'>Location:</td><td style='color: #e2e8f0;'>{$req['location']}</td></tr>
                <tr><td style='padding: 6px 0; color: #94a3b8;'>Preferred Contact:</td><td style='color: #e2e8f0;'>{$req['preferred_contact_method']}</td></tr>
            </table>
            <div style='margin-top: 20px; background: #0f172a; padding: 14px; border-radius: 8px; border-left: 3px solid #f59e0b;'>
                <div style='font-size: 11px; text-transform: uppercase; color: #f59e0b; font-weight: bold;'>Scope / Description:</div>
                <p style='margin: 6px 0 0 0; color: #e2e8f0; font-size: 13px; line-height: 1.5; white-space: pre-wrap;'>{$req['description']}</p>
            </div>
        </div>
    </div>";

    $textBody = "DAVCOM FORWARDED QUOTE DMR-{$req['id']}\nService: {$req['service']}\nClient: {$req['name']} ({$req['company']})\nEmail: {$req['email']}\nPhone: {$req['phone']}\nLocation: {$req['location']}\n\nDescription:\n{$req['description']}";

    $res = DavcomMailer::dispatchMail($customEmail, $subject, $htmlBody, $textBody, [
        'request_id' => $id,
        'type' => 'forwarded_quote'
    ]);

    sendResponse(true, [
        'message' => "Quote DMR-{$id} forwarded successfully to {$customEmail}",
        'recipient' => $customEmail,
        'result' => $res
    ]);
} else {
    // Normal company email dispatch
    $result = DavcomMailer::sendQuoteNotification($req);
    sendResponse(true, [
        'message' => "Quote DMR-{$id} re-sent to company notification email (" . implode(', ', $result['recipients']) . ")",
        'recipients' => $result['recipients'],
        'result' => $result
    ]);
}
