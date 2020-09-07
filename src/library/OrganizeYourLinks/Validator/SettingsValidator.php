<?php

namespace OrganizeYourLinks\OrganizeYourLinks\Validator;


class SettingsValidator implements Validator {

    private $keysTypeMap = [
        "startPage" => 'integer',
        "initialDataId" => 'string',
        "animationSpeedSingle" => 'double',
        "animationSpeedMulti" => 'double',
        "minSizeOfPlaylist" => 'integer',
        "colorBrightness" => 'integer',
        "titleLanguage" => 'string',
        "episodeCount" => 'boolean'
    ];

    function validate(array $dataList): array {
        $errors = [];
        foreach ($this->keysTypeMap as $key => $type) {
            $errors = array_merge($errors, $this->checkForKeyAndType($dataList, $key, $type));
        }
        return $errors;
    }

    private function checkForKeyAndType($data, $key, $type) {
        $errors = [];
        if(!isset($data[$key])) {
            $errors[$key] = 'missing';
        } else if(gettype($data[$key]) !== $type) {
            $errors[$key] = 'wrong type';
        }
        return $errors;
    }
}