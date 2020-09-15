<?php


namespace OrganizeYourLinks\Types;


interface ErrorListInterface
{
    const CANNOT_CREATE_NEW_SERIES = 'cannot create new series';
    const CANNOT_DELETE_SERIES = 'cannot delete series';
    const CANNOT_LOAD_ALL_SERIES = 'cannot load all series';
    const CANNOT_LOAD_SERIES = 'cannot load series';
    const CANNOT_LOAD_TVDB_API_KEY = 'cannot load tvdb api key';
    const CANNOT_LOAD_TVDB_API_TOKEN = 'cannot load tvdb api token';
    const CANNOT_READ_ID_FILE_MAP = 'cannot read id-file-map file';
    const CANNOT_SAVE_ID_FILE_MAP = 'cannot save id-file-map file';
    const CANNOT_SAVE_SERIES = 'cannot save series';
    const CANNOT_SAVE_SERIES_NOT_EXIST = 'cannot save series, does not exist';
    const CANNOT_SAVE_SETTINGS = 'cannot save settings';
    const CANNOT_SAVE_TVDB_API_TOKEN = 'cannot save tvdb api token';
    const DATA_DIR_NOT_WRITABLE = 'data directory not writable';

    public function getErrorList(): array;
    public function isEmpty(): bool;
    public function add($errorMsg): self;
}