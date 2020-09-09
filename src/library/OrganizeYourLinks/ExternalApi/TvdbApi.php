<?php

namespace OrganizeYourLinks\ExternalApi;


class TvdbApi {

    private static int $timeDiff = 82800;
    private static array $languages = ['de', 'en', 'ja'];
    private static array $languagesEp = ['en', 'de'];
    private static string $apiUrl = 'https://api.thetvdb.com';
    private static string $tvdbImgagesUrl = 'https://www.thetvdb.com/banners/';
    private static string $rootLogin = '/login';
    private static string $rootSearch = '/search/series';
    private static string $rootEpImg1 = '/series/';
    private static string $rootEp2 = '/episodes';
    private static string $rootImg2 = '/images/query';

    private $key;
    private string $token;
    private string $tokenFile;
    private string $certFile;
    private array $content = [];

    public function __construct(string $keyFile, string $tokenFile, string $certFile) {
        $this->key = file_get_contents($keyFile);
        $this->tokenFile = $tokenFile;
        $this->certFile = $certFile;
    }

    public function getContent() : array {
        return $this->content;
    }

    public function prepare() : bool {
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

    public function search($string) : bool {
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

    public function getEpisodes(string $id) : void {
        foreach (TvdbApi::$languagesEp as $lang) {
            $next = 1;
            while($next !== null) {
                $next = $this->getPage($next, $id, $lang);
            }
        }
    }

    private function getPage(int $page, string $id, string $lang) : ?int {
        $urlAndQuerry = TvdbApi::$apiUrl . TvdbApi::$rootEpImg1 . $id . TvdbApi::$rootEp2 . '?' . http_build_query([
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

    private function getNewToken() : bool {
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

    private function createStandardStreamContext(string $lang) {
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

    private function checkResponse($result) : bool {
        if($result === false) {
            return false;
        }
        $parsed = json_decode($result, true);
        if(isset($parsed['Error'])) {
            return false;
        }
        return true;
    }

    private function appendPageToContent(array $dataArray) : void {
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

    public function getImages(string $id) : bool {
        $urlAndQuerry = TvdbApi::$apiUrl . TvdbApi::$rootEpImg1 . $id . TvdbApi::$rootImg2 . '?' . http_build_query([
                'keyType' => 'season'
            ]);
        $result = file_get_contents($urlAndQuerry, false, $this->createStandardStreamContext('en'));
        if ($this->checkResponse($result)) {
            $parsed = json_decode($result, true);
            foreach($parsed['data'] as $data) {
                if(!isset($this->content[$data['subKey']])) {
                    $this->content[$data['subKey']] = TvdbApi::$tvdbImgagesUrl.$data['fileName'];
                }
            }
            return true;
        }
        return false;
    }
}