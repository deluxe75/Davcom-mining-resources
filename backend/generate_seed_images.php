<?php
// Generates clean industrial graphics for seeded items in backend/uploads/
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$items = [
    ['file' => 'mining.jpg', 'title' => 'MINING OPERATIONS', 'sub' => 'Mineral Exploration & Quarrying', 'color' => [30, 41, 59], 'accent' => [245, 158, 11]],
    ['file' => 'drilling.jpg', 'title' => 'ROCK DRILLING & BLASTING', 'sub' => 'Controlled Fragmentation', 'color' => [24, 32, 47], 'accent' => [234, 88, 12]],
    ['file' => 'quarry.jpg', 'title' => 'QUARRY MANAGEMENT', 'sub' => 'Aggregate Processing Plant', 'color' => [45, 55, 72], 'accent' => [217, 119, 6]],
    ['file' => 'borehole.jpg', 'title' => 'BOREHOLE DRILLING', 'sub' => 'Deep Aquifer Extraction & Reticulation', 'color' => [15, 23, 42], 'accent' => [14, 165, 233]],
    ['file' => 'soil_testing.jpg', 'title' => 'SOIL TESTING & SPT', 'sub' => 'Geotechnical Engineering Investigation', 'color' => [39, 39, 42], 'accent' => [16, 185, 129]],
    ['file' => 'building.jpg', 'title' => 'BUILDING CONSTRUCTION', 'sub' => 'Structural Concrete & Architectural', 'color' => [30, 41, 59], 'accent' => [245, 158, 11]],
    ['file' => 'road.jpg', 'title' => 'ROAD CONSTRUCTION', 'sub' => 'Heavy Haulage & Asphalt Highway', 'color' => [24, 24, 27], 'accent' => [234, 88, 12]],
    ['file' => 'civil.jpg', 'title' => 'CIVIL WORKS', 'sub' => 'Earthworks & Heavy Infrastructure', 'color' => [40, 53, 70], 'accent' => [245, 158, 11]],
    ['file' => 'engineering.jpg', 'title' => 'ENGINEERING SUPPLIES', 'sub' => 'Heavy Mining Plant & Spares', 'color' => [20, 30, 45], 'accent' => [234, 88, 12]],

    ['file' => 'excavator.jpg', 'title' => 'EXCAVATOR FLEET', 'sub' => 'Heavy Hydraulic Crawler Fleet', 'color' => [31, 41, 55], 'accent' => [245, 158, 11]],
    ['file' => 'air_compressor.jpg', 'title' => 'AIR COMPRESSORS', 'sub' => 'High-Pressure Pneumatic Compressors', 'color' => [17, 24, 39], 'accent' => [245, 158, 11]],
    ['file' => 'jack_hammer.jpg', 'title' => 'JACK HAMMERS', 'sub' => 'Pneumatic Rock Breaking Systems', 'color' => [24, 32, 47], 'accent' => [234, 88, 12]],
    ['file' => 'wagon_drill.jpg', 'title' => 'WAGON DRILLING RIG', 'sub' => 'Deep Blast Hole Drill Rigs', 'color' => [28, 38, 54], 'accent' => [245, 158, 11]],
    ['file' => 'diamond_cutter.jpg', 'title' => 'DIAMOND CUTTER', 'sub' => 'Precision Dimension Stone Saw', 'color' => [30, 41, 59], 'accent' => [59, 130, 246]],
    ['file' => 'hydraulic_breaker.jpg', 'title' => 'HYDRAULIC BREAKER', 'sub' => 'Secondary Fragmentation Booms', 'color' => [24, 24, 27], 'accent' => [234, 88, 12]],
    ['file' => 'grader.jpg', 'title' => 'HEAVY MOTOR GRADER', 'sub' => 'Haul Road Profiling & Leveling', 'color' => [38, 48, 64], 'accent' => [245, 158, 11]],
    ['file' => 'loader.jpg', 'title' => 'PALE / WHEEL LOADER', 'sub' => 'Bulk Aggregate Handling & Loading', 'color' => [30, 41, 59], 'accent' => [245, 158, 11]],
    ['file' => 'borehole_rig.jpg', 'title' => 'BOREHOLE DRILLING RIG', 'sub' => 'Hydraulic Rotary & DTH Rigs', 'color' => [15, 23, 42], 'accent' => [14, 165, 233]],
    ['file' => 'geophysics.jpg', 'title' => 'GEOPHYSICS EQUIPMENT', 'sub' => 'Resistivity & Seismic Mapping', 'color' => [24, 32, 47], 'accent' => [16, 185, 129]],
    ['file' => 'roller.jpg', 'title' => 'VIBRATORY IRON ROLLER', 'sub' => 'Sub-base Compaction Heavy Roller', 'color' => [31, 41, 55], 'accent' => [245, 158, 11]],

    ['file' => 'proj1_1.jpg', 'title' => 'LOKOGOMA QUARRY', 'sub' => 'Pit Opening & Primary Plant', 'color' => [24, 32, 47], 'accent' => [245, 158, 11]],
    ['file' => 'proj1_2.jpg', 'title' => 'AGGREGATE STOCKPILE', 'sub' => 'Haulage & Distribution Fleet', 'color' => [31, 41, 55], 'accent' => [234, 88, 12]],
    ['file' => 'proj2_1.jpg', 'title' => 'BENCH DRILLING NASARAWA', 'sub' => 'Controlled Blast-Hole Array', 'color' => [20, 28, 40], 'accent' => [245, 158, 11]],
    ['file' => 'proj3_1.jpg', 'title' => 'LUGBE INDUSTRIAL BOREHOLE', 'sub' => '180m Crystalline Rock Well', 'color' => [15, 23, 42], 'accent' => [14, 165, 233]],
    ['file' => 'proj4_1.jpg', 'title' => 'HEAVY HAUL ROAD PROJECT', 'sub' => 'Compaction & Crushed Stone Base', 'color' => [24, 24, 27], 'accent' => [245, 158, 11]],

    ['file' => 'gallery_quarry.jpg', 'title' => 'QUARRY OPERATIONS', 'sub' => 'Bench Face Extraction', 'color' => [30, 41, 59], 'accent' => [245, 158, 11]],
    ['file' => 'gallery_drilling.jpg', 'title' => 'DRILLING RIG ON SITE', 'sub' => 'Blast Hole Production', 'color' => [24, 32, 47], 'accent' => [234, 88, 12]],
    ['file' => 'gallery_water.jpg', 'title' => 'BOREHOLE WATER PROJECT', 'sub' => 'Community Water Commissioning', 'color' => [15, 23, 42], 'accent' => [14, 165, 233]],
    ['file' => 'gallery_earthworks.jpg', 'title' => 'EXCAVATION & EARTHWORKS', 'sub' => 'Bulk Cut and Fill', 'color' => [31, 41, 55], 'accent' => [245, 158, 11]],
    ['file' => 'gallery_diamond.jpg', 'title' => 'DIAMOND WIRE CUTTING', 'sub' => 'Granite Dimensional Dressing', 'color' => [24, 32, 47], 'accent' => [59, 130, 246]],
    ['file' => 'gallery_soil.jpg', 'title' => 'GEOTECHNICAL SAMPLING', 'sub' => 'Core Extraction & Lab Analysis', 'color' => [39, 39, 42], 'accent' => [16, 185, 129]],
];

