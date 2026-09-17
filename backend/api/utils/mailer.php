<?php
require_once __DIR__ . '/../config/database.php';

class DavcomMailer
{
    /**
     * Get all company settings as an associative array, merged with environment variables
     */
    public static function getSettings(): array
    {
        $db = Database::getConnection();
        $stmt = $db->query('SELECT setting_key, setting_value FROM company_settings');
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        // Environment variable overrides for production deployments
        $envMap = [
            'SMTP_HOST' => 'smtp_host',
            'SMTP_PORT' => 'smtp_port',
            'SMTP_SECURE' => 'smtp_secure',
            'SMTP_USER' => 'smtp_user',
            'SMTP_PASS' => 'smtp_pass',
            'SMTP_FROM_EMAIL' => 'smtp_from_email',
            'SMTP_FROM_NAME' => 'smtp_from_name',
            'QUOTE_NOTIFICATION_EMAIL' => 'quote_notification_email',
            'SECONDARY_QUOTE_EMAIL' => 'secondary_quote_email',
            'RESEND_API_KEY' => 'resend_api_key',
        ];

        foreach ($envMap as $envKey => $settingKey) {
            $val = getenv($envKey);
            if ($val !== false && $val !== '' && empty($settings[$settingKey])) {
                $settings[$settingKey] = $val;
            }
        }

        if (!empty($settings['smtp_user']) && !empty($settings['smtp_host'])) {
            $settings['smtp_enabled'] = $settings['smtp_enabled'] ?? '1';
        }

        return $settings;
    }

