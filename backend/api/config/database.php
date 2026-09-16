<?php
// Database connection using PDO (MySQL / MariaDB with automatic failover)
require_once __DIR__ . '/cors.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $dbName = getenv('DB_NAME') ?: 'davcom_db';
        $username = getenv('DB_USER') ?: 'root';
        $password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';

        // Check if environment specifies SQLite or default MySQL
        $driver = getenv('DB_CONNECTION') ?: 'mysql';

        if ($driver === 'mysql') {
            try {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ];

                self::$instance = new PDO($dsn, $username, $password, $options);
                return self::$instance;
            } catch (PDOException $e) {
                // Fallback attempt: if socket connection on localhost
                try {
                    $dsn = "mysql:unix_socket=/run/mysqld/mysqld.sock;dbname={$dbName};charset=utf8mb4";
                    self::$instance = new PDO($dsn, $username, $password, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]);
                    return self::$instance;
                } catch (PDOException $e2) {
                    error_log("Database connection error: " . $e->getMessage());
                    sendResponse(false, "Database connection error. Please ensure MySQL service is running.", 500);
                }
            }
        } else {
            // SQLite connection
            $sqlitePath = __DIR__ . '/../../database/davcom.sqlite';
            self::$instance = new PDO("sqlite:" . $sqlitePath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            return self::$instance;
        }

        sendResponse(false, "Could not establish database connection.", 500);
        exit;
    }
}
