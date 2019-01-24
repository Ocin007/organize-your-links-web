<?php

namespace OrganizeYourLinks\Validator;


use OrganizeYourLinks\OrganizeYourLinks\Validator\Validator;

class DataListValidator implements Validator {

    public function __construct() {
    }

    function validate(array $dataList): array {
        $errors = [];
        foreach ($dataList as $index => $data) {
            $subErrors = $this->checkElement($data);
            if(count($subErrors) !== 0) {
                $errors[$index] = $subErrors;
            }
        }
        return $errors;
    }
//TODO: favorite: true|false
    private function checkElement($data) {
        $errors = [];
        $errors = array_merge($errors, $this->checkForKeyAndType($data, 'id', 'string'));
        $errors = array_merge($errors, $this->checkForKeyAndType($data, 'tvdbId', 'integer'));
        $errors = array_merge($errors, $this->checkTitle($data));
        $errors = array_merge($errors, $this->checkForKeyAndType($data, 'list', 'integer'));
        $errors = array_merge($errors, $this->checkForKeyAndType($data, 'rank', 'integer'));
        $seasonErrors = $this->checkForKeyAndType($data, 'seasons', 'array');
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

    private function checkForKeyAndType($data, $key, $type) {
        $errors = [];
        if(!isset($data[$key])) {
            $errors[$key] = 'missing';
        } else if(gettype($data[$key]) !== $type) {
            $errors[$key] = 'wrong type';
        }
        return $errors;
    }

    private function validateSeasons(array $seasons) {
        $errors = [];
        foreach($seasons as $index => $season) {
            $subErrors = $this->validateSeason($season);
            if(count($subErrors) !== 0) {
                $errors[$index] = $subErrors;
            }
        }
        return $errors;
    }
//TODO: favorite: true|false
    private function validateSeason($season) {
        $errors = [];
        $errors = array_merge($errors, $this->checkForKeyAndType($season, 'thumbnail', 'string'));
        $errors = array_merge($errors, $this->checkForKeyAndType($season, 'url', 'string'));
        $episodeErrors = $this->checkForKeyAndType($season, 'episodes', 'array');
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

    private function validateEpisodes($episodes) {
        $errors = [];
        foreach($episodes as $index => $episode) {
            $subErrors = $this->validateEpisode($episode);
            if(count($subErrors) !== 0) {
                $errors[$index] = $subErrors;
            }
        }
        return $errors;
    }
//TODO: favorite: true|false
    private function validateEpisode($episode) {
        $errors = [];
        $errors = array_merge($errors, $this->checkForKeyAndType($episode, 'name', 'string'));
        $errors = array_merge($errors, $this->checkForKeyAndType($episode, 'url', 'string'));
        $errors = array_merge($errors, $this->checkForKeyAndType($episode, 'watched', 'boolean'));
        return $errors;
    }

    private function checkTitle($data) {
        $errors = [];
        $errors = array_merge($errors, $this->checkForKeyAndType($data, 'name_de', 'string'));
        $errors = array_merge($errors, $this->checkForKeyAndType($data, 'name_en', 'string'));
        $errors = array_merge($errors, $this->checkForKeyAndType($data, 'name_jpn', 'string'));
        $boolDE = $this->stringHasOnlyWhiteSpace($data['name_de']);
        $boolEN = $this->stringHasOnlyWhiteSpace($data['name_en']);
        $boolJPN = $this->stringHasOnlyWhiteSpace($data['name_jpn']);
        if(count($errors) === 0 && $boolDE && $boolEN && $boolJPN) {
            $errors = ['name' => 'no name given'];
        }
        return $errors;
    }

    private function stringHasOnlyWhiteSpace($str) {
        $strArray = str_split($str, 1);
        foreach($strArray as $char) {
            if($char !== ' ' && $char !== '') {
                return false;
            }
        }
        return true;
    }
}