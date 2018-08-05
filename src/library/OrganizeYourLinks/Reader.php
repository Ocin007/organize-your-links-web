<?php

namespace OrganizeYourLinks;


class Reader {

    private $dataArray = [];

    public function __construct() {}

    public function readDir($dir) {
        $fileArray = scandir($dir);
        for($i = 2; $i < count($fileArray); $i++) {
            $file = $fileArray[$i];
            $data = file_get_contents($dir.'/'.$file);
            $this->dataArray[] = json_decode($data, true);
        }
    }

    public function getContent() {
        return $this->dataArray;
    }

}