<?php

namespace OrganizeYourLinks\Validator;

use OrganizeYourLinks\OrganizeYourLinks\Validator\SettingsValidator;
use PHPUnit\Framework\TestCase;

class SettingsValidatorTest extends TestCase
{

    public function testValidateWrong()
    {
        $data = [
            "animationSpeedMulti" => "0.1"
        ];
        $expectedErrors = [
            "startPage" => 'missing',
            "initialDataId" => 'missing',
            "animationSpeedSingle" => 'missing',
            "animationSpeedMulti" => 'wrong type',
            "minSizeOfPlaylist" => 'missing',
            "colorBrightness" => 'missing'
        ];
        $subject = new SettingsValidator();
        $errors = $subject->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateCorrect()
    {
        $data = [
            "startPage" => 4,
            "initialDataId" => 'id2',
            "animationSpeedSingle" => 0.05,
            "animationSpeedMulti" => 0.1,
            "minSizeOfPlaylist" => 10,
            "colorBrightness" => 255
        ];
        $expectedErrors = [];
        $subject = new SettingsValidator();
        $errors = $subject->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }
}
