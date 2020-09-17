<?php


namespace OrganizeYourLinks\Api\Endpoint\Series\Remove;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;

class RemoveSeriesEndpoint implements EndpointHandlerInterface
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
        $errorList = new ErrorList();
        $id = $this->request->getRouteParam('id');
        if (!$this->source->seriesExist($id)) {
            $errorList->add(ErrorList::SERIES_DOES_NOT_EXIST . ': ' . $id);
        }
        return $errorList;
    }

    public function execute(Response $response): void
    {
        $id = $this->request->getRouteParam('id');
        $this->seriesManager->deleteSeriesMulti([$id]);
        $errorList = $this->seriesManager->getErrorList();
        $response->appendErrors($errorList);
    }
}