<?php

namespace OrganizeYourLinks\Validator;


class DataListValidator implements Validator {

    private array $keysTypeMapElement = [
        'id' => 'string',
        'tvdbId' => 'integer',
        'list' => 'integer',
        'rank' => 'integer',
        'favorite' => 'boolean',
        'seasons' => 'array',
    ];
    private array $nameKeys = [
        'name_de',
        'name_en',
        'name_jpn'
    ];
    private array $keysTypeMapSeason = [
        'thumbnail' => 'string',
        'url' => 'string',
        'favorite' => 'boolean',
        'episodes' => 'array',
    ];
    private array $keysTypeMapEpisode = [
        'name' => 'string',
        'url' => 'string',
        'favorite' => 'boolean',
        'watched' => 'boolean',
    ];

    function validate(array $dataList) : array {
        $errors = [];
        foreach ($dataList as $index => $data) {
            $subErrors = $this->checkElement($data);
            if(count($subErrors) !== 0) {
                $errors[$index] = $subErrors;
            }
        }
        return $errors;
    }

    private function checkElement(array $data) : array {
        $errors = [];
        $seasonErrors = [];
        foreach ($this->keysTypeMapElement as $key => $type) {
            if($key === 'seasons') {
                $seasonErrors = $this->checkForKeyAndType($data, $key, $type);
            } else {
                $errors = array_merge($errors, $this->checkForKeyAndType($data, $key, $type));
            }
        }
        $errors = array_merge($errors, $this->checkTitle($data));
        if(count($seasonErrors) === 0) {
            $seasonErrors = $this->validateSeasons($data['seasons']);
            if(count($seasonErrors) !== 0) {
                $errors = array_merge($errors, [
                    'seasons' => $seasonErrors
                ]);
            }
        } else {
            $errors = array_merge($errors, $seasonErrors);
        }
        return $errors;
    }

    private function checkForKeyAndType(array $data, string $key, string $type) : array {
        $errors = [];
        if(!isset($data[$key])) {
            $errors[$key] = 'missing';
        } else if(gettype($data[$key]) !== $type) {
            $errors[$key] = 'wrong type';
        }
        return $errors;
    }

    private function validateSeasons(array $seasons) : array {
        $errors = [];
        foreach($seasons as $index => $season) {
            $subErrors = $this->validateSeason($season);
            if(count($subErrors) !== 0) {
                $errors[$index] = $subErrors;
            }
        }
        return $errors;
    }

    private function validateSeason(array $season) : array {
        $errors = [];
        $episodeErrors = [];
        foreach ($this->keysTypeMapSeason as $key => $type) {
            if($key === 'episodes') {
                $episodeErrors = $this->checkForKeyAndType($season, $key, $type);
            } else {
                $errors = array_merge($errors, $this->checkForKeyAndType($season, $key, $type));
            }
        }
        if(count($episodeErrors) === 0) {
            $episodeErrors = $this->validateEpisodes($season['episodes']);
            if(count($episodeErrors) !== 0) {
                $errors = array_merge($errors, [
                    'episodes' => $episodeErrors
                ]);
            }
        } else {
            $errors = array_merge($errors, $episodeErrors);
        }
        return $errors;
    }

    private function validateEpisodes(array $episodes) : array {
        $errors = [];
        foreach($episodes as $index => $episode) {
            $subErrors = $this->validateEpisode($episode);
            if(count($subErrors) !== 0) {
                $errors[$index] = $subErrors;
            }
        }
        return $errors;
    }

    private function validateEpisode(array $episode) : array {
        $errors = [];
        foreach ($this->keysTypeMapEpisode as $key => $type) {
            $errors = array_merge($errors, $this->checkForKeyAndType($episode, $key, $type));
        }
        return $errors;
    }

    private function checkTitle(array $data) : array {
        $errors = [];
        $bool = true;
        foreach ($this->nameKeys as $nameKey) {
            $errors = array_merge($errors, $this->checkForKeyAndType($data, $nameKey, 'string'));
            $bool &= $this->stringHasOnlyWhiteSpace($data[$nameKey]);
        }
        if(count($errors) === 0 && $bool) {
            $errors = ['name' => 'no name given'];
        }
        return $errors;
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