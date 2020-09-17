<?php

namespace OrganizeYourLinks\Validator;


use OrganizeYourLinks\Manager\SettingsManager;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class SettingsValidator implements ValidatorInterface {

    private array $keysTypeMap = [
        SettingsManager::KEY_START_PAGE => 'integer',
        SettingsManager::KEY_INITIAL_DATA_ID => 'string',
        SettingsManager::KEY_ANIMATION_SPEED_SINGLE => 'double',
        SettingsManager::KEY_ANIMATION_SPEED_MULTI => 'double',
        SettingsManager::KEY_MIN_SIZE_OF_PLAYLIST => 'integer',
        SettingsManager::KEY_COLOR_BRIGHTNESS => 'integer',
        SettingsManager::KEY_TITLE_LANGUAGE => 'string',
        SettingsManager::KEY_EPISODE_COUNT => 'boolean'
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