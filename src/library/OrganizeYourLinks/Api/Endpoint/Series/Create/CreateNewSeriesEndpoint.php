<?php


namespace OrganizeYourLinks\Api\Endpoint\Series\Create;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Types\ErrorListInterface;

class CreateNewSeriesEndpoint implements EndpointHandlerInterface
{
    private Request $request;
    private DataSourceInterface $source;
    private SeriesManager $seriesManager;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        $this->request = $request;
        $this->source = $factory->getDataSource();
        $this->seriesManager = $factory->getSeriesManager();
    }

    public function validateRequest(): ErrorListInterface
    {
        $seriesData = $this->request->getRawParam(Request::KEY_SERIES_LIST)[0];
        return $this->source->checkSeriesNames($seriesData);
    }

    public function execute(Response $response): void
    {
        $seriesList = $this->request->getConvertedParam(Request::KEY_SERIES_LIST);
        $this->seriesManager->createSeriesMulti($seriesList);
        $errorList = $this->seriesManager->getErrorList();
        $response->appendErrors($errorList);
    }
}