<?php

namespace OrganizeYourLinks\Validator;


use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

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

    function validate(array $dataList): ErrorListInterface
    {
        $errorList = new ErrorList();
        $noError = true;
        foreach ($this->keysTypeMap as $key => $type) {
            $noError &= $this->checkForKeyAndType($dataList, $key, $type);
        }
        if(!$noError) {
            $errorList->add(ErrorList::SETTINGS_INVALID);
        }
        return $errorList;
    }

    private function checkForKeyAndType(array $data, string $key, string $type): bool
    {
        return isset($data[$key]) && gettype($data[$key]) === $type;
    }
}