<?php

namespace OrganizeYourLinks\ExternalApi;


use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\ErrorListContainerInterface;
use OrganizeYourLinks\Types\ErrorListInterface;

class TvdbApi implements ErrorListContainerInterface
{
    private static array $languages = ['de', 'en', 'ja'];
    private static array $languagesEp = ['en', 'de'];
    private static string $apiUrl = 'https://api.thetvdb.com';
    private static string $tvdbImagesUrl = 'https://www.thetvdb.com/banners/';
    private static string $rootLogin = '/login';
    private static string $rootSearch = '/search/series';
    private static string $rootEpImg1 = '/series/';
    private static string $rootEp2 = '/episodes';
    private static string $rootImg2 = '/images/query';

    private string $token;
    private array $content = [];
    private DataSourceInterface $source;
    private ErrorListInterface $errorList;

    public function __construct(DataSourceInterface $source, ErrorListInterface $errorList)
    {
        $this->source = $source;
        $this->errorList = $errorList;
    }

    public function noErrors(): bool
    {
        return $this->errorList->isEmpty();
    }

    public function getErrorList(): ErrorListInterface
    {
        return $this->errorList;
    }

    public function addToErrorList($list): bool
    {
        if ($list instanceof ErrorListInterface) {
            $this->errorList->add($list);
            return true;
        }
        return false;
    }

    public function setDataSource(DataSourceInterface $source)
    {
        $this->source = $source;
    }

    public function setErrorList(ErrorListInterface $errorList)
    {
        $this->errorList = $errorList;
    }

    public function getTvdbImgUrl(): string
    {
        return self::$tvdbImagesUrl;
    }

    public function getContent(): array
    {
        return $this->content;
    }

    public function prepare(): bool
    {
        if (!$this->source->isTvdbApiTokenValid()) {
            return $this->getNewToken();
        }
        $token = $this->source->loadTvdbApiToken();
        if ($this->addToErrorList($token)) {
            return false;
        }
        $this->token = $token;
        return true;
    }

    public function search($string): bool
    {
        $foundSomething = false;
        $urlAndQuery = TvdbApi::$apiUrl . TvdbApi::$rootSearch . '?' . http_build_query([
                'name' => $string
            ]);
        foreach (TvdbApi::$languages as $lang) {
            $result = $this->file_get_contents($urlAndQuery, $this->createStandardStreamContext($lang));
            if ($this->checkResponse($result)) {
                $this->content[$lang] = json_decode($result, true);
                $foundSomething = true;
            } else {
                $this->content[$lang] = ['Error' => 'Resource not found'];
            }
        }
        return $foundSomething;
    }

    public function getEpisodes(string $id): void
    {
        foreach (TvdbApi::$languagesEp as $lang) {
            $next = 1;
            while ($next !== null) {
                $next = $this->getPage($next, $id, $lang);
            }
        }
    }

    private function getPage(int $page, string $id, string $lang): ?int
    {
        $urlAndQuery = TvdbApi::$apiUrl . TvdbApi::$rootEpImg1 . $id . TvdbApi::$rootEp2 . '?' . http_build_query([
                'page' => $page
            ]);
        $result = $this->file_get_contents($urlAndQuery, $this->createStandardStreamContext($lang));
        if ($this->checkResponse($result)) {
            $parsed = json_decode($result, true);
            $this->appendPageToContent($parsed['data']);
            return $parsed['links']['next'];
        }
        return null;
    }

    private function getNewToken(): bool
    {
        $key = $this->source->loadTvdbApiKeyAsJSON();
        if ($this->addToErrorList($key)) {
            return false;
        }
        $context = stream_context_create([
            'http' => [
                'header' => "Content-type: application/json",
                'method' => 'POST',
                'content' => $key,
            ],
            "ssl" => [
                "cafile" => $this->source->getCaFilePath(),
                "verify_peer" => true,
                "verify_peer_name" => true,
            ],
        ]);
        $result = $this->file_get_contents(TvdbApi::$apiUrl . TvdbApi::$rootLogin, $context);
        if (!$this->checkResponse($result)) {
            return false;
        }
        $parsed = json_decode($result, true);
        if (!isset($parsed['token'])) {
            return false;
        }
        $this->token = $parsed['token'];
        $errorList = $this->source->saveTvdbApiToken($this->token);
        $this->errorList->add($errorList);
        return $errorList->isEmpty();
    }

    private function createStandardStreamContext(string $lang)
    {
        return stream_context_create([
            'http' => [
                'header' => [
                    "Content-type: application/json",
                    "Accept-Language: " . $lang,
                    "Authorization: Bearer " . $this->token
                ],
                'method' => 'GET'
            ],
            "ssl" => [
                "cafile" => $this->source->getCaFilePath(),
                "verify_peer" => true,
                "verify_peer_name" => true,
            ],
        ]);
    }

    private function checkResponse($result): bool
    {
        if ($result === false) {
            return false;
        }
        $parsed = json_decode($result, true);
        if (isset($parsed['Error'])) {
            return false;
        }
        return true;
    }

    private function appendPageToContent(array $dataArray): void
    {
        foreach ($dataArray as $data) {
            if ($data['episodeName'] !== null) {
                $s = $data['airedSeason'];
                $ep = $data['airedEpisodeNumber'];
                $name = $data['episodeName'];
                if (!isset($this->content[$s])) {
                    $this->content[$s] = [];
                }
                $this->content[$s][$ep] = $name;
            }
        }
    }

    public function getImages(string $baseUri, string $id): bool
    {
        $urlAndQuery = TvdbApi::$apiUrl . TvdbApi::$rootEpImg1 . $id . TvdbApi::$rootImg2 . '?' . http_build_query([
                'keyType' => 'season'
            ]);
        $result = $this->file_get_contents($urlAndQuery, $this->createStandardStreamContext('en'));
        if ($this->checkResponse($result)) {
            $parsed = json_decode($result, true);
            foreach ($parsed['data'] as $data) {
                if (!isset($this->content[$data['subKey']])) {
                    $this->content[$data['subKey']] = $baseUri . '/' . $data['fileName'];
                }
            }
            return true;
        }
        return false;
    }

    /**
     * @param string $url
     * @param resource|null $context
     * @return false|string
     */
    public function file_get_contents(string $url, $context = null)
    {
        set_error_handler(function () {});
        $result = file_get_contents($url, false, $context);
        restore_error_handler();
        return $result;
    }
}