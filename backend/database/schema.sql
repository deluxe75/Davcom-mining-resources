-- DAVCOM MINING RESOURCES NIG LTD
-- Complete MySQL Database Schema (InnoDB)
-- Compatible with MySQL 5.7+, MySQL 8+, MariaDB 10+, and XAMPP

CREATE DATABASE IF NOT EXISTS `davcom_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `davcom_db`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `project_images`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `equipment`;
DROP TABLE IF EXISTS `gallery`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `service_requests`;
DROP TABLE IF EXISTS `admins`;

-- 1. Admins Table
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Services Table
CREATE TABLE `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(100) NULL,
  `image` VARCHAR(255) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_services_slug` (`slug`),
  INDEX `idx_services_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Projects Table
CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'completed',
  `completion_date` DATE NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_projects_slug` (`slug`),
  INDEX `idx_projects_category` (`category`),
  INDEX `idx_projects_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Project Images Table
CREATE TABLE `project_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_proj_img_project_id` (`project_id`),
  CONSTRAINT `fk_project_images_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `projects` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Equipment Table
CREATE TABLE `equipment` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL DEFAULT 'Heavy Machinery',
  `description` TEXT NOT NULL,
  `image` VARCHAR(255) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_equipment_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Gallery Table
CREATE TABLE `gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NULL,
  `caption` VARCHAR(255) NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'general',
  `image_path` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_gallery_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Contact Messages Table
