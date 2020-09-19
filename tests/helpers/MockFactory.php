<?php


namespace OrganizeYourLinks\Api;


use Mockery;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\DataSource\Filesystem\FileManager;
use OrganizeYourLinks\ExternalApi\TvdbApi;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Manager\SettingsManager;
use OrganizeYourLinks\Sorter\Sorter;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\Converter\ConverterInterface;
use OrganizeYourLinks\Types\Converter\SeriesConverter;
use OrganizeYourLinks\Validator\DataIsSeriesValidator;
use OrganizeYourLinks\Validator\SettingsValidator;
use OrganizeYourLinks\Validator\ValidatorInterface;

class MockFactory implements HelperFactoryInterface
{
    public $seriesManager;
    public $sorter;
    public $fileManager;
    public $converter;
    public $dataIsSeriesValidator;
    public $source;
    public $settingsManager;
    public $settingsValidator;
    public $tvdbApi;

    public function __construct()
    {
        $this->seriesManager = Mockery::mock(SeriesManager::class);
        $this->sorter = Mockery::mock(Sorter::class);
        $this->fileManager = Mockery::mock(FileManager::class);
        $this->converter = Mockery::mock(SeriesConverter::class);
        $this->dataIsSeriesValidator = Mockery::mock(DataIsSeriesValidator::class);
        $this->source = Mockery::mock(DataSourceInterface::class);
        $this->settingsManager = Mockery::mock(SettingsManager::class);
        $this->settingsValidator = Mockery::mock(SettingsValidator::class);
        $this->tvdbApi = Mockery::mock(TvdbApi::class);
    }

    public function getSeriesManager(): SeriesManager
    {
        return $this->seriesManager;
    }

    public function getSorter(): SorterInterface
    {
        return $this->sorter;
    }

    public function getFileManager(): FileManager
    {
        return $this->fileManager;
    }

    public function getSeriesConverter(): ConverterInterface
    {
        return $this->converter;
    }

    public function getDataIsSeriesValidator(): ValidatorInterface
    {
        return $this->dataIsSeriesValidator;
    }

    public function getDataSource(): DataSourceInterface
    {
        return $this->source;
    }

    public function getSettingsManager(): SettingsManager
    {
        return $this->settingsManager;
    }

    public function getSettingsValidator(): ValidatorInterface
    {
        return $this->settingsValidator;
    }

    public function getTvdbApiManager(): TvdbApi
    {
        return $this->tvdbApi;
    }
}