<?php

namespace OrganizeYourLinks\Validator;


use OrganizeYourLinks\Types\EpisodeInterface;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\SeasonInterface;
use OrganizeYourLinks\Types\SeriesInterface;

class DataIsSeriesValidator implements ValidatorInterface {

    private array $keysTypeMapElement = [
        SeriesInterface::KEY_ID => 'string',
        SeriesInterface::KEY_TVDB_ID => 'integer',
        SeriesInterface::KEY_LIST => 'integer',
        SeriesInterface::KEY_RANK => 'integer',
        SeriesInterface::KEY_FAVORITE => 'boolean',
        SeriesInterface::KEY_SEASONS => 'array',
    ];
    private array $nameKeys = [
        SeriesInterface::KEY_NAME_DE,
        SeriesInterface::KEY_NAME_EN,
        SeriesInterface::KEY_NAME_JPN
    ];
    private array $keysTypeMapSeason = [
        SeasonInterface::KEY_THUMBNAIL => 'string',
        SeasonInterface::KEY_URL => 'string',
        SeasonInterface::KEY_FAVORITE => 'boolean',
        SeasonInterface::KEY_EPISODES => 'array',
    ];
    private array $keysTypeMapEpisode = [
        EpisodeInterface::KEY_NAME => 'string',
        EpisodeInterface::KEY_URL => 'string',
        EpisodeInterface::KEY_FAVORITE => 'boolean',
        EpisodeInterface::KEY_WATCHED => 'boolean',
    ];

    function validate(array $dataList): ErrorListInterface {
        $errorList = new ErrorList();
        foreach ($dataList as $index => $data) {
            $noError = $this->checkElement($data);
            if(!$noError) {
                $errorList->add(ErrorList::LIST_ELEMENT_NO_VALID_SERIES . ': ' . $index);
            }
        }
        return $errorList;
    }

    private function checkElement(array $data) : bool {
        $noError = true;
        foreach ($this->keysTypeMapElement as $key => $type) {
            $noError &= $this->checkForKeyAndType($data, $key, $type);
        }
        $noError &= $this->checkTitle($data);
        if($noError) {
            $noError &= $this->validateSeasons($data[SeriesInterface::KEY_SEASONS]);
        }
        return $noError;
    }

    private function checkForKeyAndType(array $data, string $key, string $type): bool {
        return isset($data[$key]) && gettype($data[$key]) === $type;
    }

    private function validateSeasons(array $seasons) : bool {
        $noError = true;
        foreach($seasons as $index => $season) {
            $noError &= $this->validateSeason($season);
        }
        return $noError;
    }

    private function validateSeason(array $season) : bool {
        $noError = true;
        foreach ($this->keysTypeMapSeason as $key => $type) {
            $noError &= $this->checkForKeyAndType($season, $key, $type);
        }
        if($noError) {
            $noError &= $this->validateEpisodes($season[SeasonInterface::KEY_EPISODES]);
        }
        return $noError;
    }

    private function validateEpisodes(array $episodes) : bool {
        $noError = true;
        foreach($episodes as $index => $episode) {
            $noError &= $this->validateEpisode($episode);
        }
        return $noError;
    }

    private function validateEpisode(array $episode) : bool {
        $noError = true;
        foreach ($this->keysTypeMapEpisode as $key => $type) {
            $noError &= $this->checkForKeyAndType($episode, $key, $type);
        }
        return $noError;
    }

    private function checkTitle(array $data) : bool {
        $noError = true;
        $allNamesOnlyWhitespace = true;
        foreach ($this->nameKeys as $nameKey) {
            $noError &= $this->checkForKeyAndType($data, $nameKey, 'string');
            $allNamesOnlyWhitespace &= $this->stringHasOnlyWhiteSpace($data[$nameKey]);
        }
        return $noError && !$allNamesOnlyWhitespace;
    }

    private function stringHasOnlyWhiteSpace(?string $str) : bool {
        $strArray = str_split($str, 1);
        foreach($strArray as $char) {
            if($char !== ' ' && $char !== '') {
                return false;
            }
        }
        return true;
    }
}