<?php


namespace OrganizeYourLinks\Manager;


use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\Setting;

class SettingsManager implements ErrorListContainerInterface
{
    private array $settings;
    private ErrorListInterface $errorList;
    private DataSourceInterface $source;

    public function __construct(DataSourceInterface $source, ErrorListInterface $errorList)
    {
        $this->source = $source;
        $this->errorList = $errorList;
        $this->settings = [];
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
        if ($list instanceof ErrorListInterface) {
            $this->errorList->add($list);
            return true;
        }
        return false;
    }

    public function loadSettings(): void
    {
        $settings = $this->source->loadSettings();
        if ($settings === null) {
            if (!$this->setDefaultSettings()->isEmpty()) {
                $this->errorList->add(ErrorListInterface::CANNOT_LOAD_SETTINGS);
            }
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

    private function setDefaultSettings(): ErrorListInterface
    {
        $settings = $this->getDefaultSettings();
        $errorList = $this->source->saveSettings($settings);
        if ($errorList->isEmpty()) {
            $this->settings = $settings;
        } else {
            $errorList = new ErrorList(ErrorListInterface::CANNOT_SAVE_DEFAULT_SETTINGS);
        }
        return $errorList;
    }

    public static function getDefaultSettings(): array
    {
        return Setting::DEFAULT;
    }
}