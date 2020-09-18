<?php


namespace OrganizeYourLinks\Manager;


use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Filter\FilterInterface;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\Converter\ConverterInterface;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\SeriesInterface;

class SeriesManager implements ErrorListContainerInterface
{
    private DataSourceInterface $source;
    private ErrorListInterface $errorList;
    private ConverterInterface $converter;

    public function __construct(
        DataSourceInterface $source,
        ErrorListInterface $errorList,
        ConverterInterface $converter
    )
    {
        $this->source = $source;
        $this->errorList = $errorList;
        $this->converter = $converter;
    }

    public function noErrors(): bool
    {
        return $this->errorList->isEmpty();
    }

    public function getErrorList(): ErrorListInterface
    {
        return $this->errorList;
    }

    public function addToErrorList($list): bool
    {
        if ($list instanceof ErrorListInterface) {
            $this->errorList->add($list);
            return true;
        }
        return false;
    }

    /**
     * @param FilterInterface|null $filter
     * @param SorterInterface|null $sorter
     * @return SeriesInterface[]|null
     */
    public function getAll(?FilterInterface $filter = null, ?SorterInterface $sorter = null): ?array
    {
        $dataList = $this->source->loadAllSeries($filter, $sorter);
        if ($this->addToErrorList($dataList)) {
            return null;
        }
        $result = [];
        foreach ($dataList as $item) {
            $result[] = $this->converter->convertToObject($item);
        }
        return $result;
    }

    /**
     * @param SeriesInterface[] $seriesList
     * @return array
     */
    public function updateSeriesMulti(array $seriesList): array
    {
        $idList = [];
        foreach ($seriesList as $series) {
            $seriesData = $this->converter->convertToNative($series);
            $errorList = $this->source->saveSeries($seriesData);
            if ($errorList->isEmpty()) {
                $idList[] = $series->get(SeriesInterface::KEY_ID);
            } else {
                $this->errorList->add($errorList);
            }
        }
        return $idList;
    }

    /**
     * @param SeriesInterface[] $seriesList
     */
    public function createSeriesMulti(array $seriesList): void
    {
        foreach ($seriesList as $series) {
            do {
                $id = uniqid('', true);
            } while ($this->source->seriesExist($id));
            $series->set(SeriesInterface::KEY_ID, $id);
            $seriesData = $series->getAll();
            $seriesData[SeriesInterface::KEY_SEASONS] = [];
            $this->errorList->add($this->source->createSeries($id, $seriesData));
        }
    }

    public function deleteSeriesMulti(array $idList): void
    {
        foreach ($idList as $id) {
            $this->errorList->add($this->source->deleteSeries($id));
        }
    }
}