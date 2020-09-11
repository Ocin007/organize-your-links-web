<?php


namespace OrganizeYourLinks\Api;


class Request
{

    public function __construct(string $json)
    {
        //enthält vorerst nur das rohe geparste json als array

        //evtl kann man hier komplett mitgeschickte serien in eine klasse umwandeln
        //klasse 'serienliste' als abstraktion von verzeichnis data/list
        //  reader, writer abändern
    }

    public function getParam(string $key)
    {

    }

    public function getTypeOf(string $key)
    {

    }

}