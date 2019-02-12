<?php

const KEY_FILE = __DIR__.'/../../../data/apikey.json';
const TOKEN_FILE = __DIR__.'/../../../data/apitoken.json';
const CERT_FILE = __DIR__.'/../../../data/cacert.pem';
const SETTINGS_FILE = __DIR__.'/../../../data/settings.json';
const LIST_DIR = __DIR__.'/../../../data/list';
const LIST_MAP = __DIR__.'/../../../data/list-map.json';
const DATA_DIR = __DIR__.'/../../../data';

$response = [
    'composer_missing' => false,
    'data_dir_not_writable' => false
];
if(file_exists(__DIR__.'/../../../vendor/autoload.php')) {
    require_once __DIR__.'/../../../vendor/autoload.php';
} else {
    $response['error'][] = 'composer not installed. execute \'composer install [--no-dev]\'';
    $response['composer_missing'] = true;
}
if(!is_writable(DATA_DIR)) {
    $response['error'][] = 'data directory not writable';
    $response['data_dir_not_writable'] = true;
}
if($response['composer_missing'] || $response['data_dir_not_writable']) {
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit;
} else {
    unset($response);
}