<?php


namespace OrganizeYourLinks\Types;


class Season extends AbstractObject implements SeasonInterface
{
    private string $url;
    private string $thumbnail;
    private bool $favorite;

    /**
     * @var EpisodeInterface[]
     */
    private array $episodes;

    public function getKeys(): array
    {
        return Season::KEYS;
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