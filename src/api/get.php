<?php

require_once __DIR__.'/../../vendor/autoload.php';


use OrganizeYourLinks\Reader;

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

const LIST_DIR = __DIR__.'/../../data/list';

//TODO: sortieren nach name abh. von settings
//echo uniqid('', true).PHP_EOL;
$reader = new Reader();
$reader->readDir(LIST_DIR);

$response = [
    'response' => $reader->getContent()
];

echo json_encode($response, JSON_PRETTY_PRINT);