$width = 800;
$height = 500;

foreach ($items as $item) {
    $img = imagecreatetruecolor($width, $height);

    // Background
    $bgColor = imagecolorallocate($img, $item['color'][0], $item['color'][1], $item['color'][2]);
    imagefilledrectangle($img, 0, 0, $width, $height, $bgColor);

    // Subtle Grid pattern
    $gridColor = imagecolorallocatealpha($img, 255, 255, 255, 118);
    for ($x = 0; $x < $width; $x += 40) {
        imageline($img, $x, 0, $x, $height, $gridColor);
    }
    for ($y = 0; $y < $height; $y += 40) {
        imageline($img, 0, $y, $width, $y, $gridColor);
    }

    // Accent header line
    $accentColor = imagecolorallocate($img, $item['accent'][0], $item['accent'][1], $item['accent'][2]);
    imagefilledrectangle($img, 0, 0, $width, 8, $accentColor);

    // Dark badge container
    $badgeBg = imagecolorallocatealpha($img, 0, 0, 0, 40);
    imagefilledrectangle($img, 40, 140, $width - 40, 360, $badgeBg);
    imagerectangle($img, 40, 140, $width - 40, 360, $accentColor);

    // Company Tag
    $tagColor = imagecolorallocate($img, 245, 158, 11); // Amber
    imagestring($img, 5, 70, 175, "DAVCOM MINING RESOURCES NIG LTD", $tagColor);

    // Title
    $textColor = imagecolorallocate($img, 255, 255, 255);
    imagestring($img, 5, 70, 220, strtoupper($item['title']), $textColor);

    // Subtitle
    $subColor = imagecolorallocate($img, 203, 213, 225);
    imagestring($img, 4, 70, 260, $item['sub'], $subColor);

    // Industrial footer watermark
    $wmColor = imagecolorallocate($img, 148, 163, 184);
    imagestring($img, 3, 70, 305, "Operational Equipment & Field Operations | RC: Incorporated 2016", $wmColor);

    imagejpeg($img, $uploadDir . $item['file'], 85);
    imagedestroy($img);
}

echo "Generated " . count($items) . " seed images in " . $uploadDir . "\n";
