<?php

namespace OrganizeYourLinks;


use Exception;

class Settings {

    const DEFAULT_START_PAGE = 3;
    const DEFAULT_INITIAL_DATA_ID = "";
    const DEFAULT_ANIMATION_SPEED_SINGLE = 0.05;
    const DEFAULT_ANIMATION_SPEED_MULTI = 0.1;
    const DEFAULT_MIN_SIZE_OF_PLAYLIST = 10;
    const DEFAULT_COLOR_BRIGHTNESS = 255;
    const DEFAULT_TITLE_LANGUAGE = "name_de";
    const DEFAULT_EPISODE_COUNT = false;

    private $settings;

    private $reader;
    private $writer;
    private $settingsFile;

    public function __construct(string $settingsFile, Reader $reader, Writer $writer) {
        $this->settingsFile = $settingsFile;
        $this->reader = $reader;
        $this->writer = $writer;
    }

    public function loadSettings() {
        $errorList = [];
        try {
            if(!is_file($this->settingsFile)) {
                $errorList = $this->setDefaultSettings();
            } else {
                $this->settings = $this->reader->readFile($this->settingsFile);
            }
        } catch (Exception $e) {
            $errorList = [$e->getMessage()];
        }
        return $errorList;
    }

    private function setDefaultSettings() {
        $settings = $this->getDefaultSettings();
        $this->settings = $settings;
        $this->writer->updateFile($settings);
        return $this->writer->getErrorList();
    }

    public static function getDefaultSettings() {
        return [
            "startPage" => Settings::DEFAULT_START_PAGE,
            "initialDataId" => Settings::DEFAULT_INITIAL_DATA_ID,
            "animationSpeedSingle" => Settings::DEFAULT_ANIMATION_SPEED_SINGLE,
            "animationSpeedMulti" => Settings::DEFAULT_ANIMATION_SPEED_MULTI,
            "minSizeOfPlaylist" => Settings::DEFAULT_MIN_SIZE_OF_PLAYLIST,
            "colorBrightness" => Settings::DEFAULT_COLOR_BRIGHTNESS,
            "titleLanguage" => Settings::DEFAULT_TITLE_LANGUAGE,
            "episodeCount" => Settings::DEFAULT_EPISODE_COUNT
        ];
    }
}