<?php

namespace OrganizeYourLinks;


use Exception;

class Writer {

    private string $directory;
    private array $map;
    private array $idList;
    private array $errorList;

    public function __construct(string $directory, array $map) {
        $this->directory = $directory;
        $this->map = $map;
        $this->idList = [];
        $this->errorList = [];
    }

    public function updateFiles(array $dataList) : void {
        foreach ($dataList as $data) {
            try {
                $filename = $this->directory.'/'.$this->map[$data['id']];
                $dataStr = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                if(file_put_contents($filename, $dataStr) === false) {
                    $this->appendIdToErrorList($data['id']);
                } else {
                    $this->idList[] = $data['id'];
                }
            } catch (Exception $e) {
                $this->appendIdToErrorList($data['id']);
            }
        }
    }

    public function updateFile(array $dataList) : void {
        try {
            $dataStr = json_encode($dataList, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            if(file_put_contents($this->directory, $dataStr) === false) {
                $this->errorList[] = 'cannot write settings';
            }
        } catch (Exception $e) {
            $this->errorList[] = $e->getMessage();
        }
    }

    public function createNewFiles(array $dataListMap, string $fileListMap) : void {
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

    public function getIdListOfUpdatedFiles() : array {
        return $this->idList;
    }

    public function getErrorList() : array {
        return $this->errorList;
    }

    private function appendIdToErrorList(string $id) : void {
        if($this->errorList === []) {
            $this->errorList['id'] = [$id];
        } else {
            $this->errorList['id'][] = $id;
        }
    }

    public function deleteFiles(array $idList, string $fileListMap) : void {
        foreach ($idList as $id) {
            unlink($this->directory.'/'.$this->map[$id]);
            unset($this->map[$id]);
        }
        $mapStr = json_encode($this->map, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents($fileListMap, $mapStr);
    }
}