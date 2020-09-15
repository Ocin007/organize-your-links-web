<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\DataSource\Filesystem\FileManager;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\Converter\ConverterInterface;

interface HelperFactoryInterface
{

    public function getSeriesManager(): SeriesManager;

    public function getSorter(): SorterInterface;

    public function getFileManager(): FileManager;

    public function getSeriesConverter(): ConverterInterface;
}