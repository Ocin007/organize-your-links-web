<?php

if(is_file(__DIR__.'/../../vendor/autoload.php')) {
    echo json_encode([
        'error' => 'autoloader missing, do composer install --no-dev'
    ], JSON_PRETTY_PRINT);
    exit;
}

require_once __DIR__.'/../../vendor/autoload.php';


use OrganizeYourLinks\Reader;

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

const LIST_DIR = __DIR__.'/../../data/list';

//echo uniqid('', true).PHP_EOL;
$reader = new Reader();
$reader->readDir(LIST_DIR);

$response = [
    'response' => $reader->getContent()
];

echo json_encode($response, JSON_PRETTY_PRINT);