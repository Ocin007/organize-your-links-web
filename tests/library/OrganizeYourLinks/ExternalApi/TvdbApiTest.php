<?php

namespace OrganizeYourLinks\ExternalApi;

use PHPUnit\Framework\TestCase;

class TvdbApiTest extends TestCase
{
    private $keyFile;
    private $tokenFile;
    private $certFile;

    public function setUp(): void
    {
        $this->keyFile = __DIR__.'/../../../../data/apikey.json';
        $this->tokenFile = __DIR__.'/../../../../data/apitoken.json';
        $this->certFile = __DIR__.'/../../../../data/cacert.pem';
    }

    public function testPrepare()
    {
        $subject = new TvdbApi($this->keyFile, $this->tokenFile, $this->certFile);
        $result = $subject->prepare();
        $this->assertEquals(true, $result);
    }

    public function testSearch()
    {
        $subject = new TvdbApi($this->keyFile, $this->tokenFile, $this->certFile);
        $subject->prepare();
        $result = $subject->search('one piece');
        $this->assertEquals(true, $result);
    }

    public function testGetEpisodes()
    {
        $subject = new TvdbApi($this->keyFile, $this->tokenFile, $this->certFile);
        $subject->prepare();
        $subject->getEpisodes(74796);
        $this->assertEquals(true, isset($subject->getContent()['1']));
    }

    public function testGetImages()
    {
        $subject = new TvdbApi($this->keyFile, $this->tokenFile, $this->certFile);
        $subject->prepare();
        $this->assertEquals(true, $subject->getImages(74796));
    }
}
