<?php

namespace OrganizeYourLinks\ExternalApi;


class TvdbApi {

    private static $timeDiff = 82800;
    private static $languages = ['de', 'en', 'ja'];
    private static $apiUrl = 'https://api.thetvdb.com';
    private static $rootLogin = '/login';
    private static $rootSearch = '/search/series';

    private $key;
    private $token;
    private $tokenFile;
    private $content = [];

    public function __construct($keyFile, $tokenFile) {
        $this->key = file_get_contents($keyFile);
        $this->tokenFile = $tokenFile;
    }

    public function getContent() {
        return $this->content;
    }

    public function prepare() {
        if(!file_exists($this->tokenFile)) {
            return $this->getNewToken();
        }
        $now = time();
        $filetime = filemtime($this->tokenFile);
        if($now - $filetime > TvdbApi::$timeDiff) {
            return $this->getNewToken();
        }
        $tokenFileContent = json_decode(file_get_contents($this->tokenFile), true);
        $this->token = $tokenFileContent['token'];
        return true;
    }

    public function search($string) {
        $foundSomething = false;
        foreach (TvdbApi::$languages as $lang) {
            $urlAndQuerry = TvdbApi::$apiUrl . TvdbApi::$rootSearch . '?' . http_build_query([
                    'name' => $string
                ]);
            $result = file_get_contents($urlAndQuerry, false, $this->createStandardStreamContext($lang));
            if ($this->checkResponse($result)) {
                $this->content[$lang] = json_decode($result, true);
                $foundSomething = true;
            } else {
                $this->content[$lang] = ['Error' => 'Resource not found'];
            }
        }
        return $foundSomething;
    }

    private function getNewToken() {
        $context = stream_context_create([
            'http' => [
                'header'  => "Content-type: application/json",
                'method'  => 'POST',
                'content' => $this->key,
            ]
        ]);
        $result = file_get_contents(TvdbApi::$apiUrl.TvdbApi::$rootLogin, false, $context);
        if(!$this->checkResponse($result)) {
            return false;
        }
        $parsed = json_decode($result, true);
        if(!isset($parsed['token'])) {
            return false;
        }
        $this->token = $parsed['token'];
        file_put_contents($this->tokenFile, $result);
        return true;
    }

    private function createStandardStreamContext($lang) {
        return stream_context_create([
            'http' => [
                'header'  => [
                    "Content-type: application/json",
                    "Accept-Language: ".$lang,
                    "Authorization: Bearer ".$this->token
                ],
                'method' => 'GET'
            ]
        ]);
    }

    private function checkResponse($result) {
        if($result === false) {
            return false;
        }
        $parsed = json_decode($result, true);
        if(isset($parsed['Error'])) {
            return false;
        }
        return true;
    }
}