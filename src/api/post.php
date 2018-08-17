<?php

use OrganizeYourLinks\Generator\FileNameGenerator;
use OrganizeYourLinks\Reader;
use OrganizeYourLinks\Validator\DataListValidator;
use OrganizeYourLinks\Validator\NameValidator;
use OrganizeYourLinks\Writer;

require_once __DIR__.'/../../vendor/autoload.php';

error_reporting(E_ALL);
ini_set('display_errors', 'on');
header('Access-Control-Allow-Origin: *');

const LIST_DIR = __DIR__.'/../../data/list';
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
$validator = new DataListValidator();
$errors = $validator->validate($parsedData);
if(count($errors) !== 0) {
    echo json_encode([
        'error' => $errors
    ], JSON_PRETTY_PRINT);
    exit;
}

$fileNameGenerator = new FileNameGenerator();
$nameValidator = new NameValidator(new Reader(), $fileNameGenerator, LIST_DIR);
$errors = $nameValidator->validate($parsedData);
if(count($errors) !== 0) {
    echo json_encode([
        'error' => $errors
    ], JSON_PRETTY_PRINT);
    exit;
}

try {
    $writer = new Writer(LIST_DIR, $map);
    $writer->createNewFiles($nameValidator->getDataListMap(), LIST_MAP);
    echo json_encode([
        'response' => []
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo json_encode([
        'error' => [
            'valid but could not create files',
            $e->getMessage()
        ]
    ], JSON_PRETTY_PRINT);
}
