<?php
// CORS Header handling for DAVCOM REST API
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
header('Content-Type: application/json; charset=UTF-8');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Helper function to return standardized JSON responses
function sendResponse($success, $data_or_message, $statusCode = 200) {
    http_response_code($statusCode);
    if ($success) {
        echo json_encode([
            'success' => true,
            'data' => $data_or_message
        ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            'success' => false,
            'message' => $data_or_message
        ], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
    exit;
}

// Helper to get request body (JSON or Form-Data)
function getJsonInput() {
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);
    return is_array($decoded) ? $decoded : $_POST;
}
