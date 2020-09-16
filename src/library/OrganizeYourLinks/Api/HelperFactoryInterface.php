<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\DataSource\Filesystem\FileManager;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Manager\SettingsManager;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\Converter\ConverterInterface;
use OrganizeYourLinks\Validator\ValidatorInterface;

interface HelperFactoryInterface
{

    public function getSeriesManager(): SeriesManager;

    public function getSorter(): SorterInterface;

    public function getFileManager(): FileManager;

    public function getSeriesConverter(): ConverterInterface;

    public function getDataIsSeriesValidator(): ValidatorInterface;

    public function getDataSource(): DataSourceInterface;

    public function getSettingsManager(): SettingsManager;

    public function getSettingsValidator(): ValidatorInterface;
}