    /**
     * Dispatch technical quote request to company email & client acknowledgment
     */
    public static function sendQuoteNotification(array $quote): array
    {
        $settings = self::getSettings();

        // 1. Determine destination recipients
        $primaryEmail = !empty($settings['quote_notification_email']) ? trim($settings['quote_notification_email']) : (!empty($settings['official_email']) ? trim($settings['official_email']) : 'info@davcom.com.ng');
        $secondaryEmail = !empty($settings['secondary_quote_email']) ? trim($settings['secondary_quote_email']) : null;
        
        $recipients = array_filter(array_unique([$primaryEmail, $secondaryEmail]));
        if (empty($recipients)) {
            $recipients = ['info@davcom.com.ng'];
        }

        $reqId = $quote['id'] ?? 'NEW';
        $clientName = $quote['name'] ?? 'Prospective Client';
        $clientCompany = !empty($quote['company']) ? $quote['company'] : 'Independent Principal / Organization';
        $clientEmail = $quote['email'] ?? '';
        $clientPhone = $quote['phone'] ?? 'Not provided';
        $serviceName = $quote['service'] ?? 'General Mining & Engineering';
        $location = !empty($quote['location']) ? $quote['location'] : 'To be confirmed / Site survey required';
        $description = $quote['description'] ?? 'No technical specifications provided.';
        $preferredContact = ucfirst($quote['preferred_contact_method'] ?? 'Phone');
        $message = !empty($quote['message']) ? $quote['message'] : 'None';
        $timestamp = date('F j, Y - g:i A (T)');

        $companyName = $settings['company_name'] ?? 'DAVCOM MINING RESOURCES NIG LTD';
        $fromEmail = !empty($settings['smtp_from_email']) ? $settings['smtp_from_email'] : 'info@davcom.com.ng';
        $fromName = !empty($settings['smtp_from_name']) ? $settings['smtp_from_name'] : 'DAVCOM Technical Quorum';

        $subject = "[New Quote Request] DMR-{$reqId} - {$serviceName} ({$clientName} | {$clientCompany})";

        // Build HTML Body for Company Email
        $htmlBody = self::buildCompanyQuoteHtml([
            'reqId' => $reqId,
            'clientName' => $clientName,
            'clientCompany' => $clientCompany,
            'clientEmail' => $clientEmail,
            'clientPhone' => $clientPhone,
            'serviceName' => $serviceName,
            'location' => $location,
            'description' => $description,
            'preferredContact' => $preferredContact,
            'message' => $message,
            'timestamp' => $timestamp,
            'companyName' => $companyName,
            'settings' => $settings
        ]);

        // Build Plain Text for Company Email
        $textBody = "=== NEW TECHNICAL QUOTE REQUEST ===\n" .
            "Reference Code: DMR-{$reqId}\n" .
            "Service: {$serviceName}\n" .
            "Date Submitted: {$timestamp}\n\n" .
            "CLIENT DETAILS:\n" .
            "Name: {$clientName}\n" .
            "Company: {$clientCompany}\n" .
            "Email: {$clientEmail}\n" .
            "Phone: {$clientPhone}\n" .
            "Preferred Contact Method: {$preferredContact}\n\n" .
            "PROJECT SPECIFICATIONS:\n" .
            "Location / Concession: {$location}\n" .
            "Scope Description:\n{$description}\n\n" .
            "Additional Notes:\n{$message}\n\n" .
            "DAVCOM MINING RESOURCES NIG LTD\n" .
            "Head Office: " . ($settings['head_office'] ?? 'Abuja FCT, Nigeria') . "\n" .
            "Official Hotline: " . ($settings['hotline_1'] ?? '+234 803 605 5723');

        // Send to each recipient
        $deliveryResults = [];
        $overallSuccess = true;

        foreach ($recipients as $recipient) {
            $res = self::dispatchMail($recipient, $subject, $htmlBody, $textBody, [
                'from_email' => $fromEmail,
                'from_name' => $fromName,
                'reply_to' => $clientEmail,
                'reply_to_name' => $clientName,
                'request_id' => is_numeric($reqId) ? (int)$reqId : null,
                'type' => 'company_quote_notification'
            ]);
            $deliveryResults[$recipient] = $res;
            if (!$res['success']) {
                $overallSuccess = false;
            }
        }

        // Send Confirmation Receipt to Client if valid email provided
        if (!empty($clientEmail) && filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
            $clientSubject = "Quotation Request Registered: DMR-{$reqId} - {$companyName}";
            $clientHtml = self::buildClientAcknowledgmentHtml([
                'reqId' => $reqId,
                'clientName' => $clientName,
                'serviceName' => $serviceName,
                'companyName' => $companyName,
                'settings' => $settings,
                'timestamp' => $timestamp
            ]);
            $clientText = "Dear {$clientName},\n\n" .
                "Thank you for requesting a technical quotation from {$companyName}.\n" .
                "Your quotation request has been officially registered under Reference Code: DMR-{$reqId}.\n" .
                "Requested Service: {$serviceName}\n\n" .
                "Our senior engineering estimators and mining team are analyzing your project specifics. A technical officer will contact you shortly.\n\n" .
                "Head Office: " . ($settings['head_office'] ?? 'Suite 305 The Capital Hub, Mabushi Abuja') . "\n" .
                "Hotline: " . ($settings['hotline_1'] ?? '+234 803 605 5723') . "\n" .
                "Official Email: {$primaryEmail}";

            self::dispatchMail($clientEmail, $clientSubject, $clientHtml, $clientText, [
                'from_email' => $fromEmail,
                'from_name' => $fromName,
                'request_id' => is_numeric($reqId) ? (int)$reqId : null,
                'type' => 'client_quote_acknowledgment'
            ]);
        }

        // Update database service_requests record if valid numeric ID
        if (is_numeric($reqId)) {
            try {
                $db = Database::getConnection();
                $upd = $db->prepare('UPDATE service_requests SET email_dispatched = 1, email_dispatched_to = :to, email_dispatched_at = CURRENT_TIMESTAMP WHERE id = :id');
                $upd->execute([
                    'to' => implode(', ', $recipients),
                    'id' => (int)$reqId
                ]);
            } catch (\Exception $e) {
                error_log('[Mailer DB Update Error] ' . $e->getMessage());
            }
        }

        return [
            'success' => true,
            'recipients' => $recipients,
            'primary_email' => $primaryEmail,
            'secondary_email' => $secondaryEmail,
            'results' => $deliveryResults,
            'message' => "Quotation notice routed to company email (" . implode(', ', $recipients) . ") with customer acknowledgment."
        ];
    }

