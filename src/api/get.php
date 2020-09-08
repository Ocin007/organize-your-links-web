<?php

require_once __DIR__ . '/includes/checkForCorrectInstallation.php';

use OrganizeYourLinks\OrganizeYourLinks\Sorter;
use OrganizeYourLinks\Reader;

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');


try {
    $reader = new Reader();
    $content = $reader->readDir(LIST_DIR);

    $settings = $reader->readFile(SETTINGS_FILE);

    $sorter = new Sorter($settings);
    $sorter->sort($content);
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'composer_missing' => false,
        'data_dir_not_writable' => false,
        'key_file_missing' => false
    ], JSON_PRETTY_PRINT);
    exit;
}

$response = [
    'response' => $content,
    'composer_missing' => false,
    'data_dir_not_writable' => false,
    'key_file_missing' => false
];

echo json_encode($response, JSON_PRETTY_PRINT);