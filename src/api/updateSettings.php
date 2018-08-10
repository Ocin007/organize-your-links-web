<?php

use OrganizeYourLinks\OrganizeYourLinks\Validator\SettingsValidator;
use OrganizeYourLinks\Validator\ListMapValidator;
use OrganizeYourLinks\Validator\Mode;
use OrganizeYourLinks\Writer;

require_once __DIR__.'/../../vendor/autoload.php';

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

const SETTINGS_FILE = __DIR__.'/../../data/settings.json';
const LIST_MAP = __DIR__.'/../../data/list-map.json';

if(!isset($_POST['data'])) {
    echo json_encode([
        'error' => 'no data was sent'
    ], JSON_PRETTY_PRINT);
    exit;
}

try {
    $parsedData = json_decode($_POST['data'], true);
    if($parsedData === null) {
        throw new Exception('json_decode returned null');
    }
} catch (Exception $e) {
    echo json_encode([
        'error' => [
            'data is not correct json',
            $e->getMessage()
        ]
    ], JSON_PRETTY_PRINT);
    exit;
}


$map = json_decode(file_get_contents(LIST_MAP), true);
$validator = new SettingsValidator();
$errors = $validator->validate($parsedData);
$checkId = new ListMapValidator(Mode::UPDATE, $map);
$errors = array_merge($errors, $checkId->validate($parsedData));
if(count($errors) !== 0) {
    echo json_encode([
        'error' => $errors
    ], JSON_PRETTY_PRINT);
    exit;
}

$writer = new Writer(SETTINGS_FILE, $map);
$writer->updateFile($parsedData);
$errors = $writer->getErrorList();
$response = [];
if(count($errors) !== 0) {
    $response['error'] = $errors;
} else {
    $response['response'] = [];
}
echo json_encode($response, JSON_PRETTY_PRINT);