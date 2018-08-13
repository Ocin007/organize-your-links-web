<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');

function zipDir(ZipArchive $zip, $dir, $localName) {
    $array = scandir($dir);
    for($i = 2; $i < count($array); $i++) {
        $location = $dir.'/'.$array[$i];
        $newLocalName = ($localName === '') ? $array[$i] : $localName.'/'.$array[$i];
        if(is_file($location)) {
            $zip->addFile($location, $newLocalName);
        } else if(is_dir($location)) {
            zipDir($zip, $location, $newLocalName);
        }
    }
}

$backupDir = __DIR__.'/../../data-backup';
$dir = __DIR__.'/../../data';
$count = count(scandir($backupDir)) - 1;
$zipName = $backupDir.'/backup-nr'.$count.'.zip';

$zip = new ZipArchive();
$code = $zip->open($zipName, ZipArchive::CREATE);
echo PHP_EOL.'Erstelle '.$zipName.' :   Code '.$code.PHP_EOL;
if ($code !== TRUE) {
    die ("Could not open archive");
}

zipDir($zip, $dir, '');
$zip->close();
echo 'Fertig';