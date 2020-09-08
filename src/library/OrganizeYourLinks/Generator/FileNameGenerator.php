<?php

namespace OrganizeYourLinks\Generator;


class FileNameGenerator {

    function generateFileName(string $string) : string {
        $fileName = strtolower($string);
        $fileName = preg_replace('/[\s]+/', '-', $fileName);
        $fileNameArray = str_split($fileName, 1);
        foreach ($fileNameArray as $char) {
            if(!preg_match('/[a-z0-9-]/', $char)) {
                $fileName = str_replace($char, '', $fileName);
            }
        }
        return $fileName.'.json';
    }
}