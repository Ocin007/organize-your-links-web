<?php


namespace OrganizeYourLinks\Api;


use OrganizeYourLinks\Types\Converter\ConverterInterface;
use OrganizeYourLinks\Types\SeriesInterface;

class Request
{
    const KEY_SERIES_LIST = 'seriesList';
    const KEY_ROUTE_TVDB_ID = 'tvdbId';
    const KEY_SEARCH_STRING = 'searchStr';

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

    public function convert(ConverterInterface $converter): void
    {
        $seriesList = $this->convertSeriesList($this->bodyConverted[self::KEY_SERIES_LIST], $converter);
        $this->bodyConverted[self::KEY_SERIES_LIST] = $seriesList;
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

    /**
     * @param array $seriesDataList
     * @param ConverterInterface $converter
     * @return SeriesInterface[]
     */
    private function convertSeriesList(array $seriesDataList, ConverterInterface $converter): array
    {
        $seriesList = [];
        foreach ($seriesDataList as $seriesData) {
            $seriesList[] = $converter->convertToObject($seriesData);
        }
        return $seriesList;
    }
}