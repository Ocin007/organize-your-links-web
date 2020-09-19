<?php


namespace OrganizeYourLinks\Types;


interface EpisodeInterface extends ObjectInterface
{
    const KEY_NAME = 'name';
    const KEY_URL = 'url';
    const KEY_FAVORITE = 'favorite';
    const KEY_WATCHED = 'watched';

    const KEYS = ['name', 'url', 'favorite', 'watched'];
}