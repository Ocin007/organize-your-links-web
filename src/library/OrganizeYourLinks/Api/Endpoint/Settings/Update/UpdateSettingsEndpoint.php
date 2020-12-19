<?php


namespace OrganizeYourLinks\Api\Endpoint\Settings\Update;


use OrganizeYourLinks\Api\JsonEndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Manager\SettingsManager;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\Setting;
use OrganizeYourLinks\Validator\ValidatorInterface;

class UpdateSettingsEndpoint implements JsonEndpointHandlerInterface
{
    private Request $request;
    private SettingsManager $settingsManager;
    private ValidatorInterface $settingsValidator;
    private DataSourceInterface $source;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        $this->request = $request;
        $this->settingsManager = $factory->getSettingsManager();
        $this->settingsValidator = $factory->getSettingsValidator();
        $this->source = $factory->getDataSource();
    }

    public function validateRequest(): ErrorListInterface
    {
        $newSettings = $this->request->getRawBody();
        $errorList = $this->settingsValidator->validate($newSettings);
        $initialDataId = $newSettings[Setting::KEY_INITIAL_DATA_ID];
        if ($initialDataId !== null && $initialDataId !== '') {
            if (!$this->source->seriesExist($initialDataId)) {
                $errorList->add(ErrorListInterface::SERIES_DOES_NOT_EXIST);
            }
        }
        return $errorList;
    }

    public function execute(ResponseJson $response): void
    {
//        throw new \Exception('test');//TODO: remove this
//        $response->appendErrors(new ErrorList(['test 1', 'test 2']));return;//TODO: remove this
        $newSettings = $this->request->getRawBody();
        $this->settingsManager->setSettings($newSettings);
        $this->settingsManager->saveSettings();
        $errorList = $this->settingsManager->getErrorList();
        $response->appendErrors($errorList);
    }
}