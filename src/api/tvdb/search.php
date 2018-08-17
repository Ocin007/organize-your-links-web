<?php


use OrganizeYourLinks\ExternalApi\TvdbApi;

require_once __DIR__.'/../../../vendor/autoload.php';


error_reporting(E_ERROR);
header('Access-Control-Allow-Origin: *');

const KEY_FILE = __DIR__.'/../../../data/apikey.json';
const TOKEN_FILE = __DIR__.'/../../../data/apitoken.json';

function returnError($e) {
    echo json_encode([
        'error' => $e
    ], JSON_PRETTY_PRINT);
    exit;
}

try {
    if(!isset($_POST['data'])) {
        returnError('no search token given');
    }

    $tvdb = new TvdbApi(KEY_FILE, TOKEN_FILE);
    $success = $tvdb->prepare();
    if(!$success) {
        returnError('preparing failed');
    }

    $success = $tvdb->search($_POST['data']);
    if(!$success) {
        returnError('nothing found');
    }

    echo json_encode([
        'response' => $tvdb->getContent()
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    returnError($e->getMessage());
}
