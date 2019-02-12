<?php

require_once __DIR__ . '/includes/checkForCorrectInstallation.php';


use OrganizeYourLinks\Reader;

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

try {
    $reader = new Reader();
    $reader->readFile(SETTINGS_FILE);
    $response = [
        'response' => $reader->getContent(),
        'composer_missing' => false,
        'data_dir_not_writable' => false
    ];
} catch (Exception $e) {
    $response = [
        'error' => $e->getMessage(),
        'composer_missing' => false,
        'data_dir_not_writable' => false
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT);