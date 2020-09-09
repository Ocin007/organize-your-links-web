<?php

namespace OrganizeYourLinks\Validator;

use PHPUnit\Framework\TestCase;

class DataListValidatorTest extends TestCase
{
    private DataListValidator $subject;

    public function setUp(): void
    {
        $this->subject = new DataListValidator();
    }

    public function testValidateEmpty()
    {
        $testData = [];
        $expectedErrors = [];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateTwoEmptyMembers()
    {
        $testData = [[], []];
        $expectedErrors = [
            0 => [
                'id' => 'missing',
                'tvdbId' => 'missing',
                'name_de' => 'missing',
                'name_en' => 'missing',
                'name_jpn' => 'missing',
                'list' => 'missing',
                'rank' => 'missing',
                'favorite' => 'missing',
                'seasons' => 'missing'
            ],
            1 => [
                'id' => 'missing',
                'tvdbId' => 'missing',
                'name_de' => 'missing',
                'name_en' => 'missing',
                'name_jpn' => 'missing',
                'list' => 'missing',
                'rank' => 'missing',
                'favorite' => 'missing',
                'seasons' => 'missing'
            ]
        ];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateWrongTypes()
    {
        $testData = [
            [
                'id' => false,
                'tvdbId' => false,
                'name_de' => false,
                'name_en' => false,
                'name_jpn' => false,
                'list' => false,
                'rank' => false,
                'favorite' => 'string',
                'seasons' => false
            ]
        ];
        $expectedErrors = [
            0 => [
                'id' => 'wrong type',
                'tvdbId' => 'wrong type',
                'name_de' => 'wrong type',
                'name_en' => 'wrong type',
                'name_jpn' => 'wrong type',
                'list' => 'wrong type',
                'rank' => 'wrong type',
                'favorite' => 'wrong type',
                'seasons' => 'wrong type'
            ]
        ];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateEmptySeason()
    {
        $testData = [
            [
                'id' => '',
                'tvdbId' => -1,
                'name_de' => '',
                'name_en' => '',
                'name_jpn' => 'japan',
                'list' => 1,
                'rank' => 0,
                'favorite' => false,
                'seasons' => []
            ]
        ];
        $expectedErrors = [];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateWrongSeason()
    {
        $testData = [
            [
                'id' => '',
                'tvdbId' => -1,
                'name_de' => '     ',
                'name_en' => '',
                'name_jpn' => '   ',
                'list' => 1,
                'rank' => 0,
                'favorite' => false,
                'seasons' => [[]]
            ]
        ];
        $expectedErrors = [
            0 => [
                'name' => 'no name given',
                'seasons' => [
                    0 => [
                        'thumbnail' => 'missing',
                        'url' => 'missing',
                        'favorite' => 'missing',
                        'episodes' => 'missing'
                    ]
                ]
            ]
        ];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateWrongEpisode()
    {
        $testData = [
            [
                'id' => '',
                'tvdbId' => -1,
                'name_de' => 'germany',
                'name_en' => 'uk',
                'name_jpn' => '',
                'list' => 1,
                'rank' => 0,
                'favorite' => false,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'favorite' => false,
                        'episodes' => [[]]
                    ]
                ]
            ]
        ];
        $expectedErrors = [
            0 => [
                'seasons' => [
                    0 => [
                        'episodes' => [
                            0 => [
                                'name' => 'missing',
                                'url' => 'missing',
                                'favorite' => 'missing',
                                'watched' => 'missing'
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateOneCorrectOneWrong()
    {
        $testData = [
            [
                'id' => '',
                'tvdbId' => -1,
                'name_de' => '',
                'name_en' => 'uk',
                'name_jpn' => '',
                'list' => 1,
                'rank' => 0,
                'favorite' => false,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'favorite' => false,
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ]
                        ]
                    ]
                ]
            ],
            [
                'id' => false,
                'tvdbId' => false,
                'list' => false,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'favorite' => false,
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ]
                        ]
                    ],
                    [
                        'thumbnail' => false,
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ],
                            [
                                'favorite' => 'false',
                                'watched' => 'false'
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $expectedErrors = [
            1 => [
                'id' => 'wrong type',
                'tvdbId' => 'wrong type',
                'name_de' => 'missing',
                'name_en' => 'missing',
                'name_jpn' => 'missing',
                'list' => 'wrong type',
                'rank' => 'missing',
                'favorite' => 'missing',
                'seasons' => [
                    1 => [
                        'thumbnail' => 'wrong type',
                        'url' => 'missing',
                        'favorite' => 'missing',
                        'episodes' => [
                            1 => [
                                'name' => 'missing',
                                'url' => 'missing',
                                'favorite' => 'wrong type',
                                'watched' => 'wrong type',
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateTwoCorrectElements()
    {
        $testData = [
            [
                'id' => '',
                'tvdbId' => -1,
                'name_de' => '',
                'name_en' => 'uk',
                'name_jpn' => '',
                'list' => 1,
                'rank' => 0,
                'favorite' => false,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'favorite' => false,
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ]
                        ]
                    ],
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'favorite' => false,
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ]
                        ]
                    ]
                ]
            ],
            [
                'id' => '',
                'tvdbId' => -1,
                'name_de' => 'de',
                'name_en' => '',
                'name_jpn' => 'japan',
                'list' => 1,
                'rank' => 0,
                'favorite' => false,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'favorite' => false,
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ]
                        ]
                    ],
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'favorite' => false,
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'favorite' => false,
                                'watched' => true,
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $expectedErrors = [];
        $errors = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }
}
