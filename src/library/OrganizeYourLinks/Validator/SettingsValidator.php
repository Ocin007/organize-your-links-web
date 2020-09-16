<?php

namespace OrganizeYourLinks\Validator;


class SettingsValidator implements ValidatorInterface {

    private array $keysTypeMap = [
        "startPage" => 'integer',
        "initialDataId" => 'string',
        "animationSpeedSingle" => 'double',
        "animationSpeedMulti" => 'double',
        "minSizeOfPlaylist" => 'integer',
        "colorBrightness" => 'integer',
        "titleLanguage" => 'string',
        "episodeCount" => 'boolean'
    ];

    function validate(array $dataList) : array {
        $errors = [];
        foreach ($this->keysTypeMap as $key => $type) {
            $errors = array_merge($errors, $this->checkForKeyAndType($dataList, $key, $type));
        }
        return $errors;
    }

    private function checkForKeyAndType(array $data, string $key, string $type) : array {
        $errors = [];
        if(!isset($data[$key])) {
            $errors[$key] = 'missing';
        } else if(gettype($data[$key]) !== $type) {
            $errors[$key] = 'wrong type';
        }
        return $errors;
    }
}