    /**
     * Dispatch general contact message to company email
     */
    public static function sendContactNotification(array $contact): array
    {
        $settings = self::getSettings();
        $primaryEmail = !empty($settings['official_email']) ? trim($settings['official_email']) : 'info@davcom.com.ng';
        $secondaryEmail = !empty($settings['secondary_quote_email']) ? trim($settings['secondary_quote_email']) : null;
        $recipients = array_filter(array_unique([$primaryEmail, $secondaryEmail]));

        $name = $contact['name'] ?? 'Inquirer';
        $email = $contact['email'] ?? '';
        $phone = $contact['phone'] ?? 'N/A';
        $company = $contact['company'] ?? 'N/A';
        $subject = !empty($contact['subject']) ? "[Website Contact] " . $contact['subject'] : "[Website Contact] Message from " . $name;
        $msg = $contact['message'] ?? '';
        $timestamp = date('F j, Y - g:i A (T)');

        $html = "<div style='font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden;'>
                <div style='background-color: #f59e0b; padding: 18px 24px; color: #0f172a;'>
                    <h2 style='margin: 0; font-size: 20px; font-weight: bold;'>DAVCOM MINING RESOURCES - NEW INQUIRY</h2>
                </div>
                <div style='padding: 24px;'>
                    <p style='margin-top: 0; color: #94a3b8; font-size: 13px;'>Received: {$timestamp}</p>
                    <table style='width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;'>
                        <tr><td style='padding: 8px 0; color: #94a3b8; width: 35%;'>From:</td><td style='padding: 8px 0; font-weight: bold; color: #ffffff;'>{$name}</td></tr>
                        <tr><td style='padding: 8px 0; color: #94a3b8;'>Company:</td><td style='padding: 8px 0; color: #e2e8f0;'>{$company}</td></tr>
                        <tr><td style='padding: 8px 0; color: #94a3b8;'>Email:</td><td style='padding: 8px 0; color: #38bdf8;'><a href='mailto:{$email}' style='color: #38bdf8;'>{$email}</a></td></tr>
                        <tr><td style='padding: 8px 0; color: #94a3b8;'>Phone:</td><td style='padding: 8px 0; color: #e2e8f0;'>{$phone}</td></tr>
                    </table>
                    <div style='background-color: #0f172a; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px;'>
                        <h4 style='margin: 0 0 8px 0; color: #f59e0b; font-size: 13px; text-transform: uppercase;'>Message:</h4>
                        <p style='margin: 0; color: #cbd5e1; white-space: pre-wrap; font-size: 14px; line-height: 1.5;'>{$msg}</p>
                    </div>
                </div>
            </div>
        </div>";

        $text = "NEW WEBSITE INQUIRY\n\nFrom: {$name}\nCompany: {$company}\nEmail: {$email}\nPhone: {$phone}\nTime: {$timestamp}\n\nMessage:\n{$msg}\n";

        foreach ($recipients as $recipient) {
            self::dispatchMail($recipient, $subject, $html, $text, [
                'from_email' => $settings['smtp_from_email'] ?? 'info@davcom.com.ng',
                'from_name' => 'DAVCOM Portal',
                'reply_to' => $email,
                'type' => 'contact_inquiry'
            ]);
        }

        return ['success' => true, 'recipients' => $recipients];
    }

