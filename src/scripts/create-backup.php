<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');

$count = 0;

function zipDir(ZipArchive $zip, $dir, $localName) {
    global $count;
    $array = scandir($dir);
    foreach ($array as $key => $value) {
        if($value !== '.' && $value !== '..') {
            $location = $dir.'/'.$value;
            $newLocalName = ($localName === '') ? $value : $localName.'/'.$value;
            if(is_file($location)) {
                echo 'Zip: '.$location.PHP_EOL;
                $zip->addFile($location, $newLocalName);
                $count++;
            } else if(is_dir($location)) {
                zipDir($zip, $location, $newLocalName);
            }
        }
    }
}

$backupDir = __DIR__.'/../../data-backup';

if(!is_dir($backupDir)) {
    mkdir($backupDir);
}

$dir = __DIR__.'/../../data';
$date = date('y-m-d');
$zipName = $backupDir.'/stand-'.$date.'.zip';

$zip = new ZipArchive();
$code = $zip->open($zipName, ZipArchive::CREATE);
echo PHP_EOL.'Erstelle '.$zipName.' :   Code '.$code.PHP_EOL;
if ($code !== TRUE) {
    die ("Could not open archive");
}

zipDir($zip, $dir, '');
$zip->close();
echo 'Fertig ('.$count.' Dateien)'.PHP_EOL;