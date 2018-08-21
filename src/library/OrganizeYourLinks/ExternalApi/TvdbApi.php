<?php

namespace OrganizeYourLinks\ExternalApi;


class TvdbApi {

    private static $timeDiff = 82800;
    private static $languages = ['de', 'en', 'ja'];
    private static $languagesEp = ['en', 'de'];
    private static $apiUrl = 'https://api.thetvdb.com';
    private static $rootLogin = '/login';
    private static $rootSearch = '/search/series';
    private static $rootEp1 = '/series/';
    private static $rootEp2 = '/episodes';

    private $key;
    private $token;
    private $tokenFile;
    private $certFile;
    private $content = [];

    public function __construct($keyFile, $tokenFile, $certFile) {
        $this->key = file_get_contents($keyFile);
        $this->tokenFile = $tokenFile;
        $this->certFile = $certFile;
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
        $urlAndQuerry = TvdbApi::$apiUrl . TvdbApi::$rootSearch . '?' . http_build_query([
                'name' => $string
            ]);
        foreach (TvdbApi::$languages as $lang) {
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

    public function getEpisodes($id) {
        foreach (TvdbApi::$languagesEp as $lang) {
            $next = 1;
            while($next !== null) {
                $next = $this->getPage($next, $id, $lang);
            }
        }
    }

    private function getPage($page, $id, $lang) {
        $urlAndQuerry = TvdbApi::$apiUrl . TvdbApi::$rootEp1 . $id . TvdbApi::$rootEp2 . '?' . http_build_query([
                'page' => $page
            ]);
        $result = file_get_contents($urlAndQuerry, false, $this->createStandardStreamContext($lang));
        if ($this->checkResponse($result)) {
            $parsed = json_decode($result, true);
            $this->appendPageToContent($parsed['data']);
            return $parsed['links']['next'];
        }
        return null;
    }

    private function getNewToken() {
        $context = stream_context_create([
            'http' => [
                'header'  => "Content-type: application/json",
                'method'  => 'POST',
                'content' => $this->key,
            ],
            "ssl"=> [
                "cafile" => $this->certFile,
                "verify_peer" => true,
                "verify_peer_name" => true,
            ],
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
            ],
            "ssl"=> [
                "cafile" => $this->certFile,
                "verify_peer"=> true,
                "verify_peer_name"=> true,
            ],
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

    private function appendPageToContent($dataArray) {
        foreach ($dataArray as $data) {
            if($data['episodeName'] !== null) {
                $s = $data['airedSeason'];
                $ep = $data['airedEpisodeNumber'];
                $name = $data['episodeName'];
                if(!isset($this->content[$s])) {
                    $this->content[$s] = [];
                }
                $this->content[$s][$ep] = $name;
            }
        }
    }
}