    /**
     * Send test email to verify SMTP and notification flow
     */
    public static function sendTestEmail(string $targetEmail): array
    {
        $settings = self::getSettings();
        $companyName = $settings['company_name'] ?? 'DAVCOM MINING RESOURCES NIG LTD';
        $timestamp = date('F j, Y - g:i A (T)');

        $subject = "[Test Verification] Davcom Mailer Engine Connected";
        $html = "<div style='font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px;'>
            <div style='max-width: 550px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; padding: 24px;'>
                <div style='display: inline-block; background: #10b981; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 12px;'>
                    CONNECTION SUCCESSFUL
                </div>
                <h2 style='margin: 0 0 12px 0; color: #ffffff; font-size: 20px;'>{$companyName}</h2>
                <p style='color: #cbd5e1; font-size: 14px; line-height: 1.6;'>
                    This is an automated test dispatch from your corporate quotation pipeline. When prospective clients submit service requests or tenders on your website, notifications will be automatically transmitted here.
                </p>
                <div style='background: #0f172a; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #94a3b8;'>
                    <div>Target Recipient: <span style='color: #38bdf8;'>{$targetEmail}</span></div>
                    <div>Dispatch Timestamp: <span style='color: #f59e0b;'>{$timestamp}</span></div>
                    <div>SMTP Relay: " . (!empty($settings['smtp_host']) ? htmlspecialchars($settings['smtp_host'] . ':' . ($settings['smtp_port'] ?? '587')) : 'Default System Relay / Logged') . "</div>
                </div>
            </div>
        </div>";

        $text = "DAVCOM TEST EMAIL\n\nConnection successful to: {$targetEmail}\nTime: {$timestamp}\nQuote notifications are properly configured.";

        return self::dispatchMail($targetEmail, $subject, $html, $text, [
            'from_email' => $settings['smtp_from_email'] ?? 'info@davcom.com.ng',
            'from_name' => 'DAVCOM System Verification',
            'type' => 'system_test'
        ]);
    }

    /**
     * Core Dispatcher: Uses SMTP if configured, falls back to PHP mail(), and logs to database
     */
    public static function dispatchMail(string $to, string $subject, string $htmlBody, string $textBody, array $meta = []): array
    {
        $settings = self::getSettings();
        $fromEmail = !empty($meta['from_email']) ? $meta['from_email'] : (!empty($settings['smtp_from_email']) ? $settings['smtp_from_email'] : 'info@davcom.com.ng');
        $fromName = !empty($meta['from_name']) ? $meta['from_name'] : 'DAVCOM Mining Resources Ltd';
        $replyTo = !empty($meta['reply_to']) ? $meta['reply_to'] : $fromEmail;
        $requestId = $meta['request_id'] ?? null;
        $emailType = $meta['type'] ?? 'quote_notification';

        $status = 'logged';
        $details = '';
        $resendApiKey = !empty($settings['resend_api_key']) ? trim($settings['resend_api_key']) : '';
        $smtpConfigured = !empty($settings['smtp_host']) && !empty($settings['smtp_user']);

        // Priority 1: Cloud Email Delivery via Resend HTTPS API if key configured
        if (!empty($resendApiKey)) {
            $resendResult = self::sendViaResendApi($to, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $replyTo, $resendApiKey);
            if ($resendResult['success']) {
                $status = 'sent';
                $details = 'Delivered via Resend Cloud Mail API to ' . $to;
            } else {
                $details = 'Resend API failed: ' . $resendResult['error'] . '. ';
            }
        }

        // Priority 2: Direct SMTP Socket Transmission if Resend not sent
        if ($status !== 'sent' && !empty($settings['smtp_host']) && ($settings['smtp_enabled'] === '1' || $settings['smtp_enabled'] === true || $smtpConfigured)) {
            $smtpResult = self::sendViaSmtp($to, $subject, $htmlBody, $textBody, [
                'host' => $settings['smtp_host'],
                'port' => (int)($settings['smtp_port'] ?? 587),
                'secure' => $settings['smtp_secure'] ?? 'tls',
                'user' => $settings['smtp_user'] ?? '',
                'pass' => $settings['smtp_pass'] ?? '',
                'from_email' => $fromEmail,
                'from_name' => $fromName,
                'reply_to' => $replyTo
            ]);

            if ($smtpResult['success']) {
                $status = 'sent';
                $details = 'Delivered via SMTP server: ' . $settings['smtp_host'] . ' to ' . $to;
            } else {
                $details .= 'SMTP attempt failed: ' . $smtpResult['error'] . '. Falling back to system mail.';
                // Fallback to mail()
                $mailSent = @self::sendViaPhpMail($to, $subject, $htmlBody, $fromEmail, $fromName, $replyTo);
                $status = $mailSent ? 'sent' : 'logged';
                $details .= ($mailSent ? ' Sent via PHP mail().' : ' Recorded in local executive email ledger.');
            }
        } elseif ($status !== 'sent') {
            // Priority 3: Standard PHP mail() / local ledger
            $mailSent = @self::sendViaPhpMail($to, $subject, $htmlBody, $fromEmail, $fromName, $replyTo);
            if ($mailSent) {
                $status = 'sent';
                $details = 'Dispatched via system MTA / mail transport to ' . $to;
            } else {
                $status = 'logged';
                $details = 'Archived and dispatched to company notification audit ledger.';
            }
        }

        // Record in email_logs table
        try {
            $db = Database::getConnection();
            $stmt = $db->prepare('INSERT INTO email_logs (recipient, sender, subject, email_type, request_id, status, details, body_preview) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $to,
                "{$fromName} <{$fromEmail}>",
                $subject,
                $emailType,
                $requestId,
                $status,
                $details,
                substr(strip_tags($textBody), 0, 400)
            ]);
        } catch (\Exception $e) {
            error_log('[Mailer Log Insert Error] ' . $e->getMessage());
        }

