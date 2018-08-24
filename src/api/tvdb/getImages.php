<?php

use OrganizeYourLinks\ExternalApi\TvdbApi;

require_once __DIR__.'/../../../vendor/autoload.php';


error_reporting(E_ERROR);
//ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

const KEY_FILE = __DIR__.'/../../../data/apikey.json';
const TOKEN_FILE = __DIR__.'/../../../data/apitoken.json';
const CERT_FILE = __DIR__.'/../../../data/cacert.pem';

function returnError($e) {
    echo json_encode([
        'error' => $e
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

    $success = $tvdb->getImages($id);
    if(!$success) {
        returnError('no thumbnails found');
    }

    echo json_encode([
        'response' => $tvdb->getContent()
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    returnError($e->getMessage());
}
