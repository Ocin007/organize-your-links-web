<?php


namespace OrganizeYourLinks\Api\Endpoint\Series\All;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class GetAllSeriesEndpoint implements EndpointHandlerInterface
{
    private Request $request;
    private SeriesManager $seriesManager;
    private SorterInterface $sorter;

    public function __construct(Request $request, HelperFactoryInterface $factory)
    {
        $this->request = $request;
        $this->seriesManager = $factory->getSeriesManager();
        $this->sorter = $factory->getSorter();
    }

    public function validateRequest(): ErrorListInterface
    {
        return new ErrorList();
    }

    public function execute(Response $response): void
    {
        $allSeries = $this->seriesManager->getAll(null, $this->sorter);
        if($allSeries === null) {
            $errorList = $this->seriesManager->getErrorList();
            $response->appendErrors($errorList);
        } else {
            $response->setResponse($allSeries);
        }
    }
}