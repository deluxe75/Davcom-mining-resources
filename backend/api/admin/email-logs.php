<?php
require_once __DIR__ . '/../middleware/auth.php';

requireAdminAuth();

$db = Database::getConnection();
$limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 50;

$stmt = $db->prepare('SELECT * FROM email_logs ORDER BY id DESC LIMIT :lim');
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->execute();
$logs = $stmt->fetchAll();

sendResponse(true, $logs);
