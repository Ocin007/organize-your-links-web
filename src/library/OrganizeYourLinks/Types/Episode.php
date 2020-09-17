<?php


namespace OrganizeYourLinks\Types;


class Episode extends AbstractObject implements EpisodeInterface
{
    protected string $name = '';
    protected string $url = '';
    protected bool $favorite = false;
    protected bool $watched = false;

    public function getKeys(): array
    {
        return self::KEYS;
    }
}