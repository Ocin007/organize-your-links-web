<?php

namespace OrganizeYourLinks;


class Reader {

    private $dataArray = [];

    public function __construct() {}

    public function readDir($dir) {
        $this->dataArray = [];
        $fileArray = scandir($dir);
        for($i = 0; $i < count($fileArray); $i++) {
            $file = $fileArray[$i];
            if($file !== '.' && $file !== '..') {
                $data = file_get_contents($dir.'/'.$file);
                $this->dataArray[] = json_decode($data, true);
            }
        }
    }

    /**
     * @param $file
     * @throws \Exception
     */
    public function readFile($file) {
        $data = file_get_contents($file);
        if($data === false) {
            throw new \Exception('could not read file');
        }
        $content = json_decode($data, true);
        if($content === null) {
            throw new \Exception('could not parse json');
        }
        $this->dataArray = $content;
    }

    public function getContent() {
        return $this->dataArray;
    }

}