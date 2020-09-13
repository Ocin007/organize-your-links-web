<?php


namespace OrganizeYourLinks\Types;


interface SeasonInterface extends ObjectInterface
{
    const KEY_URL = 'url';
    const KEY_THUMBNAIL = 'thumbnail';
    const KEY_FAVORITE = 'favorite';
    const KEY_EPISODES = 'episodes';

    const KEYS = ['url', 'thumbnail', 'favorite'];

    public function addEpisode(EpisodeInterface $episode): self;

    /**
     * @return EpisodeInterface[]
     */
    public function getEpisodes(): array;
}