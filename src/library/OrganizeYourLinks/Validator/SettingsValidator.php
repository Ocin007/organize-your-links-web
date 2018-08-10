<?php

namespace OrganizeYourLinks\OrganizeYourLinks\Validator;


class SettingsValidator implements Validator {

    function validate(array $dataList): array {
        $errors = [];
        $errors = array_merge($errors, $this->checkForKeyAndType($dataList, 'startPage', 'integer'));
        $errors = array_merge($errors, $this->checkForKeyAndType($dataList, 'initialDataId', 'string'));
        $errors = array_merge($errors, $this->checkForKeyAndType($dataList, 'animationSpeedSingle', 'double'));
        $errors = array_merge($errors, $this->checkForKeyAndType($dataList, 'animationSpeedMulti', 'double'));
        $errors = array_merge($errors, $this->checkForKeyAndType($dataList, 'minSizeOfPlaylist', 'integer'));
        $errors = array_merge($errors, $this->checkForKeyAndType($dataList, 'colorBrightness', 'integer'));
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