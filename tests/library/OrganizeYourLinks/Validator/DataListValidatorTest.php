<?php

namespace OrganizeYourLinks\Validator;

use PHPUnit\Framework\TestCase;

class DataListValidatorTest extends TestCase
{
    public function testValidateEmpty()
    {
        $testData = [];
        $expectedErrors = [];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateTwoEmptyMembers()
    {
        $testData = [[], []];
        $expectedErrors = [
            0 => [
                'id' => 'missing',
                'name' => 'missing',
                'list' => 'missing',
                'seasons' => 'missing'
            ],
            1 => [
                'id' => 'missing',
                'name' => 'missing',
                'list' => 'missing',
                'seasons' => 'missing'
            ]
        ];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateWrongTypes()
    {
        $testData = [
            [
                'id' => false,
                'name' => false,
                'list' => false,
                'seasons' => false
            ]
        ];
        $expectedErrors = [
            0 => [
                'id' => 'wrong type',
                'name' => 'wrong type',
                'list' => 'wrong type',
                'seasons' => 'wrong type'
            ]
        ];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateEmptySeason()
    {
        $testData = [
            [
                'id' => '',
                'name' => '',
                'list' => 1,
                'seasons' => []
            ]
        ];
        $expectedErrors = [];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateWrongSeason()
    {
        $testData = [
            [
                'id' => '',
                'name' => '',
                'list' => 1,
                'seasons' => [[]]
            ]
        ];
        $expectedErrors = [
            0 => [
                'seasons' => [
                    0 => [
                        'thumbnail' => 'missing',
                        'url' => 'missing',
                        'episodes' => 'missing'
                    ]
                ]
            ]
        ];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateWrongEpisode()
    {
        $testData = [
            [
                'id' => '',
                'name' => '',
                'list' => 1,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
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
                                'watched' => 'missing'
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateOneCorrectOneWrong()
    {
        $testData = [
            [
                'id' => '',
                'name' => '',
                'list' => 1,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ]
                        ]
                    ]
                ]
            ],
            [
                'id' => false,
                'list' => false,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
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
                                'watched' => true,
                            ],
                            [
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
                'name' => 'missing',
                'list' => 'wrong type',
                'seasons' => [
                    1 => [
                        'thumbnail' => 'wrong type',
                        'url' => 'missing',
                        'episodes' => [
                            1 => [
                                'name' => 'missing',
                                'url' => 'missing',
                                'watched' => 'wrong type',
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateTwoCorrectElements()
    {
        $testData = [
            [
                'id' => '',
                'name' => '',
                'list' => 1,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ]
                        ]
                    ],
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ]
                        ]
                    ]
                ]
            ],
            [
                'id' => '',
                'name' => '',
                'list' => 1,
                'seasons' => [
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ]
                        ]
                    ],
                    [
                        'thumbnail' => '',
                        'url' => '',
                        'episodes' => [
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ],
                            [
                                'name' => '',
                                'url' => '',
                                'watched' => true,
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $expectedErrors = [];
        $subject = new DataListValidator();
        $errors = $subject->validate($testData);
        $this->assertEquals($expectedErrors, $errors);
    }
}
