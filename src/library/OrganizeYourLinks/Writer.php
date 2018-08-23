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

    public function updateFile($dataList) {
        try {
            $dataStr = json_encode($dataList, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            if(file_put_contents($this->directory, $dataStr) === false) {
                $this->errorList[] = 'cannot write settings';
            }
        } catch (\Exception $e) {
            $this->errorList[] = $e->getMessage();
        }
    }

    public function createNewFiles($dataListMap, $fileListMap) {
        foreach ($dataListMap as $file => $data) {
            $id = uniqid('', true);
            $data['id'] = $id;
            $this->map[$id] = $file;
            $dataStr = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            file_put_contents($this->directory.'/'.$file, $dataStr);
        }
        $mapStr = json_encode($this->map, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents($fileListMap, $mapStr);
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

    public function deleteFiles($idList, $fileListMap) {
        foreach ($idList as $id) {
            unlink($this->directory.'/'.$this->map[$id]);
            unset($this->map[$id]);
        }
        $mapStr = json_encode($this->map, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents($fileListMap, $mapStr);
    }
}