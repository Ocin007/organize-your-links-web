<?php


namespace OrganizeYourLinks\Types;


class Episode extends AbstractObject implements EpisodeInterface
{
    private string $name;
    private string $url;
    private bool $favorite;
    private bool $watched;

    public function getKeys(): array
    {
        return self::KEYS;
    }
}