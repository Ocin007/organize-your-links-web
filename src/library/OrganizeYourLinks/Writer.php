<?php

namespace OrganizeYourLinks;


class Writer {

    private $directory;
    private $map;
    private $idList;
    private $errorList;

    public function __construct($directory, $map) {
        $this->directory = $directory;
        $this->map = $map;
        $this->idList = [];
        $this->errorList = [];
    }

    public function updateFiles($dataList) {
        foreach ($dataList as $data) {
            try {
                $filename = $this->directory.'/'.$this->map[$data['id']];
                $dataStr = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                if(file_put_contents($filename, $dataStr) === false) {
                    $this->appendIdToErrorList($data['id']);
                } else {
                    $this->idList[] = $data['id'];
                }
            } catch (\Exception $e) {
                $this->appendIdToErrorList($data['id']);
            }
        }
    }

    public function getIdListOfUpdatedFiles() {
        return $this->idList;
    }

    public function getErrorList() {
        return $this->errorList;
    }

    private function appendIdToErrorList($id) {
        if($this->errorList === []) {
            $this->errorList['id'] = [$id];
        } else {
            $this->errorList['id'][] = $id;
        }
    }
}