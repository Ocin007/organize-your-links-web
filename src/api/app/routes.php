<?php


use OrganizeYourLinks\Api\Endpoint\Series\All\GetAllSeriesEndpoint;
use OrganizeYourLinks\Api\Endpoint\Series\Create\CreateNewSeriesEndpoint;
use OrganizeYourLinks\Api\Endpoint\Series\Remove\RemoveSeriesEndpoint;
use OrganizeYourLinks\Api\Endpoint\Series\Update\UpdateListOfSeriesEndpoint;
use OrganizeYourLinks\Api\Endpoint\Settings\Get\GetSettingsEndpoint;
use OrganizeYourLinks\Api\Endpoint\Settings\Update\UpdateSettingsEndpoint;
use OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Episodes\GetEpisodesOfTvdbIdEndpoint;
use OrganizeYourLinks\Api\Endpoint\Tvdb\Id\Images\GetImagesOfTvdbIdEndpoint;
use OrganizeYourLinks\Api\Endpoint\Tvdb\Proxy\Image\GetImageFileEndpoint;
use OrganizeYourLinks\Api\Endpoint\Tvdb\Search\SearchForSeriesInTvdbEndpoint;
use OrganizeYourLinks\Api\Middleware\Group\CheckForKeyFileMiddleware;
use OrganizeYourLinks\Api\EndpointHandlerWrapper;
use OrganizeYourLinks\Api\Middleware\Route\CheckIsValidSeriesMiddleware;
use OrganizeYourLinks\Api\Middleware\Route\PrepareRequestWithSeriesMiddleware;
use OrganizeYourLinks\Api\Middleware\Route\SetImageHeaderMiddleware;
use Slim\Routing\RouteCollectorProxy as App;

return function (App $app, string $baseUri) {
    $app->group($baseUri, function (App $app) {

        $app->group('/series', function (App $app) {
            $app->get('/all', EndpointHandlerWrapper::getHandler(GetAllSeriesEndpoint::class));
            $app->post('/create', EndpointHandlerWrapper::getHandler(CreateNewSeriesEndpoint::class))
                ->add(new PrepareRequestWithSeriesMiddleware())->add(new CheckIsValidSeriesMiddleware());
            $app->delete('/remove/{id}', EndpointHandlerWrapper::getHandler(RemoveSeriesEndpoint::class));
            $app->put('/update', EndpointHandlerWrapper::getHandler(UpdateListOfSeriesEndpoint::class))
                ->add(new PrepareRequestWithSeriesMiddleware())->add(new CheckIsValidSeriesMiddleware());
        });

        $app->group('/settings', function (App $app) {
            $app->get('/get', EndpointHandlerWrapper::getHandler(GetSettingsEndpoint::class));
            $app->put('/update', EndpointHandlerWrapper::getHandler(UpdateSettingsEndpoint::class));
        });

        $app->group('/tvdb', function (App $app) {
            $app->group('/{tvdbId}', function (App $app) {
                $app->get('/episodes', EndpointHandlerWrapper::getHandler(GetEpisodesOfTvdbIdEndpoint::class));
                $app->get('/images', EndpointHandlerWrapper::getHandler(GetImagesOfTvdbIdEndpoint::class));
            });
            $app->group('/proxy', function (App $app) {
                $app->get('/image/{tvdbUrl:.*}', EndpointHandlerWrapper::getHandler(GetImageFileEndpoint::class))
                ->add(new SetImageHeaderMiddleware());
            });
            $app->post('/search', EndpointHandlerWrapper::getHandler(SearchForSeriesInTvdbEndpoint::class));
        })->add(new CheckForKeyFileMiddleware());

    });
};