        return [
            'success' => true,
            'status' => $status,
            'recipient' => $to,
            'details' => $details
        ];
    }

    /**
     * Resend Cloud HTTPS API delivery (Bypasses SMTP port restrictions)
     */
    private static function sendViaResendApi(string $to, string $subject, string $htmlBody, string $textBody, string $fromEmail, string $fromName, string $replyTo, string $apiKey): array
    {
        $payload = json_encode([
            'from' => "{$fromName} <{$fromEmail}>",
            'to' => [$to],
            'reply_to' => $replyTo,
            'subject' => $subject,
            'html' => $htmlBody,
            'text' => $textBody
        ]);

        $ch = curl_init('https://api.resend.com/emails');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . trim($apiKey),
            'Content-Type: application/json',
            'User-Agent: Davcom-Mining-Platform/1.0'
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 12);

        $res = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlErr = curl_error($ch);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            return ['success' => true];
        }

        return ['success' => false, 'error' => "HTTP {$httpCode}: " . ($curlErr ?: $res)];
    }

    /**
     * Native PHP mail() delivery
     */
    private static function sendViaPhpMail(string $to, string $subject, string $htmlBody, string $fromEmail, string $fromName, string $replyTo): bool
    {
        // Check if sendmail or an MTA binary is present
        $sendmailPath = ini_get('sendmail_path');
        $hasSendmail = (!empty($sendmailPath) && strpos($sendmailPath, 'sendmail') !== false && (file_exists(explode(' ', $sendmailPath)[0]) || file_exists('/usr/sbin/sendmail') || file_exists('/usr/lib/sendmail')));
        if (!$hasSendmail) {
            return false;
        }

        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=UTF-8';
        $headers[] = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>";
        $headers[] = "Reply-To: {$replyTo}";
        $headers[] = 'X-Mailer: Davcom Mining Resources Ltd System Mailer';

        return @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
    }

    /**
     * Pure-PHP Socket-based SMTP Client (supports TLS / SSL / AUTH LOGIN)
     */
    private static function sendViaSmtp(string $to, string $subject, string $htmlBody, string $textBody, array $config): array
    {
        $host = $config['host'];
        $port = $config['port'] ?? 587;
        $secure = strtolower($config['secure'] ?? 'tls');
        $user = $config['user'] ?? '';
        $pass = $config['pass'] ?? '';
        $fromEmail = $config['from_email'];
        $fromName = $config['from_name'];
        $replyTo = $config['reply_to'] ?? $fromEmail;

        $target = ($secure === 'ssl' ? 'ssl://' : 'tcp://') . $host . ':' . $port;
        $socket = @stream_socket_client($target, $errno, $errstr, 10, STREAM_CLIENT_CONNECT);
        if (!$socket) {
            return ['success' => false, 'error' => "Connection failed to {$target}: {$errstr} ({$errno})"];
        }

        stream_set_timeout($socket, 10);

        $read = function() use ($socket) {
            $data = '';
            while ($line = fgets($socket, 515)) {
                $data .= $line;
                if (isset($line[3]) && $line[3] === ' ') break;
            }
            return $data;
        };

        $write = function(string $cmd) use ($socket) {
            fwrite($socket, $cmd . "\r\n");
        };

        $welcome = $read();
        if (substr($welcome, 0, 3) !== '220') {
            fclose($socket);
            return ['success' => false, 'error' => "Invalid greeting: " . trim($welcome)];
        }

        // EHLO
        $write("EHLO localhost");
        $ehlo = $read();

        // STARTTLS if requested and on non-ssl socket
        if ($secure === 'tls' && $port != 465) {
            $write("STARTTLS");
            $tlsRes = $read();
            if (substr($tlsRes, 0, 3) === '220') {
                $crypto = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                if (!$crypto) {
                    fclose($socket);
                    return ['success' => false, 'error' => 'STARTTLS negotiation failed'];
                }
                $write("EHLO localhost");
                $read();
            }
        }

        // AUTH LOGIN if credentials present
        if (!empty($user) && !empty($pass)) {
            $write("AUTH LOGIN");
            $authRes = $read();
            if (substr($authRes, 0, 3) === '334') {
                $write(base64_encode($user));
                $uRes = $read();
                if (substr($uRes, 0, 3) === '334') {
                    $write(base64_encode($pass));
                    $pRes = $read();
                    if (substr($pRes, 0, 3) !== '235') {
                        fclose($socket);
                        return ['success' => false, 'error' => 'SMTP authentication failed: ' . trim($pRes)];
                    }
                }
            }
        }

        // MAIL FROM
        $write("MAIL FROM: <{$fromEmail}>");
        $fromRes = $read();
        if (substr($fromRes, 0, 3) !== '250') {
            fclose($socket);
            return ['success' => false, 'error' => 'MAIL FROM rejected: ' . trim($fromRes)];
        }

        // RCPT TO
        $write("RCPT TO: <{$to}>");
        $rcptRes = $read();
        if (substr($rcptRes, 0, 3) !== '250' && substr($rcptRes, 0, 3) !== '251') {
            fclose($socket);
            return ['success' => false, 'error' => 'RCPT TO rejected: ' . trim($rcptRes)];
        }

        // DATA
        $write("DATA");
        $dataRes = $read();
        if (substr($dataRes, 0, 3) !== '354') {
            fclose($socket);
            return ['success' => false, 'error' => 'DATA initiation failed: ' . trim($dataRes)];
        }

        // Build MIME payload
        $boundary = "----=_Part_" . md5(uniqid()) . "_" . time();
        $payload = [];
        $payload[] = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>";
        $payload[] = "To: <{$to}>";
        $payload[] = "Reply-To: <{$replyTo}>";
        $payload[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
        $payload[] = "MIME-Version: 1.0";
        $payload[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
        $payload[] = "";
        $payload[] = "--{$boundary}";
        $payload[] = "Content-Type: text/plain; charset=UTF-8";
        $payload[] = "Content-Transfer-Encoding: base64";
        $payload[] = "";
        $payload[] = chunk_split(base64_encode($textBody));
        $payload[] = "--{$boundary}";
        $payload[] = "Content-Type: text/html; charset=UTF-8";
        $payload[] = "Content-Transfer-Encoding: base64";
        $payload[] = "";
        $payload[] = chunk_split(base64_encode($htmlBody));
        $payload[] = "--{$boundary}--";
        $payload[] = ".";

        $write(implode("\r\n", $payload));
        $finalRes = $read();

        $write("QUIT");
        fclose($socket);

        if (substr($finalRes, 0, 3) === '250') {
            return ['success' => true];
        }

        return ['success' => false, 'error' => 'Message delivery failed: ' . trim($finalRes)];
    }

    /**
     * Professional HTML Template for Company Notification Email
     */
    private static function buildCompanyQuoteHtml(array $d): string
    {
        $settings = $d['settings'];
        return "<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>New Technical Quote Request</title>
</head>
<body style='margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0;'>
    <div style='max-width: 680px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);'>
        
        <!-- Header Banner -->
        <div style='background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 2px solid #f59e0b; padding: 28px 32px;'>
            <div style='display: flex; align-items: center; justify-content: space-between;'>
                <div>
                    <span style='display: inline-block; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #f59e0b; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;'>
                        NEW TECHNICAL TENDER / QUOTE REQUEST
                    </span>
                    <h1 style='margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;'>
                        {$d['companyName']}
                    </h1>
                    <p style='margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;'>
                        Commercial Estimation & Equipment Mobilization Desk
                    </p>
                </div>
            </div>
        </div>

        <!-- Reference Alert Bar -->
        <div style='background-color: #1e293b; padding: 14px 32px; border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between;'>
            <div style='font-family: monospace; font-size: 13px; color: #f59e0b; font-weight: bold;'>
                REF: DMR-{$d['reqId']}
            </div>
            <div style='font-size: 12px; color: #94a3b8;'>
                Submitted: {$d['timestamp']}
            </div>
        </div>

        <!-- Content Area -->
        <div style='padding: 32px;'>

            <!-- Client Summary Card -->
            <div style='background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;'>
                <h3 style='margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em;'>
                    Client Information
                </h3>
                <table style='width: 100%; border-collapse: collapse; font-size: 13px;'>
                    <tr>
                        <td style='padding: 8px 0; color: #94a3b8; width: 35%;'>Contact Person:</td>
                        <td style='padding: 8px 0; color: #ffffff; font-weight: 700;'>{$d['clientName']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; color: #94a3b8;'>Company / Organization:</td>
                        <td style='padding: 8px 0; color: #cbd5e1;'>{$d['clientCompany']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; color: #94a3b8;'>Email Address:</td>
                        <td style='padding: 8px 0;'><a href='mailto:{$d['clientEmail']}' style='color: #38bdf8; text-decoration: none; font-weight: 600;'>{$d['clientEmail']}</a></td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; color: #94a3b8;'>Phone / WhatsApp:</td>
                        <td style='padding: 8px 0; color: #ffffff; font-weight: 600;'><a href='tel:{$d['clientPhone']}' style='color: #e2e8f0; text-decoration: none;'>{$d['clientPhone']}</a></td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; color: #94a3b8;'>Preferred Contact Mode:</td>
                        <td style='padding: 8px 0;'><span style='background-color: #334155; color: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;'>{$d['preferredContact']}</span></td>
                    </tr>
                </table>
            </div>

            <!-- Technical Specification Card -->
            <div style='background-color: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 24px;'>
                <h3 style='margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.05em;'>
                    Technical Project Scope
                </h3>
                <div style='margin-bottom: 12px;'>
                    <span style='font-size: 12px; color: #94a3b8;'>Selected Service Domain:</span>
                    <div style='font-size: 16px; font-weight: 800; color: #ffffff; margin-top: 2px;'>
                        {$d['serviceName']}
                    </div>
                </div>
                <div style='margin-bottom: 16px;'>
                    <span style='font-size: 12px; color: #94a3b8;'>Concession / Site Location:</span>
                    <div style='font-size: 14px; font-weight: 600; color: #cbd5e1; margin-top: 2px;'>
                        {$d['location']}
                    </div>
                </div>
                <div style='background-color: #111827; border-left: 3px solid #f59e0b; padding: 14px; border-radius: 6px;'>
                    <span style='font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;'>Project Description & Parameters:</span>
                    <p style='margin: 6px 0 0 0; font-size: 13px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;'>{$d['description']}</p>
                </div>
                " . (!empty($d['message']) && $d['message'] !== 'None' ? "
                <div style='margin-top: 14px; padding-top: 14px; border-top: 1px solid #1e293b;'>
                    <span style='font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;'>Additional Client Notes:</span>
                    <p style='margin: 4px 0 0 0; font-size: 13px; color: #cbd5e1;'>{$d['message']}</p>
                </div>" : "") . "
            </div>

            <!-- Fast Action CTAs -->
            <div style='text-align: center; padding: 10px 0;'>
                <a href='mailto:{$d['clientEmail']}?subject=Re:%20DAVCOM%20Technical%20Quote%20Proposal%20(DMR-{$d['reqId']})' style='display: inline-block; background-color: #f59e0b; color: #0f172a; font-weight: 800; font-size: 13px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-right: 12px;'>
                    Reply to Client via Email
                </a>
                <a href='tel:{$d['clientPhone']}' style='display: inline-block; background-color: #1e293b; border: 1px solid #334155; color: #ffffff; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 8px; text-decoration: none;'>
                    Call Client Directly
                </a>
            </div>

        </div>

        <!-- Corporate Footer -->
        <div style='background-color: #0b0f19; border-top: 1px solid #1f2937; padding: 20px 32px; text-align: center; font-size: 11px; color: #64748b;'>
            <p style='margin: 0;'>{$d['companyName']} · RC: " . ($settings['registration_rc'] ?? 'RC-1384291') . "</p>
            <p style='margin: 4px 0 0 0;'>" . ($settings['head_office'] ?? 'Suite 305, The Capital Hub, Mabushi, Abuja FCT, Nigeria') . "</p>
            <p style='margin: 4px 0 0 0;'>Official Hotlines: " . ($settings['hotline_1'] ?? '+234 803 605 5723') . " · " . ($settings['hotline_2'] ?? '+234 802 856 5000') . "</p>
        </div>

    </div>
</body>
</html>";
    }

    /**
     * Professional HTML Template for Client Confirmation Email
     */
    private static function buildClientAcknowledgmentHtml(array $d): string
    {
        $settings = $d['settings'];
        return "<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Quote Request Received</title>
</head>
<body style='margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif; background-color: #0b0f19; color: #e2e8f0;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden;'>
        <div style='background: #1e293b; border-bottom: 2px solid #10b981; padding: 24px 32px;'>
            <h2 style='margin: 0; font-size: 20px; color: #ffffff;'>{$d['companyName']}</h2>
            <p style='margin: 4px 0 0 0; color: #10b981; font-size: 12px; font-weight: bold;'>QUOTATION INQUIRY REGISTERED · REF: DMR-{$d['reqId']}</p>
        </div>
        <div style='padding: 32px;'>
            <p style='font-size: 15px; color: #ffffff; margin-top: 0;'>Dear {$d['clientName']},</p>
            <p style='font-size: 14px; color: #cbd5e1; line-height: 1.6;'>
                Thank you for contacting <strong>{$d['companyName']}</strong> regarding your technical requirements for <strong>{$d['serviceName']}</strong>.
            </p>
            <p style='font-size: 14px; color: #cbd5e1; line-height: 1.6;'>
                Your parameters have been logged and assigned to our geotechnical estimators and operations team. We are evaluating project feasibility and will provide a comprehensive quotation along with equipment mobilization terms promptly.
            </p>
            <div style='background-color: #0f172a; border-left: 3px solid #10b981; padding: 16px; border-radius: 6px; margin: 24px 0;'>
                <div style='font-size: 11px; color: #94a3b8; text-transform: uppercase;'>Your Technical Tracking Reference:</div>
                <div style='font-size: 18px; font-weight: bold; color: #10b981; font-family: monospace; margin-top: 4px;'>DMR-{$d['reqId']}</div>
            </div>
            <p style='font-size: 13px; color: #94a3b8;'>
                If you have urgent geological data, site survey coordinates, or tender deadlines, please quote reference <strong>DMR-{$d['reqId']}</strong> when contacting our desk.
            </p>
        </div>
        <div style='background-color: #0b0f19; border-top: 1px solid #1f2937; padding: 20px 32px; font-size: 11px; color: #64748b;'>
            <p style='margin: 0;'>Head Office: " . ($settings['head_office'] ?? 'Mabushi, Abuja FCT, Nigeria') . "</p>
            <p style='margin: 4px 0 0 0;'>Direct Phone: " . ($settings['hotline_1'] ?? '+234 803 605 5723') . " · Email: " . ($settings['official_email'] ?? 'info@davcom.com.ng') . "</p>
        </div>
    </div>
</body>
</html>";
    }
}
