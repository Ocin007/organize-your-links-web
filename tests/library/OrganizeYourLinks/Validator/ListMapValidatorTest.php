<?php

namespace OrganizeYourLinks\Validator;

use PHPUnit\Framework\TestCase;

class ListMapValidatorTest extends TestCase
{
    private $mapFile = __DIR__.'/../../../fixtures/list-map.json';
    private $map;

    function __construct(string $name = null, array $data = [], string $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
        $this->map = json_decode(file_get_contents($this->mapFile), true);
    }

    public function testValidatePutWrong()
    {
        $data = [
            ['id' => 'id10'],
            ['id' => 'id20'],
            ['id' => 'id30'],
            ['id' => 'id40']
        ];
        $expectedErrors = [
            'id' => ['id10', 'id20', 'id30', 'id40']
        ];
        $subject = new ListMapValidator(Mode::PUT, $this->map);
        $errors = $subject->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidatePutCorrect()
    {
        $data = [
            ['id' => 'id1'],
            ['id' => 'id2'],
            ['id' => 'id3'],
            ['id' => 'id4']
        ];
        $expectedErrors = [];
        $subject = new ListMapValidator(Mode::PUT, $this->map);
        $errors = $subject->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }
}
