<?php

namespace OrganizeYourLinks\Types;

interface Setting
{
    const KEY_INITIAL_DATA_ID = 'initialDataId';
    const KEY_TITLE_LANGUAGE = 'titleLanguage';

    const KEY_TYPE_MAP = [
        'startPage' => 'string',
        self::KEY_INITIAL_DATA_ID => 'string',
        'animationSpeedSingle' => 'double',
        'animationSpeedMulti' => 'double',
        'minSizeOfPlaylist' => 'integer',
        'colorBrightness' => 'integer',
        self::KEY_TITLE_LANGUAGE => 'string',
        'episodeCount' => 'boolean',

        'notification' => [
            'success' => [
                'visible' => 'boolean',
                'autoClose' => 'boolean',
                'interval' => 'integer',
            ],
            'debug' => [
                'visible' => 'boolean',
                'autoClose' => 'boolean',
                'interval' => 'integer',
            ],
            'info' => [
                'visible' => 'boolean',
                'autoClose' => 'boolean',
                'interval' => 'integer',
            ],
            'warn' => [
                'visible' => 'boolean',
                'autoClose' => 'boolean',
                'interval' => 'integer',
            ],
            'error' => [
                'visible' => 'boolean',
                'autoClose' => 'boolean',
                'interval' => 'integer',
            ],
        ],
    ];

    const DEFAULT = [
        'startPage' => "edit-series-page",
        self::KEY_INITIAL_DATA_ID => "",
        'animationSpeedSingle' => 0.05,
        'animationSpeedMulti' => 0.1,
        'minSizeOfPlaylist' => 10,
        'colorBrightness' => 255,
        self::KEY_TITLE_LANGUAGE => "name_de",
        'episodeCount' => false,

        'notification' => [
            'success' => [
                'visible' => true,
                'autoClose' => true,
                'interval' => 5000,
            ],
            'debug' => [
                'visible' => false,
                'autoClose' => false,
                'interval' => 5000,
            ],
            'info' => [
                'visible' => true,
                'autoClose' => false,
                'interval' => 5000,
            ],
            'warn' => [
                'visible' => true,
                'autoClose' => false,
                'interval' => 5000,
            ],
            'error' => [
                'visible' => true,
                'autoClose' => false,
                'interval' => 5000,
            ],
        ],
    ];
}