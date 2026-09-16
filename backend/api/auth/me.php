<?php
require_once __DIR__ . '/../middleware/auth.php';

$admin = requireAdminAuth();
sendResponse(true, ['admin' => $admin], 200);
