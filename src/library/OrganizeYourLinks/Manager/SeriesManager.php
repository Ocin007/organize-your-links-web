<?php


namespace OrganizeYourLinks\Manager;


use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Filter\FilterInterface;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\Episode;
use OrganizeYourLinks\Types\EpisodeInterface;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\Season;
use OrganizeYourLinks\Types\SeasonInterface;
use OrganizeYourLinks\Types\Series;
use OrganizeYourLinks\Types\SeriesInterface;

class SeriesManager implements ErrorListContainerInterface
{
    private DataSourceInterface $source;
    private ErrorListInterface $errorList;

    public function __construct(DataSourceInterface $source, ErrorListInterface $errorList) {
        $this->source = $source;
        $this->errorList = $errorList;
    }

    public function noErrors(): bool
    {
        return $this->errorList->isEmpty();
    }

    public function getErrorList(): ErrorListInterface
    {
        return $this->errorList;
    }

    /**
     * @param FilterInterface|null $filter
     * @param SorterInterface|null $sorter
     * @return SeriesInterface[]|null
     */
    public function getAll(?FilterInterface $filter, ?SorterInterface $sorter): ?array
    {
        $dataList = $this->source->loadAllSeries($filter, $sorter);
        if($dataList instanceof ErrorListInterface) {
            $this->errorList->add($dataList);
            return null;
        }
        $result = [];
        foreach ($dataList as $item) {
            $result[] = $this->createSeriesObj($item);
        }
        return $result;
    }

    /**
     * @param SeriesInterface[] $seriesList
     */
    public function updateSeriesMulti(array $seriesList): void
    {
        foreach ($seriesList as $series) {
            $seriesData = $series->getAll();
            $seriesData[SeriesInterface::KEY_SEASONS] = $this->getSeasonData($series->getSeasons());
            $this->errorList->add($this->source->saveSeries($seriesData));
        }
    }

    /**
     * @param SeriesInterface[] $seriesList
     */
    public function createSeriesMulti(array $seriesList): void
    {
        foreach ($seriesList as $series) {
            do {
                $id = uniqid('', true);
            } while($this->source->seriesExist($id));
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

    private function createSeriesObj(array $data): SeriesInterface
    {
        $series = new Series();
        $series->setAll($data);
        foreach ($data[Series::KEY_SEASONS] as $item) {
            $series->addSeason($this->createSeasonObj($item));
        }
        return $series;
    }

    private function createSeasonObj(array $data): SeasonInterface
    {
        $season = new Season();
        $season->setAll($data);
        foreach ($data[Season::KEY_EPISODES] as $item) {
            $episode = new Episode();
            $season->addEpisode($episode->setAll($item));
        }
        return $season;
    }

    /**
     * @param SeasonInterface[] $seasons
     * @return array
     */
    private function getSeasonData(array $seasons): array
    {
        $seasonData = [];
        foreach ($seasons as $i => $season) {
            $seasonData[$i] = $season->getAll();
            $seasonData[$i][SeasonInterface::KEY_EPISODES] = $this->getEpisodeData($season->getEpisodes());
        }
        return $seasonData;
    }

    /**
     * @param EpisodeInterface[] $episodes
     * @return array
     */
    private function getEpisodeData(array $episodes): array
    {
        $episodeData = [];
        foreach ($episodes as $episode) {
            $episodeData[] = $episode->getAll();
        }
        return $episodeData;
    }
}