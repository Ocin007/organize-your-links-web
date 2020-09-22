<?php

const LIST_DIR = __DIR__.'/../../data/list/';
const LIST_MAP = __DIR__.'/../../data/list-map.json';

const BASE_URL = 'http://localhost/organize-your-links-web/src/api/tvdb/proxy/image/';

$empty = 0;
$other = 0;
$changed = 0;

$idFileMap = json_decode(file_get_contents(LIST_MAP), true);
foreach ($idFileMap as $id => $file) {
    $series = json_decode(file_get_contents(LIST_DIR . $file), true);
    echo 'Name: '.getSeriesName($series).PHP_EOL;
    foreach ($series['seasons'] as $i => $season) {
        $newThumbnail = preg_replace(
            '/https:\/\/www\.thetvdb\.com\/banners\//',
            BASE_URL,
            $season['thumbnail']
        );
        if($season['thumbnail'] === '') {
            $empty++;
        } elseif($newThumbnail === $season['thumbnail']) {
            $other++;
        } else {
            $changed++;
        }
        $series['seasons'][$i]['thumbnail'] = $newThumbnail;
        echo '    Change: '.$season['thumbnail'].PHP_EOL;
        echo '        to: '.$newThumbnail.PHP_EOL;
    }
    file_put_contents(LIST_DIR . $file, json_encode($series, JSON_PRETTY_PRINT));
    echo PHP_EOL;
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

echo PHP_EOL.PHP_EOL.'Result:'.PHP_EOL;
echo 'Changed: '.$changed.PHP_EOL;
echo 'Empty  : '.$empty.PHP_EOL;
echo 'Other  : '.$other.PHP_EOL;
echo 'Sum    : '.($other+$empty+$changed).PHP_EOL;