<?php


namespace OrganizeYourLinks\Api\Endpoint\Settings\Get;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Manager\SettingsManager;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class GetSettingsEndpoint implements EndpointHandlerInterface
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

    public function execute(Response $response): void
    {
        $this->settingsManager->loadSettings();
        $settings = $this->settingsManager->getSettings();
        $errorList = $this->settingsManager->getErrorList();
        $response->appendErrors($errorList);
        $response->setResponse($settings);
    }
}