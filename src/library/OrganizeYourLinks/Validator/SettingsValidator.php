<?php

namespace OrganizeYourLinks\Validator;

use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\Setting;

class SettingsValidator implements ValidatorInterface
{

    function validate(array $dataList): ErrorListInterface
    {
        $errorList = new ErrorList();
        $isValid = $this->validateWithKeyTypeMap($dataList, Setting::KEY_TYPE_MAP);
        if (!$isValid) {
            $errorList->add(ErrorList::SETTINGS_INVALID);
        }

        return $errorList;
    }

    private function validateWithKeyTypeMap($data, array $map): bool
    {
        if (gettype($data) !== 'array') {
            return false;
        }
        $isValid = true;
        foreach ($map as $key => $type) {
            if (gettype($type) === 'array') {
                $isValid &= $this->validateWithKeyTypeMap($data[$key], $type);
            } else {
                $isValid &= $this->checkForKeyAndType($data, $key, $type);
            }
        }

        return $isValid;
    }

    private function checkForKeyAndType(array $data, string $key, string $type): bool
    {
        return isset($data[$key]) && gettype($data[$key]) === $type;
    }
}