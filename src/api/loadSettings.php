<?php

require_once __DIR__.'/../../vendor/autoload.php';


use OrganizeYourLinks\Reader;

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

const SETTINGS_FILE = __DIR__.'/../../data/settings.json';

try {
    $reader = new Reader();
    $reader->readFile(SETTINGS_FILE);
    $response = [
        'response' => $reader->getContent()
    ];
} catch (Exception $e) {
    $response = [
        'error' => $e->getMessage()
    ];
}

echo json_encode($response, JSON_PRETTY_PRINT);