<?php

require_once __DIR__ . '/constants.php';

if(!file_exists(KEY_FILE)) {
    echo json_encode([
        'composer_missing' => false,
        'data_dir_not_writable' => false,
        'key_file_missing' => true
    ], JSON_PRETTY_PRINT);
    exit;
}