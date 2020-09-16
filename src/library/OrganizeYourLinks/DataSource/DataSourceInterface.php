<?php


namespace OrganizeYourLinks\DataSource;


use OrganizeYourLinks\Filter\FilterInterface;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\ErrorListInterface;

interface DataSourceInterface
{
    public function loadSettings(): ?array;

    public function saveSettings(array $settings): ErrorListInterface;

    /**
     * @param FilterInterface|null $filter
     * @param SorterInterface|null $sorter
     * @return ErrorListInterface|array
     */
    public function loadAllSeries(?FilterInterface $filter, ?SorterInterface $sorter);

    public function seriesExist(string $id): bool;

    public function saveSeries(array $series): ErrorListInterface;

    public function createSeries(string $id, array $series): ErrorListInterface;

    public function deleteSeries(string $id): ErrorListInterface;

    /**
     * @return ErrorListInterface|string
     */
    public function loadTvdbApiKeyAsJSON(): string;

    public function isTvdbApiTokenValid(): bool;

    /**
     * @return ErrorListInterface|string
     */
    public function loadTvdbApiToken(): string;

    public function getCaFilePath(): string;

    public function saveTvdbApiToken(string $token): ErrorListInterface;

    public function checkSeriesNames(array $series): ErrorListInterface;
}