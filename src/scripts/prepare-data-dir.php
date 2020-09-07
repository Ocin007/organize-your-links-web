<?php
require_once __DIR__.'/../../vendor/autoload.php';

use OrganizeYourLinks\Settings;


const DATA_DIR = __DIR__.'/../../data';

$dirList = [
    DATA_DIR,
    DATA_DIR.'/list'
];
$fileList = [
    DATA_DIR.'/apikey.json' => json_encode(["apikey" => "", "userkey" => "", "username" => ""], JSON_PRETTY_PRINT),
    DATA_DIR.'/list-map.json' => '{}',
    DATA_DIR.'/settings.json' => json_encode(Settings::getDefaultSettings(), JSON_PRETTY_PRINT),
    DATA_DIR.'/cacert.pem' => file_get_contents('https://curl.haxx.se/ca/cacert.pem')
];

foreach ($dirList as $dir) {
    createDir($dir);
}

foreach ($fileList as $file => $content) {
    createFile($file, $content);
}

function createDir($dir) {
    if(!is_dir($dir)) {
        echo 'create directory '.$dir.PHP_EOL;
        mkdir($dir);
    }
}

function createFile($file, $content) {
    if(!file_exists($file)) {
        echo 'create file '.$file.PHP_EOL;
        file_put_contents($file, $content);
    }
}