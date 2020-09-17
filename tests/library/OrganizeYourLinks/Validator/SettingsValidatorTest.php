<?php

namespace OrganizeYourLinks\Validator;

use PHPUnit\Framework\TestCase;

class SettingsValidatorTest extends TestCase
{
    private SettingsValidator $subject;

    public function setUp(): void
    {
        $this->subject = new SettingsValidator();
    }

    public function testValidateWrong()
    {
        $data = [
            "animationSpeedMulti" => "0.1"
        ];
        $expectedErrors = [
            'settings invalid'
        ];
        $errorList = $this->subject->validate($data);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateCorrect()
    {
        $data = [
            "startPage" => 4,
            "initialDataId" => 'id2',
            "animationSpeedSingle" => 0.05,
            "animationSpeedMulti" => 0.1,
            "minSizeOfPlaylist" => 10,
            "colorBrightness" => 255,
            "titleLanguage" => 'name_de',
            "episodeCount" => true
        ];
        $expectedErrors = [];
        $errorList = $this->subject->validate($data);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }
}
