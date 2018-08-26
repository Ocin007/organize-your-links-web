<?php

function resetProgress($file) {
    $content = json_decode(file_get_contents($file), true);
    $content['list'] = 3;
    for($s = 0; $s < count($content['seasons']); $s++) {
        for($ep = 0; $ep < count($content['seasons'][$s]['episodes']); $ep++) {
            $content['seasons'][$s]['episodes'][$ep]['watched'] = false;
        }
    }
    file_put_contents($file, json_encode($content, JSON_PRETTY_PRINT));
}

$listDir = __DIR__.'/../../data/list';
$fileList = scandir($listDir);

foreach ($fileList as $file) {
    if($file === '.' || $file === '..') {
        continue;
    }
    resetProgress($listDir.'/'.$file);
}