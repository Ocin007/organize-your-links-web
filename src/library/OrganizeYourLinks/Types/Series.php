<?php


namespace OrganizeYourLinks\Types;


class Series extends AbstractObject implements SeriesInterface
{
    private string $id;
    private int $tvdbId;
    private string $name_de;
    private string $name_en;
    private string $name_jpn;
    private int $list;
    private int $rank;
    private bool $favorite;

    /**
     * @var SeasonInterface[]
     */
    private array $seasons;

    public function getKeys(): array
    {
        return self::KEYS;
    }

    public function addSeason(SeasonInterface $season): self
    {
        $this->seasons[] = $season;
        return $this;
    }

    /**
     * @return SeasonInterface[]
     */
    public function getSeasons(): array
    {
        return $this->seasons;
    }
}