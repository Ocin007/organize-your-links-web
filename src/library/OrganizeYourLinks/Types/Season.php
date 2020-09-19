<?php


namespace OrganizeYourLinks\Types;


class Season extends AbstractObject implements SeasonInterface
{
    protected string $url = '';
    protected string $thumbnail = '';
    protected bool $favorite = false;

    /**
     * @var EpisodeInterface[]
     */
    protected array $episodes = [];

    public function getKeys(): array
    {
        return self::KEYS;
    }

    public function addEpisode(EpisodeInterface $episode): self
    {
        $this->episodes[] = $episode;
        return $this;
    }

    /**
     * @return EpisodeInterface[]
     */
    public function getEpisodes(): array
    {
        return $this->episodes;
    }
}