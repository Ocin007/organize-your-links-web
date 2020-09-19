<?php

namespace OrganizeYourLinks\Validator;

use PHPUnit\Framework\TestCase;

class DataIsSeriesValidatorTest extends TestCase
{
    const TEST_DIR = __DIR__ . '/../../../fixtures/DataIsSeriesValidatorTest';

    private DataIsSeriesValidator $subject;

    public function setUp(): void
    {
        $this->subject = new DataIsSeriesValidator();
    }

    public function testValidateEmpty()
    {
        $testData = [];
        $expectedErrors = [];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateTwoEmptyMembers()
    {
        $testData = [[], []];
        $expectedErrors = [
            'list element no valid series: 0',
            'list element no valid series: 1'
        ];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateWrongTypes()
    {
        $testData = json_decode(file_get_contents(self::TEST_DIR . '/test1.json'), true);
        $expectedErrors = [
            'list element no valid series: 0'
        ];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateEmptySeason()
    {
        $testData = json_decode(file_get_contents(self::TEST_DIR . '/test2.json'), true);
        $expectedErrors = [];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateWrongSeason()
    {
        $testData = json_decode(file_get_contents(self::TEST_DIR . '/test3.json'), true);
        $expectedErrors = [
            'list element no valid series: 0'
        ];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateWrongEpisode()
    {
        $testData = json_decode(file_get_contents(self::TEST_DIR . '/test4.json'), true);
        $expectedErrors = [
            'list element no valid series: 0'
        ];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateOneCorrectOneWrong()
    {
        $testData = json_decode(file_get_contents(self::TEST_DIR . '/test5.json'), true);
        $expectedErrors = [
            'list element no valid series: 1'
        ];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }

    public function testValidateTwoCorrectElements()
    {
        $testData = json_decode(file_get_contents(self::TEST_DIR . '/test6.json'), true);
        $expectedErrors = [];
        $errorList = $this->subject->validate($testData);
        $this->assertEquals($expectedErrors, $errorList->getErrorList());
    }
}
