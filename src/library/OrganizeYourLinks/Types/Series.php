<?php


namespace OrganizeYourLinks\Types;


class Series extends AbstractObject implements SeriesInterface
{
    protected string $id = '';
    protected int $tvdbId = -1;
    protected string $name_de = '';
    protected string $name_en = '';
    protected string $name_jpn = '';
    protected int $list = 3;
    protected int $rank = 0;
    protected bool $favorite = false;

    /**
     * @var SeasonInterface[]
     */
    protected array $seasons = [];

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