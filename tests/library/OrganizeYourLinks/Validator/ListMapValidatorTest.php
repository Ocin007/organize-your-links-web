<?php

namespace OrganizeYourLinks\Validator;

use PHPUnit\Framework\TestCase;

class ListMapValidatorTest extends TestCase
{
    private $mapFile;
    private $map;

    private $subjectPut;
    private $subjectUpdate;
    private $subjectDelete;

    public function setUp(): void
    {
        $this->mapFile = __DIR__.'/../../../fixtures/list-map.json';
        $this->map = json_decode(file_get_contents($this->mapFile), true);
        $this->subjectPut = new ListMapValidator(Mode::PUT, $this->map);
        $this->subjectUpdate = new ListMapValidator(Mode::UPDATE, $this->map);
        $this->subjectDelete = new ListMapValidator(Mode::DELETE, $this->map);
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
        $errors = $this->subjectPut->validate($data);
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
        $errors = $this->subjectPut->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateUpdateWrong()
    {
        $data = [
            'initialDataId' => 'id40'
        ];
        $expectedErrors = [
            'id' => 'unknown initialDataId'
        ];
        $errors = $this->subjectUpdate->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateUpdateCorrect()
    {
        $data = [
            'initialDataId' => 'id2'
        ];
        $expectedErrors = [];
        $errors = $this->subjectUpdate->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateDeleteWrong()
    {
        $data = ['id40'];
        $expectedErrors = [
            'id' => ['id40']
        ];
        $errors = $this->subjectDelete->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateDeleteCorrect()
    {
        $data = ['id2'];
        $expectedErrors = [];
        $errors = $this->subjectDelete->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }
}
