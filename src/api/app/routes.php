<?php


use OrganizeYourLinks\Api\Middleware\Group\CheckForKeyFileMiddleware;
use Slim\Routing\RouteCollectorProxy as App;

return function (App $app, string $baseUri) {
    $app->group($baseUri, function (App $app) {

        $app->group('/tvdb', function (App $app) {

        })->add(new CheckForKeyFileMiddleware());

    });
};