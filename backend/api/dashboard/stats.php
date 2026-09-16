<?php
require_once __DIR__ . '/../middleware/auth.php';

requireAdminAuth();

$db = Database::getConnection();

$stats = [];

// Real COUNT queries against MySQL
$stmt = $db->query('SELECT COUNT(*) as count FROM projects');
$stats['total_projects'] = (int)$stmt->fetch()['count'];

$stmt = $db->query('SELECT COUNT(*) as count FROM services');
$stats['total_services'] = (int)$stmt->fetch()['count'];

$stmt = $db->query('SELECT COUNT(*) as count FROM equipment');
$stats['total_equipment'] = (int)$stmt->fetch()['count'];

$stmt = $db->query('SELECT COUNT(*) as count FROM contact_messages');
$stats['total_enquiries'] = (int)$stmt->fetch()['count'];

$stmt = $db->query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'New'");
$stats['new_enquiries'] = (int)$stmt->fetch()['count'];

$stmt = $db->query('SELECT COUNT(*) as count FROM service_requests');
$stats['total_service_requests'] = (int)$stmt->fetch()['count'];

$stmt = $db->query("SELECT COUNT(*) as count FROM service_requests WHERE status = 'Pending'");
$stats['pending_service_requests'] = (int)$stmt->fetch()['count'];

$stmt = $db->query('SELECT COUNT(*) as count FROM gallery');
$stats['gallery_images'] = (int)$stmt->fetch()['count'];

// Recent activity for dashboard overview
$recentProjects = $db->query('SELECT id, title, category, status, created_at FROM projects ORDER BY id DESC LIMIT 5')->fetchAll();
$recentRequests = $db->query('SELECT id, name, company, service, status, created_at FROM service_requests ORDER BY id DESC LIMIT 5')->fetchAll();
$recentEnquiries = $db->query('SELECT id, name, subject, status, created_at FROM contact_messages ORDER BY id DESC LIMIT 5')->fetchAll();

sendResponse(true, [
    'counts' => $stats,
    'recent_projects' => $recentProjects,
    'recent_requests' => $recentRequests,
    'recent_enquiries' => $recentEnquiries,
    'server_time' => date('Y-m-d H:i:s'),
    'database_engine' => 'MySQL / InnoDB'
]);
