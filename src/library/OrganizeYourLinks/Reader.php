<?php

namespace OrganizeYourLinks;


use Exception;

class Reader {

    public function readDir($dir) {
        $dataArray = [];
        $fileArray = scandir($dir);
        for($i = 0; $i < count($fileArray); $i++) {
            $file = $fileArray[$i];
            if($file !== '.' && $file !== '..') {
                $data = file_get_contents($dir.'/'.$file);
                $dataArray[] = json_decode($data, true);
            }
        }
        return $dataArray;
    }

    /**
     * @param $file
     * @return mixed
     * @throws Exception
     */
    public function readFile($file) {
        $data = file_get_contents($file);
        if($data === false) {
            throw new Exception('could not read file');
        }
        $content = json_decode($data, true);
        if($content === null) {
            throw new Exception('could not parse json');
        }
        return $content;
    }
}