<?php

require_once __DIR__ . '/constants.php';

$response = [
    'composer_missing' => false,
    'data_dir_not_writable' => false,
    'key_file_missing' => false
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