CREATE TABLE `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) NULL,
  `company` VARCHAR(255) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'New',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_contact_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Service Requests Table
CREATE TABLE `service_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `service` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NULL,
  `description` TEXT NOT NULL,
  `preferred_contact_method` VARCHAR(50) NOT NULL DEFAULT 'email',
  `message` TEXT NULL,
  `admin_notes` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_service_req_status` (`status`),
  INDEX `idx_service_req_service` (`service`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- SEED DATA (Authoritative Company Profile)
-- ==========================================================

-- Admin Seed (Password is: admin123456)
INSERT INTO `admins` (`id`, `name`, `email`, `password`) VALUES
(1, 'Davcom Administrator', 'admin@davcom.com', '$2y$10$13BYAblghq4dWiEDejm5ZeBiR5mdaSKDZPDVku3Rkvi3.CRU240tu');

-- Services Seed
INSERT INTO `services` (`id`, `name`, `slug`, `description`, `icon`, `image`, `status`) VALUES
(1, 'Mining', 'mining', 'Comprehensive mineral exploration, site survey evaluation, extraction, and environmentally compliant quarrying services adhering strictly to Nigerian mining regulations and international standards.', 'Pickaxe', '/uploads/mining.jpg', 'active'),
(2, 'Rock Drilling & Blasting', 'rock-drilling-blasting', 'Specialized precision bench drilling, controlled rock blasting, vibration monitoring, explosive logistics, and safety management for quarry pits and infrastructure excavations.', 'Hammer', '/uploads/drilling.jpg', 'active'),
(3, 'Quarry Management and Installation', 'quarry-management-installation', 'Turnkey quarry setup, aggregate plant installation, primary/secondary crushing circuit commissioning, yield optimization, and continuous pit operation oversight.', 'Cog', '/uploads/quarry.jpg', 'active'),
(4, 'Borehole Drilling', 'borehole-drilling', 'Industrial, commercial, and community rotary borehole drilling, hydrogeological geophysical survey, deep aquifer development, submersible pump installations, and water reticulation.', 'Droplets', '/uploads/borehole.jpg', 'active'),
(5, 'Soil Testing', 'soil-testing', 'Advanced geotechnical engineering investigations, Standard Penetration Tests (SPT), undisturbed core sampling, laboratory soil classification, and foundation bearing capacity analysis.', 'FileSpreadsheet', '/uploads/soil_testing.jpg', 'active'),
(6, 'Building Construction', 'building-construction', 'Full-cycle architectural execution, structural reinforced concrete construction, commercial complexes, and industrial warehousing built to rigorous engineering standards.', 'Building2', '/uploads/building.jpg', 'active'),
(7, 'Road Construction', 'road-construction', 'Highway engineering, heavy earthworks, stone base stabilization, asphalt paving, drainage culverts, and high-load haul roads for mining and civil transit.', 'Truck', '/uploads/road.jpg', 'active'),
(8, 'Civil Works', 'civil-works', 'Heavy reinforced foundation engineering, retaining structures, bridge piers, culvert drainage networks, and industrial site infrastructure development.', 'HardHat', '/uploads/civil.jpg', 'active'),
(9, 'General Engineering and Supplies', 'general-engineering-supplies', 'Procurement and delivery of certified mining wear parts, drill rods, blast accessories, hydraulic systems, plant spare parts, and mechanical maintenance consulting.', 'Wrench', '/uploads/engineering.jpg', 'active');

-- Equipment Seed (Directly from DAVCOM Company Profile)
INSERT INTO `equipment` (`id`, `name`, `description`, `image`, `status`) VALUES
(1, 'Excavator', 'Heavy-duty hydraulic crawler excavators engineered for quarry face clearing, mass earthmoving, trenching, and bulk truck loading.', '/uploads/excavator.jpg', 'available'),
(2, 'Air Compressors', 'High-capacity diesel portable air compressors delivering consistent pneumatic volume for blast hole drilling rigs and quarry pneumatic tools.', '/uploads/air_compressor.jpg', 'available'),
(3, 'Jack Hammer', 'Heavy-duty pneumatic rock-drilling and breaking jackhammers for secondary rock fragmenting and trenching.', '/uploads/jack_hammer.jpg', 'available'),
(4, 'Wagon Drilling Machine', 'High-efficiency pneumatic wagon drill rigs equipped for precision vertical and angled blast hole drilling across hard rock formations.', '/uploads/wagon_drill.jpg', 'available'),
(5, 'Rock Diamond Cutting Machine', 'Precision diamond wire and blade stone cutters engineered for clean granite dimension block quarrying and monument cutting.', '/uploads/diamond_cutter.jpg', 'available'),
(6, 'Rock Hydraulic Breaker', 'High-impact boom-mounted hydraulic breakers for rapid secondary oversize reduction in mining pits and quarries.', '/uploads/hydraulic_breaker.jpg', 'available'),
(7, 'Grader', 'Heavy motor graders for precision haul road grading, site levelling, and drainage contour preparation.', '/uploads/grader.jpg', 'available'),
(8, 'Pale Loader', 'High-capacity articulated wheel loaders designed for aggregate stockpile handling, rapid hopper feeding, and bulk loading.', '/uploads/loader.jpg', 'available'),
(9, 'Borehole Drilling Machine', 'Heavy-duty rotary and DTH hydraulic borehole drilling rig for deep groundwater well development and core extraction.', '/uploads/borehole_rig.jpg', 'available'),
(10, 'Geophysics Machines', 'Modern multi-electrode electrical resistivity and seismic exploration systems for precise groundwater and geological stratum mapping.', '/uploads/geophysics.jpg', 'available'),
(11, 'Iron Roller', 'Heavy vibratory twin-drum and padfoot compaction rollers for sub-base stabilization, road asphalt, and site foundation compaction.', '/uploads/roller.jpg', 'available');

-- Projects Seed
INSERT INTO `projects` (`id`, `title`, `slug`, `category`, `location`, `description`, `status`, `completion_date`) VALUES
(1, 'Lokogoma Commercial Quarry Development', 'lokogoma-commercial-quarry-development', 'Quarry Management and Installation', 'FCT-Abuja, Nigeria', 'Turnkey quarry site establishment, rock face stripping, primary crushing plant assembly, and establishment of aggregate distribution logistics.', 'completed', '2023-11-15'),
(2, 'Granite Blast-Hole Drilling & Controlled Blasting', 'granite-blast-hole-drilling-controlled-blasting', 'Rock Drilling & Blasting', 'Nasarawa State, Nigeria', 'Deep bench drilling across dense granite formations and execution of controlled micro-delay blasts ensuring strict vibration compliance near civil zones.', 'completed', '2024-03-20'),
(3, 'Industrial Deep Aquifer Borehole Network', 'industrial-deep-aquifer-borehole-network', 'Borehole Drilling', 'Lugbe, FCT-Abuja', 'Hydrogeophysical survey, rotary drilling to 180m depth through hard crystalline basement rock, casing installation, and solar pump integration.', 'completed', '2024-07-10'),
(4, 'Quarry Heavy Haul Road & Drainage Construction', 'quarry-heavy-haul-road-drainage-construction', 'Road Construction', 'Abuja Industrial Zone, Nigeria', 'Earthworks cut-and-fill, sub-base stabilization using crushed stone aggregate, culvert installation, and heavy paving to withstand 60-ton haulers.', 'ongoing', '2025-04-30');

-- Project Images Seed
INSERT INTO `project_images` (`project_id`, `image_path`, `caption`) VALUES
(1, '/uploads/proj1_1.jpg', 'Quarry pit opening and primary crusher circuit setup'),
(1, '/uploads/proj1_2.jpg', 'Excavator and loader operations at aggregate stockpile'),
(2, '/uploads/proj2_1.jpg', 'Wagon drill rig executing deep blast holes'),
(3, '/uploads/proj3_1.jpg', 'Rotary borehole rig drilling through basement rock'),
(4, '/uploads/proj4_1.jpg', 'Heavy grader and roller compacting stone base');

-- Gallery Seed
INSERT INTO `gallery` (`title`, `caption`, `category`, `image_path`) VALUES
('Quarry Pit Operations', 'Active bench extraction and aggregate haulage', 'quarry', '/uploads/gallery_quarry.jpg'),
('Wagon Drill On Site', 'Deep blast hole drilling for controlled fragmentation', 'drilling', '/uploads/gallery_drilling.jpg'),
('Borehole Water Project', 'Completed deep borehole commissioning in FCT-Abuja', 'borehole', '/uploads/gallery_water.jpg'),
('Excavation and Earthworks', 'Heavy excavation fleet at work on road foundation', 'construction', '/uploads/gallery_earthworks.jpg'),
('Diamond Wire Saw Cutting', 'Precision granite dimensional stone cutting', 'mining', '/uploads/gallery_diamond.jpg'),
('Soil Mechanics Testing', 'On-site geotechnical core sampling and SPT testing', 'engineering', '/uploads/gallery_soil.jpg');
