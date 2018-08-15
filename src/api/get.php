<?php

require_once __DIR__.'/../../vendor/autoload.php';


use OrganizeYourLinks\OrganizeYourLinks\Sorter;
use OrganizeYourLinks\Reader;

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

const LIST_DIR = __DIR__.'/../../data/list';
const SETTINGS_FILE = __DIR__.'/../../data/settings.json';

//echo uniqid('', true).PHP_EOL;

try {
    $reader = new Reader();
    $reader->readDir(LIST_DIR);
    $content = $reader->getContent();

    $reader->readFile(SETTINGS_FILE);
    $settings = $reader->getContent();

    $sorter = new Sorter($settings);
    $sorter->sort($content);
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
    exit;
}

$response = [
    'response' => $content
];

echo json_encode($response, JSON_PRETTY_PRINT);