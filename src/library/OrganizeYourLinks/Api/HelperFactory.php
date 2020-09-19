<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\DataSource\Filesystem\FileManager;
use OrganizeYourLinks\DataSource\Filesystem\Reader;
use OrganizeYourLinks\DataSource\Filesystem\Writer;
use OrganizeYourLinks\ExternalApi\TvdbApi;
use OrganizeYourLinks\Generator\FileNameGenerator;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Manager\SettingsManager;
use OrganizeYourLinks\Sorter\Sorter;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\Converter\ConverterInterface;
use OrganizeYourLinks\Types\Converter\SeriesConverter;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Validator\DataIsSeriesValidator;
use OrganizeYourLinks\Validator\SettingsValidator;
use OrganizeYourLinks\Validator\ValidatorInterface;

class HelperFactory implements HelperFactoryInterface
{
    public function getSeriesManager(): SeriesManager
    {
        $source = $this->getDataSource();
        $errorList = new ErrorList();
        $converter = new SeriesConverter();
        return new SeriesManager($source, $errorList, $converter);
    }

    public function getSorter(): SorterInterface
    {
        $settingsManager = $this->getSettingsManager();
        $settingsManager->loadSettings();
        return new Sorter($settingsManager->getSettings());
    }

    public function getFileManager(): FileManager
    {
        $reader = new Reader();
        $writer = new Writer();
        $generator = new FileNameGenerator();
        return new FileManager($reader, $writer, $generator);
    }

    public function getSeriesConverter(): ConverterInterface
    {
        return new SeriesConverter();
    }

    public function getDataIsSeriesValidator(): ValidatorInterface
    {
        return new DataIsSeriesValidator();
    }

    public function getDataSource(): DataSourceInterface
    {
        return $this->getFileManager();
    }

    public function getSettingsManager(): SettingsManager
    {
        $source = $this->getDataSource();
        $errorList = new ErrorList();
        return new SettingsManager($source, $errorList);
    }

    public function getSettingsValidator(): ValidatorInterface
    {
        return new SettingsValidator();
    }

    public function getTvdbApiManager(): TvdbApi
    {
        $source = $this->getDataSource();
        $errorList = new ErrorList();
        return new TvdbApi($source, $errorList);
    }
}