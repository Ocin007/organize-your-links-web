<?php

require_once __DIR__ . '/../includes/checkForCorrectInstallation.php';

use OrganizeYourLinks\ExternalApi\TvdbApi;


error_reporting(E_ERROR);
//ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

function returnError($e) {
    echo json_encode([
        'error' => $e,
        'composer_missing' => false,
        'data_dir_not_writable' => false
    ], JSON_PRETTY_PRINT);
    exit;
}

if(!file_exists(CERT_FILE)) {
    returnError('certification file missing');
}

try {
    if(!isset($_POST['data'])) {
        returnError('no id given');
    }
    $id = json_decode($_POST['data']);
    if($id === false) {
        returnError('cannot be parsed');
    }

    $tvdb = new TvdbApi(KEY_FILE, TOKEN_FILE, CERT_FILE);
    $success = $tvdb->prepare();
    if(!$success) {
        returnError('preparing failed');
    }

    $tvdb->getEpisodes($id);

    echo json_encode([
        'response' => $tvdb->getContent(),
        'composer_missing' => false,
        'data_dir_not_writable' => false
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    returnError($e->getMessage());
}
