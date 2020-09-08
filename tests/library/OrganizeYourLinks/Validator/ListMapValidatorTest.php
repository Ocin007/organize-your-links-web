<?php

namespace OrganizeYourLinks\Validator;

use PHPUnit\Framework\TestCase;

class ListMapValidatorTest extends TestCase
{
    private ListMapValidator $subjectPut;
    private ListMapValidator $subjectUpdate;
    private ListMapValidator $subjectDelete;
    private ListMapValidator $subjectWrongMode;

    public function setUp(): void
    {
        $mapFile = __DIR__.'/../../../fixtures/list-map.json';
        $map = json_decode(file_get_contents($mapFile), true);
        $this->subjectWrongMode = new ListMapValidator(-1, $map);
        $this->subjectPut = new ListMapValidator(Mode::PUT, $map);
        $this->subjectUpdate = new ListMapValidator(Mode::UPDATE, $map);
        $this->subjectDelete = new ListMapValidator(Mode::DELETE, $map);
    }

    public function testValidateWrongMode()
    {
        $data = [];
        $expectedErrors = ['mode' => 'invalid'];
        $errors = $this->subjectWrongMode->validate($data);
        $this->assertEquals($expectedErrors, $errors);
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

    public function testValidateUpdateCorrect2()
    {
        $data = [
            'initialDataId' => ''
        ];
        $expectedErrors = [];
        $errors = $this->subjectUpdate->validate($data);
        $this->assertEquals($expectedErrors, $errors);
    }

    public function testValidateDeleteWrong()
    {
        $data = ['id40', 'id41'];
        $expectedErrors = [
            'id' => ['id40', 'id41']
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
