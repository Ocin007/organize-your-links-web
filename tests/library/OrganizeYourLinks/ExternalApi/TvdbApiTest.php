<?php

namespace OrganizeYourLinks\ExternalApi;

use PHPUnit\Framework\TestCase;

class TvdbApiTest extends TestCase
{
    private $keyFile = __DIR__.'/../../../../data/apikey.json';
    private $tokenFile = __DIR__.'/../../../../data/apitoken.json';
    private $certFile = __DIR__.'/../../../../data/cacert.pem';

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
}
