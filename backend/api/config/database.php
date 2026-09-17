<?php
// Database connection using PDO with automatic MySQL-to-SQLite failover and auto-initialization
require_once __DIR__ . '/cors.php';

class Database {
    private static ?PDO $instance = null;
    private static string $driverType = 'mysql';

    public static function getDriverType(): string {
        return self::$driverType;
    }

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $host = getenv('DB_HOST') ?: '127.0.0.1';
        $port = getenv('DB_PORT') ?: '3306';
        $dbName = getenv('DB_NAME') ?: 'davcom_db';
        $username = getenv('DB_USER') ?: 'root';
        $password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : '';
        $driver = getenv('DB_CONNECTION') ?: (getenv('DB_HOST') ? 'mysql' : 'sqlite');

        // Try MySQL only if configured and extension is loaded
        if ($driver === 'mysql' && extension_loaded('pdo_mysql')) {
            try {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                if (defined('PDO::MYSQL_ATTR_INIT_COMMAND')) {
                    $options[PDO::MYSQL_ATTR_INIT_COMMAND] = "SET NAMES utf8mb4";
                }

                self::$instance = new PDO($dsn, $username, $password, $options);
                self::$driverType = 'mysql';
                self::ensureTablesExist(self::$instance, 'mysql');
                return self::$instance;
            } catch (Throwable $e) {
                // Try Unix socket
                try {
                    $dsn = "mysql:unix_socket=/run/mysqld/mysqld.sock;dbname={$dbName};charset=utf8mb4";
                    self::$instance = new PDO($dsn, $username, $password, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]);
                    self::$driverType = 'mysql';
                    self::ensureTablesExist(self::$instance, 'mysql');
                    return self::$instance;
                } catch (Throwable $e2) {
                    // Fall back quietly to SQLite
                }
            }
        }

        // SQLite Failover / Native mode
        try {
            $sqliteDir = __DIR__ . '/../../database';
            if (!is_dir($sqliteDir)) {
                @mkdir($sqliteDir, 0777, true);
            }
            $sqlitePath = $sqliteDir . '/davcom.sqlite';
            self::$instance = new PDO("sqlite:" . $sqlitePath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            self::$driverType = 'sqlite';
            self::ensureTablesExist(self::$instance, 'sqlite');
            return self::$instance;
        } catch (Throwable $sqliteErr) {
            error_log("SQLite database error: " . $sqliteErr->getMessage());
            sendResponse(false, "Could not establish database connection: " . $sqliteErr->getMessage(), 500);
            exit;
        }
    }

    private static function ensureTablesExist(PDO $db, string $driver): void {
        try {
            if ($driver === 'sqlite') {
                $db->exec("
                    CREATE TABLE IF NOT EXISTS admins (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        token TEXT NULL,
                        role TEXT NOT NULL DEFAULT 'super_admin',
                        designation TEXT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS services (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        slug TEXT NOT NULL UNIQUE,
                        description TEXT NOT NULL,
                        icon TEXT NULL,
                        image TEXT NULL,
                        status TEXT NOT NULL DEFAULT 'active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS projects (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        slug TEXT NOT NULL UNIQUE,
                        category TEXT NOT NULL,
                        location TEXT NOT NULL,
                        description TEXT NOT NULL,
                        status TEXT NOT NULL DEFAULT 'completed',
                        completion_date DATE NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS project_images (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        project_id INTEGER NOT NULL,
                        image_path TEXT NOT NULL,
                        caption TEXT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS equipment (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        type TEXT NOT NULL DEFAULT 'Heavy Machinery',
                        description TEXT NOT NULL,
                        image TEXT NULL,
                        status TEXT NOT NULL DEFAULT 'available',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS gallery (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NULL,
                        caption TEXT NULL,
                        category TEXT NOT NULL DEFAULT 'general',
                        image_path TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS contact_messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL,
                        phone TEXT NULL,
                        company TEXT NULL,
                        subject TEXT NOT NULL,
                        message TEXT NOT NULL,
                        status TEXT NOT NULL DEFAULT 'New',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS service_requests (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        company TEXT NULL,
                        email TEXT NOT NULL,
                        phone TEXT NOT NULL,
                        service TEXT NOT NULL,
                        location TEXT NULL,
                        description TEXT NOT NULL,
                        preferred_contact_method TEXT DEFAULT 'email',
                        message TEXT NULL,
                        admin_notes TEXT NULL,
                        status TEXT NOT NULL DEFAULT 'Pending',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS company_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        setting_key TEXT NOT NULL UNIQUE,
                        setting_value TEXT NOT NULL,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS email_logs (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        recipient TEXT NOT NULL,
                        sender TEXT NOT NULL,
                        subject TEXT NOT NULL,
                        email_type TEXT NOT NULL DEFAULT 'quote_notification',
                        request_id INTEGER NULL,
                        status TEXT NOT NULL DEFAULT 'sent',
                        details TEXT NULL,
                        body_preview TEXT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                ");

                // Ensure new columns exist on service_requests
                try { $db->exec("ALTER TABLE service_requests ADD COLUMN email_dispatched INTEGER DEFAULT 0"); } catch (\Exception $e) {}
                try { $db->exec("ALTER TABLE service_requests ADD COLUMN email_dispatched_to TEXT NULL"); } catch (\Exception $e) {}
                try { $db->exec("ALTER TABLE service_requests ADD COLUMN email_dispatched_at DATETIME NULL"); } catch (\Exception $e) {}

                // Seed super admin if none exists
                $checkAdmin = $db->query("SELECT COUNT(*) as cnt FROM admins")->fetch();
                if ((int)($checkAdmin['cnt'] ?? 0) === 0) {
                    $passwordHash = password_hash('admin123456', PASSWORD_DEFAULT);
                    $stmt = $db->prepare("INSERT INTO admins (name, email, password, role, designation) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([
                        'Engr. David K. (Super Admin)',
                        'admin@davcom.com',
                        $passwordHash,
                        'super_admin',
                        'Chief Technical Officer & Managing Director'
                    ]);
                }

                // Seed company settings if empty
                $checkSettings = $db->query("SELECT COUNT(*) as cnt FROM company_settings")->fetch();
                if ((int)($checkSettings['cnt'] ?? 0) === 0) {
                    $settings = [
                        'company_name' => 'DAVCOM MINING RESOURCES NIG LTD',
                        'registration_rc' => 'RC-1384291',
                        'hotline_1' => '+234 803 605 5723',
                        'hotline_2' => '+234 802 856 5000',
                        'hotline_3' => '+234 809 950 0999',
                        'official_email' => 'info@davcom.com.ng',
                        'head_office' => 'Suite 305, The Capital Hub, Plot 272, Mabushi, Abuja FCT, Nigeria',
                        'operating_hours' => 'Mon - Sat: 7:00 AM - 6:00 PM (Emergency Quorum: 24/7)',
                        'mining_license_status' => 'Active & Fully Certified (Federal Ministry of Mines & Steel)',
                        'quarry_location' => 'Mabushi & Keffi Road Haul Axis, Abuja & Nasarawa Operations'
                    ];
                    $stmt = $db->prepare("INSERT INTO company_settings (setting_key, setting_value) VALUES (?, ?)");
                    foreach ($settings as $k => $v) {
                        $stmt->execute([$k, $v]);
                    }
                }

                // Ensure email settings keys exist in company_settings
                $defaultEmailSettings = [
                    'quote_notification_email' => 'info@davcom.com.ng',
                    'secondary_quote_email' => 'destinykalu45@gmail.com',
                    'smtp_enabled' => '0',
                    'smtp_host' => 'smtp.gmail.com',
                    'smtp_port' => '587',
                    'smtp_secure' => 'tls',
                    'smtp_user' => '',
                    'smtp_pass' => '',
                    'smtp_from_name' => 'DAVCOM Technical Quorum',
                    'smtp_from_email' => 'info@davcom.com.ng'
                ];
                $chkKey = $db->prepare("SELECT COUNT(*) as cnt FROM company_settings WHERE setting_key = ?");
                $insKey = $db->prepare("INSERT INTO company_settings (setting_key, setting_value) VALUES (?, ?)");
                foreach ($defaultEmailSettings as $ek => $ev) {
                    $chkKey->execute([$ek]);
                    if ((int)($chkKey->fetch()['cnt'] ?? 0) === 0) {
                        $insKey->execute([$ek, $ev]);
                    }
                }

                // Seed services if empty
                $checkServices = $db->query("SELECT COUNT(*) as cnt FROM services")->fetch();
                if ((int)($checkServices['cnt'] ?? 0) === 0) {
                    $services = [
                        ['Mining', 'mining', 'Comprehensive mineral exploration, site survey evaluation, extraction, and environmentally compliant quarrying services adhering strictly to Nigerian mining regulations and international standards.', 'Pickaxe', '/uploads/mining.jpg', 'active'],
                        ['Rock Drilling & Blasting', 'rock-drilling-blasting', 'Specialized precision bench drilling, controlled rock blasting, vibration monitoring, explosive logistics, and safety management for quarry pits and infrastructure excavations.', 'Hammer', '/uploads/drilling.jpg', 'active'],
                        ['Quarry Management and Installation', 'quarry-management-installation', 'Turnkey quarry setup, aggregate plant installation, primary/secondary crushing circuit commissioning, yield optimization, and continuous pit operation oversight.', 'Cog', '/uploads/quarry.jpg', 'active'],
                        ['Borehole Drilling', 'borehole-drilling', 'Industrial, commercial, and community rotary borehole drilling, hydrogeological geophysical survey, deep aquifer development, submersible pump installations, and water reticulation.', 'Droplets', '/uploads/borehole.jpg', 'active'],
                        ['Soil Testing', 'soil-testing', 'Advanced geotechnical engineering investigations, Standard Penetration Tests (SPT), undisturbed core sampling, laboratory soil classification, and foundation bearing capacity analysis.', 'FileSpreadsheet', '/uploads/soil_testing.jpg', 'active'],
                        ['Building Construction', 'building-construction', 'Full-cycle architectural execution, structural reinforced concrete construction, commercial complexes, and industrial warehousing built to rigorous engineering standards.', 'Building2', '/uploads/building.jpg', 'active'],
                        ['Road Construction', 'road-construction', 'Highway engineering, heavy earthworks, stone base stabilization, asphalt paving, drainage culverts, and high-load haul roads for mining and civil transit.', 'Truck', '/uploads/road.jpg', 'active'],
                        ['Civil Works', 'civil-works', 'Heavy reinforced foundation engineering, retaining structures, bridge piers, culvert drainage networks, and industrial site infrastructure development.', 'HardHat', '/uploads/civil.jpg', 'active'],
                        ['General Engineering and Supplies', 'general-engineering-supplies', 'Procurement and delivery of certified mining wear parts, drill rods, blast accessories, hydraulic systems, plant spare parts, and mechanical maintenance consulting.', 'Wrench', '/uploads/engineering.jpg', 'active']
                    ];
                    $stmt = $db->prepare("INSERT INTO services (name, slug, description, icon, image, status) VALUES (?, ?, ?, ?, ?, ?)");
                    foreach ($services as $s) {
                        $stmt->execute($s);
                    }
                }

                // Seed equipment if empty
                $checkEquipment = $db->query("SELECT COUNT(*) as cnt FROM equipment")->fetch();
                if ((int)($checkEquipment['cnt'] ?? 0) === 0) {
                    $equipment = [
                        ['Excavator', 'Heavy Earthmoving', 'Heavy-duty hydraulic crawler excavators engineered for quarry face clearing, mass earthmoving, trenching, and bulk truck loading.', '/uploads/excavator.jpg', 'available'],
                        ['Air Compressors', 'Pneumatic Power', 'High-capacity diesel portable air compressors delivering consistent pneumatic volume for blast hole drilling rigs and quarry pneumatic tools.', '/uploads/air_compressor.jpg', 'available'],
                        ['Jack Hammer', 'Rock Fragmentation', 'Heavy-duty pneumatic rock-drilling and breaking jackhammers for secondary rock fragmenting and trenching.', '/uploads/jack_hammer.jpg', 'available'],
                        ['Wagon Drilling Machine', 'Deep Blast Drilling', 'High-efficiency pneumatic wagon drill rigs equipped for precision vertical and angled blast hole drilling across hard rock formations.', '/uploads/wagon_drill.jpg', 'available'],
                        ['Rock Diamond Cutting Machine', 'Precision Quarry Cutting', 'Precision diamond wire and blade stone cutters engineered for clean granite dimension block quarrying and monument cutting.', '/uploads/diamond_cutter.jpg', 'available'],
                        ['Rock Hydraulic Breaker', 'Secondary Breaker', 'High-impact boom-mounted hydraulic breakers for rapid secondary oversize reduction in mining pits and quarries.', '/uploads/hydraulic_breaker.jpg', 'available'],
                        ['Grader', 'Haul Road Maintenance', 'Heavy motor graders for precision haul road grading, site levelling, and drainage contour preparation.', '/uploads/grader.jpg', 'available'],
                        ['Pale Loader', 'Loading & Stockpile', 'High-capacity articulated wheel loaders designed for aggregate stockpile handling, rapid hopper feeding, and bulk loading.', '/uploads/loader.jpg', 'available'],
                        ['Borehole Drilling Machine', 'Rotary / DTH Rig', 'Heavy-duty rotary and DTH hydraulic borehole drilling rig for deep groundwater well development and core extraction.', '/uploads/borehole_rig.jpg', 'available'],
                        ['Geophysics Machines', 'Subsurface Exploration', 'Modern multi-electrode electrical resistivity and seismic exploration systems for precise groundwater and geological stratum mapping.', '/uploads/geophysics.jpg', 'available'],
                        ['Iron Roller', 'Compaction', 'Heavy vibratory twin-drum and padfoot compaction rollers for sub-base stabilization, road asphalt, and site foundation compaction.', '/uploads/roller.jpg', 'available']
                    ];
                    $stmt = $db->prepare("INSERT INTO equipment (name, type, description, image, status) VALUES (?, ?, ?, ?, ?)");
                    foreach ($equipment as $e) {
                        $stmt->execute($e);
                    }
                }

                // Seed projects if empty
                $checkProjects = $db->query("SELECT COUNT(*) as cnt FROM projects")->fetch();
                if ((int)($checkProjects['cnt'] ?? 0) === 0) {
                    $projects = [
                        ['Lokogoma Commercial Quarry Development', 'lokogoma-commercial-quarry-development', 'Quarry Management and Installation', 'FCT-Abuja, Nigeria', 'Turnkey quarry site establishment, rock face stripping, primary crushing plant assembly, and establishment of aggregate distribution logistics.', 'completed', '2023-11-15'],
                        ['Granite Blast-Hole Drilling & Controlled Blasting', 'granite-blast-hole-drilling-controlled-blasting', 'Rock Drilling & Blasting', 'Nasarawa State, Nigeria', 'Deep bench drilling across dense granite formations and execution of controlled micro-delay blasts ensuring strict vibration compliance near civil zones.', 'completed', '2024-03-20'],
                        ['Industrial Deep Aquifer Borehole Network', 'industrial-deep-aquifer-borehole-network', 'Borehole Drilling', 'Lugbe, FCT-Abuja', 'Hydrogeophysical survey, rotary drilling to 180m depth through hard crystalline basement rock, casing installation, and solar pump integration.', 'completed', '2024-07-10'],
                        ['Quarry Heavy Haul Road & Drainage Construction', 'quarry-heavy-haul-road-drainage-construction', 'Road Construction', 'Abuja Industrial Zone, Nigeria', 'Earthworks cut-and-fill, sub-base stabilization using crushed stone aggregate, culvert installation, and heavy paving to withstand 60-ton haulers.', 'ongoing', '2025-04-30']
                    ];
                    $stmt = $db->prepare("INSERT INTO projects (title, slug, category, location, description, status, completion_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    foreach ($projects as $p) {
                        $stmt->execute($p);
                    }
                }

                // Seed gallery if empty
                $checkGallery = $db->query("SELECT COUNT(*) as cnt FROM gallery")->fetch();
                if ((int)($checkGallery['cnt'] ?? 0) === 0) {
                    $gallery = [
                        ['Quarry Pit Operations', 'Active bench extraction and aggregate haulage', 'quarry', '/uploads/gallery_quarry.jpg'],
                        ['Wagon Drill On Site', 'Deep blast hole drilling for controlled fragmentation', 'drilling', '/uploads/gallery_drilling.jpg'],
                        ['Borehole Water Project', 'Completed deep borehole commissioning in FCT-Abuja', 'borehole', '/uploads/gallery_water.jpg'],
                        ['Excavation and Earthworks', 'Heavy excavation fleet at work on road foundation', 'construction', '/uploads/gallery_earthworks.jpg'],
                        ['Diamond Wire Saw Cutting', 'Precision granite dimensional stone cutting', 'mining', '/uploads/gallery_diamond.jpg'],
                        ['Soil Mechanics Testing', 'On-site geotechnical core sampling and SPT testing', 'engineering', '/uploads/gallery_soil.jpg']
                    ];
                    $stmt = $db->prepare("INSERT INTO gallery (title, caption, category, image_path) VALUES (?, ?, ?, ?)");
                    foreach ($gallery as $g) {
                        $stmt->execute($g);
                    }
                }
            }
        } catch (Throwable $e) {
            error_log("Schema initialization error: " . $e->getMessage());
        }
    }
}
