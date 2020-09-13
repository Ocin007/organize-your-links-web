<?php


namespace OrganizeYourLinks\Types;


interface SeriesInterface extends ObjectInterface
{
    const KEY_ID = 'id';
    const KEY_TVDB_ID = 'tvdbId';
    const KEY_NAME_DE = 'name_de';
    const KEY_NAME_EN = 'name_en';
    const KEY_NAME_JPN = 'name_jpn';
    const KEY_LIST = 'list';
    const KEY_RANK = 'rank';
    const KEY_FAVORITE = 'favorite';
    const KEY_SEASONS = 'seasons';

    const KEYS = ['id', 'tvdbId', 'name_de', 'name_en', 'name_jpn', 'list', 'rank', 'favorite'];

    public function addSeason(SeasonInterface $season): self;

    /**
     * @return SeasonInterface[]
     */
    public function getSeasons(): array;
}