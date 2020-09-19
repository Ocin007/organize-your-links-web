<?php

use OrganizeYourLinks\Api\Middleware\App\CheckInstallationMiddleware;
use OrganizeYourLinks\Api\Middleware\App\CheckRequestMiddleware;
use OrganizeYourLinks\Api\Middleware\App\ResponseMiddleware;
use OrganizeYourLinks\Api\Middleware\App\SessionMiddleware;
use Slim\App;

/**
 * "The last middleware layer added is the first to be executed."
 *
 * @param App $app
 * @link http://www.slimframework.com/docs/v4/concepts/middleware.html#how-does-middleware-work Documentation
 */
return function (App $app) {

    $app->add(new SessionMiddleware());

    $app->add(new CheckRequestMiddleware());

    $app->add(new CheckInstallationMiddleware());

    $app->add(new ResponseMiddleware());
};