<?php

namespace OrganizeYourLinks\Manager;

use Mockery;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Types\ErrorList;
use PHPUnit\Framework\TestCase;

class SettingsManagerTest extends TestCase
{
    private $sourceMock;
    private $errorListMock;
    private SettingsManager $subject;
    private $newErrorListMock;
    private array $defaultSettings;

    public function setUp(): void
    {
        $this->defaultSettings = [
            'startPage' => "edit-series-page",
            'initialDataId' => "",
            'animationSpeedSingle' => 0.05,
            'animationSpeedMulti' => 0.1,
            'minSizeOfPlaylist' => 10,
            'colorBrightness' => 255,
            'titleLanguage' => "name_de",
            'episodeCount' => false,
            'notification' => [
                'success' => [
                    'visible' => true,
                    'autoClose' => true,
                    'interval' => 5000,
                ],
                'debug' => [
                    'visible' => false,
                    'autoClose' => false,
                    'interval' => 5000,
                ],
                'info' => [
                    'visible' => true,
                    'autoClose' => false,
                    'interval' => 5000,
                ],
                'warn' => [
                    'visible' => true,
                    'autoClose' => false,
                    'interval' => 5000,
                ],
                'error' => [
                    'visible' => true,
                    'autoClose' => false,
                    'interval' => 5000,
                ],
            ],
        ];
        $this->sourceMock = Mockery::mock(DataSourceInterface::class);
        $this->errorListMock = Mockery::mock(ErrorList::class);
        $this->newErrorListMock = Mockery::mock(ErrorList::class);
        $this->subject = new SettingsManager($this->sourceMock, $this->errorListMock);
    }

    public function testLoadSettings()
    {
        $this->sourceMock
            ->shouldReceive('loadSettings')
            ->andReturn(['setting' => 'test']);
        $this->subject->loadSettings();
        $settings = $this->subject->getSettings();
        $this->assertEquals(['setting' => 'test'], $settings);
    }

    public function testLoadSettingsNull()
    {
        $this->sourceMock
            ->shouldReceive('loadSettings')
            ->andReturn(null);
        $this->sourceMock
            ->shouldReceive('saveSettings')
            ->with($this->defaultSettings)
            ->andReturn($this->newErrorListMock);
        $this->newErrorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(true);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorListMock);
        $this->subject->loadSettings();
        $settings = $this->subject->getSettings();
        $this->assertEquals($this->defaultSettings, $settings);
    }

    public function testLoadSettingsNullCannotSaveDefault()
    {
        $this->sourceMock
            ->shouldReceive('loadSettings')
            ->andReturn(null);
        $this->sourceMock
            ->shouldReceive('saveSettings')
            ->with($this->defaultSettings)
            ->andReturn($this->newErrorListMock);
        $this->newErrorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->errorListMock
            ->shouldReceive('add')
            ->with(Mockery::any());
        $this->subject->loadSettings();
        $settings = $this->subject->getSettings();
        $this->assertEquals([], $settings);
    }

    public function testGetSet()
    {
        $this->subject->setSettings(['setting' => 'test']);
        $this->subject->setAttribute('setting2', 5);
        $this->assertEquals(5, $this->subject->getAttribute('setting2'));
        $settings = $this->subject->getSettings();
        $this->assertEquals([
            'setting' => 'test',
            'setting2' => 5
        ], $settings);
    }

    public function testSaveSettings()
    {
        $settings = [
            'key' => 'value'
        ];
        $this->sourceMock
            ->shouldReceive('saveSettings')
            ->with($settings)
            ->andReturn($this->newErrorListMock);
        $this->errorListMock
            ->shouldReceive('add')
            ->with($this->newErrorListMock);
        $this->subject->setSettings($settings);
        $this->subject->saveSettings();

        //nothing to test
        $this->assertTrue(true);
    }

    public function testGetErrorList()
    {
        $this->assertEquals($this->errorListMock, $this->subject->getErrorList());
    }

    public function testAddToErrorList()
    {
        $this->assertFalse($this->subject->addToErrorList(''));
        $this->errorListMock
            ->shouldReceive('add')
            ->once()
            ->with($this->newErrorListMock);
        $this->assertTrue($this->subject->addToErrorList($this->newErrorListMock));
    }

    public function testNoErrors()
    {
        $this->errorListMock
            ->shouldReceive('isEmpty')
            ->andReturn(false);
        $this->assertFalse($this->subject->noErrors());
    }
}
