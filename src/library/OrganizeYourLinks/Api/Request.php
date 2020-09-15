<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\Manager\SeriesManager;

class Request
{
    private const KEY_SERIES_LIST = 'seriesList';

    private array $args = [];
    private array $bodyRaw;
    private array $bodyConverted;

    public function getRawParam(string $key)
    {
        return $this->bodyRaw[$key];
    }

    public function getConvertedParam(string $key)
    {
        return $this->bodyConverted[$key];
    }

    public function getRawBody(): array
    {
        return $this->bodyRaw;
    }

    public function setRawBody(string $json): void
    {
        $this->bodyRaw = json_decode($json, true);
    }

    public function getConvertedBody(): array
    {
        return $this->bodyConverted;
    }

    public function setConvertedBody(string $json): self
    {
        $this->bodyConverted = json_decode($json, true);
        return $this;
    }

    public function convert(SeriesManager $manager): void
    {
        $this->findKeyRecursive($this->bodyConverted, self::KEY_SERIES_LIST, $manager);
    }

    public function getRouteParam(string $key)
    {
        return $this->args[$key];
    }

    public function setRouteParams(array $args): void
    {
        $this->args = $args;
    }

    public function getTypeOf(string $key)
    {

    }

    private function findKeyRecursive(array &$data, string $searchKey, SeriesManager $manager)
    {
        foreach ($data as $key => $value) {
            if($key === $searchKey && gettype($value) === 'array') {
                $data[$key] = $this->convertSeriesList($value, $manager);
            }
            if($key !== $searchKey && gettype($value) === 'array') {
                $this->findKeyRecursive($value, $searchKey, $manager);
                $data[$key] = $value;
            }
        }
    }

    private function convertSeriesList(array $seriesDataList, SeriesManager $manager): array
    {
        $seriesList = [];
        foreach ($seriesDataList as $seriesData) {
            $seriesList[] = $manager->createSeriesObj($seriesData);
        }
        return $seriesList;
    }
}