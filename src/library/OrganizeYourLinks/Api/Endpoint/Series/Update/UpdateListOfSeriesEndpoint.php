<?php


namespace OrganizeYourLinks\Api\Endpoint\Series\Update;


use OrganizeYourLinks\Api\EndpointHandlerInterface;
use OrganizeYourLinks\Api\HelperFactoryInterface;
use OrganizeYourLinks\Api\Request;
use OrganizeYourLinks\Api\Response;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Manager\SeriesManager;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\SeriesInterface;

class UpdateListOfSeriesEndpoint implements EndpointHandlerInterface
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
        /** @var SeriesInterface[] $seriesList */
        $seriesList = $this->request->getConvertedParam(Request::KEY_SERIES_LIST);
        $errorList = new ErrorList();
        foreach ($seriesList as $series) {
            $id = $series->get(SeriesInterface::KEY_ID);
            if (!$this->source->seriesExist($id)) {
                $errorList->add(ErrorList::SERIES_DOES_NOT_EXIST . ': ' . $id);
            }
        }
        return $errorList;
    }

    public function execute(Response $response): void
    {
        $seriesList = $this->request->getConvertedParam(Request::KEY_SERIES_LIST);
        $idList = $this->seriesManager->updateSeriesMulti($seriesList);
        $errorList = $this->seriesManager->getErrorList();
        $response->appendErrors($errorList);
        $response->setResponse($idList);
    }
}