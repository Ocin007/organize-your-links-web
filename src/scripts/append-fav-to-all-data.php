<?php

const LIST_DIR = __DIR__.'/../../data/list';

function appendFavToAllData($dir) {
    $fileArray = scandir($dir);
    for($i = 0; $i < count($fileArray); $i++) {
        $file = $fileArray[$i];
        if($file !== '.' && $file !== '..') {
            $data = file_get_contents($dir.'/'.$file);
            $newData = appendFav(json_decode($data, true));
            $newData = rearrangeData($newData);
            $encoded = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            file_put_contents($dir.'/'.$file, $encoded);
        }
    }
}

function appendFav($data) {
    echo strBlue(getSeriesName($data));
    if(!isset($data['favorite'])) {
        $data['favorite'] = false;
        echo strSeries(getSeriesName($data));
    }
    for ($s = 0; $s < count($data['seasons']); $s++) {
        if(!isset($data['seasons'][$s]['favorite'])) {
            $data['seasons'][$s]['favorite'] = false;
            echo strS('s'.($s+1));
        }
        for ($ep = 0; $ep < count($data['seasons'][$s]['episodes']); $ep++) {
            if(!isset($data['seasons'][$s]['episodes'][$ep]['favorite'])) {
                $data['seasons'][$s]['episodes'][$ep]['favorite'] = false;
                echo strEp('s'.($s+1).'ep'.($ep+1));
            }
        }
    }
    return $data;
}

function rearrangeData($data) {
    $newData = [];
    $newData['id'] = $data['id'];
    $newData['tvdbId'] = $data['tvdbId'];
    $newData['name_de'] = $data['name_de'];
    $newData['name_en'] = $data['name_en'];
    $newData['name_jpn'] = $data['name_jpn'];
    $newData['list'] = $data['list'];
    $newData['rank'] = $data['rank'];
    $newData['favorite'] = $data['favorite'];
    $newData['seasons'] = [];
    for ($s = 0; $s < count($data['seasons']); $s++) {
        $newData['seasons'][$s]['url'] = $data['seasons'][$s]['url'];
        $newData['seasons'][$s]['thumbnail'] = $data['seasons'][$s]['thumbnail'];
        $newData['seasons'][$s]['favorite'] = $data['seasons'][$s]['favorite'];
        $newData['seasons'][$s]['episodes'] = [];
        for ($ep = 0; $ep < count($data['seasons'][$s]['episodes']); $ep++) {
            $newData['seasons'][$s]['episodes'][$ep]['name'] = $data['seasons'][$s]['episodes'][$ep]['name'];
            $newData['seasons'][$s]['episodes'][$ep]['url'] = $data['seasons'][$s]['episodes'][$ep]['url'];
            $newData['seasons'][$s]['episodes'][$ep]['favorite'] = $data['seasons'][$s]['episodes'][$ep]['favorite'];
            $newData['seasons'][$s]['episodes'][$ep]['watched'] = $data['seasons'][$s]['episodes'][$ep]['watched'];
        }
    }
    return $newData;
}

function getSeriesName($data) {
    if($data['name_de'] !== '') {
        return $data['name_de'];
    }
    if($data['name_en'] !== '') {
        return $data['name_en'];
    }
    if($data['name_jpn'] !== '') {
        return $data['name_jpn'];
    }
    return 'no name';
}

function strBlue($str) {
    return "\033[01;34m--> ".$str."\033[0m".PHP_EOL;
}

function strSeries($str) {
    return "    [\033[01;31m".$str."\033[0m]: added favorite = false".PHP_EOL;
}

function strS($str) {
    return "        [\033[01;33m".$str."\033[0m]: added favorite = false".PHP_EOL;
}

function strEp($str) {
    return "            [\033[01;32m".$str."\033[0m]: added favorite = false".PHP_EOL;
}

appendFavToAllData(LIST_DIR);




