<?php


namespace OrganizeYourLinks\Api\Endpoint\Settings\Get;


use OrganizeYourLinks\Api\JsonEndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response\ResponseJson;
use OrganizeYourLinks\Manager\SettingsManager;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class GetSettingsEndpoint implements JsonEndpointHandlerInterface
{
    private Request $request;
    private SettingsManager $settingsManager;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        $this->request = $request;
        $this->settingsManager = $factory->getSettingsManager();
    }

    public function validateRequest(): ErrorListInterface
    {
        return new ErrorList();
    }

    public function execute(ResponseJson $response): void
    {
        $this->settingsManager->loadSettings();
        $settings = $this->settingsManager->getSettings();
        $errorList = $this->settingsManager->getErrorList();
        $response->appendErrors($errorList);
        $response->setResponse($settings);
    }
}