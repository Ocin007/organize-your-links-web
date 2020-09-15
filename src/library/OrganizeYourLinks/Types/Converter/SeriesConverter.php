<?php


namespace OrganizeYourLinks\Types\Converter;


use OrganizeYourLinks\Types\Episode;
use OrganizeYourLinks\Types\EpisodeInterface;
use OrganizeYourLinks\Types\Season;
use OrganizeYourLinks\Types\SeasonInterface;
use OrganizeYourLinks\Types\Series;
use OrganizeYourLinks\Types\SeriesInterface;

class SeriesConverter implements ConverterInterface
{
    public function convertToNative($object): array
    {
        $seriesData = $object->getAll();
        $seriesData[SeriesInterface::KEY_SEASONS] = $this->getSeasonData($object->getSeasons());
        return $seriesData;
    }

    public function convertToObject(array $native)
    {
        $series = new Series();
        $series->setAll($native);
        foreach ($native[Series::KEY_SEASONS] as $item) {
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