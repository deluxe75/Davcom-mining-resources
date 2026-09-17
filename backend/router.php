<?php
// PHP Built-in Server Router for Development and Direct Execution
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static upload files directly
if (strpos($uri, '/uploads/') === 0 || strpos($uri, '/backend/uploads/') === 0) {
    $cleanUri = preg_replace('#^/backend#', '', $uri);
    $filePath = __DIR__ . $cleanUri;
    if (file_exists($filePath) && is_file($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'gif' => 'image/gif'
        ];
        if (isset($mimes[$ext])) {
            header('Content-Type: ' . $mimes[$ext]);
        }
        readfile($filePath);
        exit;
    }
}

// Normalize URI prefix
$cleanPath = preg_replace('#^/backend#', '', $uri);
$cleanPath = rtrim($cleanPath, '/');
if ($cleanPath !== '' && strpos($cleanPath, '/api') !== 0) {
    $cleanPath = '/api' . $cleanPath;
}

// Direct PHP file match
$directFile = __DIR__ . $cleanPath;
if (is_file($directFile) && pathinfo($directFile, PATHINFO_EXTENSION) === 'php') {
    require $directFile;
    exit;
}

// REST route mapping
$routes = [
    '#^/api/auth/login$#' => '/api/auth/login.php',
    '#^/api/auth/logout$#' => '/api/auth/logout.php',
    '#^/api/auth/me$#' => '/api/auth/me.php',

    '#^/api/services$#' => '/api/services/index.php',
    '#^/api/services/create$#' => '/api/services/create.php',
    '#^/api/services/update$#' => '/api/services/update.php',
    '#^/api/services/delete$#' => '/api/services/delete.php',
    '#^/api/services/([a-zA-Z0-9_-]+)$#' => function($matches) {
        $_GET['slug'] = $matches[1];
        return '/api/services/show.php';
    },

    '#^/api/projects$#' => '/api/projects/index.php',
    '#^/api/projects/create$#' => '/api/projects/create.php',
    '#^/api/projects/update$#' => '/api/projects/update.php',
    '#^/api/projects/delete$#' => '/api/projects/delete.php',
    '#^/api/projects/([a-zA-Z0-9_-]+)$#' => function($matches) {
        $_GET['slug'] = $matches[1];
        return '/api/projects/show.php';
    },

    '#^/api/equipment$#' => '/api/equipment/index.php',
    '#^/api/equipment/create$#' => '/api/equipment/create.php',
    '#^/api/equipment/update$#' => '/api/equipment/update.php',
    '#^/api/equipment/delete$#' => '/api/equipment/delete.php',

    '#^/api/gallery$#' => '/api/gallery/index.php',
    '#^/api/gallery/upload$#' => '/api/gallery/upload.php',
    '#^/api/gallery/delete$#' => '/api/gallery/delete.php',

    '#^/api/contact$#' => '/api/contact/create.php',
    '#^/api/contact/messages$#' => '/api/contact/index.php',
    '#^/api/contact/update-status$#' => '/api/contact/update-status.php',
    '#^/api/contact/delete$#' => '/api/contact/delete.php',

    '#^/api/upload$#' => '/api/upload.php',

    '#^/api/service-requests$#' => '/api/service-requests/create.php',
    '#^/api/service-requests/all$#' => '/api/service-requests/index.php',
    '#^/api/service-requests/update-status$#' => '/api/service-requests/update-status.php',
    '#^/api/service-requests/delete$#' => '/api/service-requests/delete.php',
    '#^/api/service-requests/resend-email$#' => '/api/service-requests/resend-email.php',

    '#^/api/dashboard/stats$#' => '/api/dashboard/stats.php',

    '#^/api/admin/users$#' => '/api/admin/users.php',
    '#^/api/admin/delete-user$#' => '/api/admin/delete-user.php',
    '#^/api/admin/settings$#' => '/api/admin/settings.php',
    '#^/api/admin/system$#' => '/api/admin/system.php',
    '#^/api/admin/test-email$#' => '/api/admin/test-email.php',
    '#^/api/admin/email-logs$#' => '/api/admin/email-logs.php',
];

foreach ($routes as $pattern => $target) {
    if (preg_match($pattern, $cleanPath, $matches)) {
        if (is_callable($target)) {
            $file = $target($matches);
        } else {
            $file = $target;
        }
        $fullPath = __DIR__ . $file;
        if (file_exists($fullPath)) {
            require $fullPath;
            exit;
        }
    }
}

// Default 404
header('Content-Type: application/json; charset=UTF-8');
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'API route not found: ' . $uri
]);
