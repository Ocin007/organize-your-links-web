<?php


namespace OrganizeYourLinks\Manager;


use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Types\ErrorListInterface;

class SettingsManager implements ErrorListContainerInterface
{
    private const DEFAULT_START_PAGE = 3;
    private const DEFAULT_INITIAL_DATA_ID = "";
    private const DEFAULT_ANIMATION_SPEED_SINGLE = 0.05;
    private const DEFAULT_ANIMATION_SPEED_MULTI = 0.1;
    private const DEFAULT_MIN_SIZE_OF_PLAYLIST = 10;
    private const DEFAULT_COLOR_BRIGHTNESS = 255;
    private const DEFAULT_TITLE_LANGUAGE = "name_de";
    private const DEFAULT_EPISODE_COUNT = false;

    const KEY_START_PAGE = 'startPage';
    const KEY_INITIAL_DATA_ID = 'initialDataId';
    const KEY_ANIMATION_SPEED_SINGLE = 'animationSpeedSingle';
    const KEY_ANIMATION_SPEED_MULTI = 'animationSpeedMulti';
    const KEY_MIN_SIZE_OF_PLAYLIST = 'minSizeOfPlaylist';
    const KEY_COLOR_BRIGHTNESS = 'colorBrightness';
    const KEY_TITLE_LANGUAGE = 'titleLanguage';
    const KEY_EPISODE_COUNT = 'episodeCount';

    private array $settings;
    private ErrorListInterface $errorList;
    private DataSourceInterface $source;

    public function __construct(DataSourceInterface $source, ErrorListInterface $errorList) {
        $this->source = $source;
        $this->errorList = $errorList;
    }

    public function noErrors(): bool
    {
        return $this->errorList->isEmpty();
    }

    public function getErrorList(): ErrorListInterface
    {
        return $this->errorList;
    }

    public function addToErrorList($list): bool
    {
        if($list instanceof ErrorListInterface) {
            $this->errorList->add($list);
            return true;
        }
        return false;
    }

    public function loadSettings(): void {
        $settings = $this->source->loadSettings();
        if($settings === null) {
            $this->errorList->add($this->setDefaultSettings());
        } else {
            $this->settings = $settings;
        }
    }

    public function getSettings(): array
    {
        return $this->settings;
    }

    public function setSettings(array $settings): void
    {
        $this->settings = $settings;
    }

    public function getAttribute(string $key)
    {
        return $this->settings[$key];
    }

    public function setAttribute(string $key, $value): void
    {
        $this->settings[$key] = $value;
    }

    public function saveSettings(): void
    {
        $errorList = $this->source->saveSettings($this->settings);
        $this->errorList->add($errorList);
    }

    private function setDefaultSettings(): ErrorListInterface {
        $settings = $this->getDefaultSettings();
        $errorList = $this->source->saveSettings($settings);
        if($errorList->isEmpty()) {
            $this->settings = $settings;
        }
        return $errorList;
    }

    public static function getDefaultSettings(): array {
        return [
            self::KEY_START_PAGE => self::DEFAULT_START_PAGE,
            self::KEY_INITIAL_DATA_ID => self::DEFAULT_INITIAL_DATA_ID,
            self::KEY_ANIMATION_SPEED_SINGLE => self::DEFAULT_ANIMATION_SPEED_SINGLE,
            self::KEY_ANIMATION_SPEED_MULTI => self::DEFAULT_ANIMATION_SPEED_MULTI,
            self::KEY_MIN_SIZE_OF_PLAYLIST => self::DEFAULT_MIN_SIZE_OF_PLAYLIST,
            self::KEY_COLOR_BRIGHTNESS => self::DEFAULT_COLOR_BRIGHTNESS,
            self::KEY_TITLE_LANGUAGE => self::DEFAULT_TITLE_LANGUAGE,
            self::KEY_EPISODE_COUNT => self::DEFAULT_EPISODE_COUNT
        ];
    }
}