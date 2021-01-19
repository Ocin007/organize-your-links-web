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

    /**
     * @dataProvider wrongDataProvider
     *
     * @param array $data
     */
    public function testValidateWrong(array $data)
    {
        $expectedErrors = [
            'settings invalid',
        ];
        $errorList = $this->subject->validate($data);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    /**
     * @dataProvider correctDataProvider
     *
     * @param array $data
     */
    public function testValidateCorrect(array $data)
    {
        $expectedErrors = [];
        $errorList = $this->subject->validate($data);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function wrongDataProvider(): array
    {
        return [
            $this->provideWrongData1(),
            $this->provideWrongData2(),
            $this->provideWrongData3(),
            $this->provideWrongData4(),
        ];
    }

    public function correctDataProvider(): array
    {
        return [
            $this->provideCorrectData1(),
        ];
    }

    private function provideWrongData1(): array
    {
        return [
            [
                "animationSpeedMulti" => "0.1",
            ],
        ];
    }

    private function provideWrongData2(): array
    {
        return [
            [
                "startPage" => 4,
                "initialDataId" => 'id2',
                "animationSpeedSingle" => 0.05,
                "animationSpeedMulti" => 0.1,
                "minSizeOfPlaylist" => 10,
                "colorBrightness" => 255,
                "titleLanguage" => 'name_de',
                "episodeCount" => true,
                'notification' => null,
            ],
        ];
    }

    private function provideWrongData3(): array
    {
        return [
            [
                'startPage' => 4,
                'initialDataId' => 'id2',
                'animationSpeedSingle' => 0.05,
                'animationSpeedMulti' => 0.1,
                'minSizeOfPlaylist' => 10,
                'colorBrightness' => 255,
                'titleLanguage' => 'name_de',
                'episodeCount' => true,
                'notification' => [
                    'success' => [
                        'visible' => true,
                        'autoClose' => true,
                        'interval' => 3000,
                    ],
                    'info' => 5,
                    'warn' => 'test',
                ],
            ],
        ];
    }

    private function provideWrongData4(): array
    {
        return [
            [
                'startPage' => 4,
                'initialDataId' => 'id2',
                'animationSpeedSingle' => 0.05,
                'animationSpeedMulti' => 0.1,
                'minSizeOfPlaylist' => 10,
                'colorBrightness' => 255,
                'titleLanguage' => 'name_de',
                'episodeCount' => true,
                'notification' => [
                    'success' => [
                        'visible' => true,
                        'autoClose' => true,
                        'interval' => 3000,
                    ],
                    'debug' => [
                        'autoClose' => false,
                        'interval' => 3000,
                    ],
                    'info' => [
                        'visible' => false,
                        'interval' => 3000,
                    ],
                    'warn' => [
                        'visible' => false,
                        'autoClose' => true,
                    ],
                    'error' => [
                        'visible' => true,
                        'autoClose' => true,
                        'interval' => '3000',
                    ],
                ],
            ],
        ];
    }

    private function provideCorrectData1(): array
    {
        return [
            [
                'startPage' => 'page-id',
                'initialDataId' => 'id2',
                'animationSpeedSingle' => 0.05,
                'animationSpeedMulti' => 0.1,
                'minSizeOfPlaylist' => 10,
                'colorBrightness' => 255,
                'titleLanguage' => 'name_de',
                'episodeCount' => true,
                'notification' => [
                    'success' => [
                        'visible' => true,
                        'autoClose' => true,
                        'interval' => 3000,
                    ],
                    'debug' => [
                        'visible' => true,
                        'autoClose' => false,
                        'interval' => 3000,
                    ],
                    'info' => [
                        'visible' => false,
                        'autoClose' => false,
                        'interval' => 3000,
                    ],
                    'warn' => [
                        'visible' => false,
                        'autoClose' => true,
                        'interval' => 3000,
                    ],
                    'error' => [
                        'visible' => true,
                        'autoClose' => true,
                        'interval' => 3000,
                    ],
                ],
            ],
        ];
    }
}
