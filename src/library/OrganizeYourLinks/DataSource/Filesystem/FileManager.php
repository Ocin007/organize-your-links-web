<?php


namespace OrganizeYourLinks\DataSource\Filesystem;


use Exception;
use OrganizeYourLinks\DataSource\DataSourceInterface;
use OrganizeYourLinks\Filter\FilterInterface;
use OrganizeYourLinks\Generator\GeneratorInterface;
use OrganizeYourLinks\Sorter\SorterInterface;
use OrganizeYourLinks\Types\ErrorList;
use OrganizeYourLinks\Types\ErrorListInterface;
use OrganizeYourLinks\Types\SeriesInterface;

class FileManager implements DataSourceInterface
{
    private const DATA_DIR = __DIR__ . '/../../../../../data';
    private const TVDB_API_KEY_FILE = __DIR__ . '/../../../../../data/apikey.json';
    private const SETTINGS_FILE = __DIR__ . '/../../../../../data/settings.json';
    private const ID_FILE_MAP_FILE = __DIR__ . '/../../../../../data/list-map.json';
    private const SERIES_DIR = __DIR__ . '/../../../../../data/list';
    private const TVDB_API_TOKEN_FILE = __DIR__ . '/../../../../../data/apitoken.txt';
    private const CERT_FILE = __DIR__ . '/../../../../../data/cacert.pem';

    private const TVDB_API_TOKEN_TIME_DIFF = 82800;

    private array $idFileMap;

    private FileReaderInterface $reader;
    private FileWriterInterface $writer;
    private GeneratorInterface $nameGenerator;

    public function __construct(
        FileReaderInterface $reader,
        FileWriterInterface $writer,
        GeneratorInterface $nameGenerator
    )
    {
        $this->reader = $reader;
        $this->writer = $writer;
        $this->nameGenerator = $nameGenerator;
    }

    public function isDataDirectoryWritable(): bool
    {
        return is_writable(self::DATA_DIR);
    }

    public function keyFileExist(): bool
    {
        return file_exists(self::TVDB_API_KEY_FILE);
    }

    public function loadSettings(): ?array
    {
        $content = $this->reader->readFile(self::SETTINGS_FILE);
        if($content === null) {
            return null;
        }
        try {
            $settings = json_decode($content, true);
            return (gettype($settings) === 'array') ? $settings : null;
        } catch (Exception $e) {
            return null;
        }
    }

    public function saveSettings(array $settings): ErrorListInterface
    {
        $content = json_encode($settings, JSON_PRETTY_PRINT);
        $success = $this->writer->writeFile(self::SETTINGS_FILE, $content);
        $errorList = new ErrorList();
        if(!$success) {
            $errorList->add(ErrorList::CANNOT_SAVE_SETTINGS);
        }
        return $errorList;
    }

    /**
     * @param FilterInterface|null $filter
     * @param SorterInterface|null $sorter
     * @return ErrorListInterface|array
     */
    public function loadAllSeries(?FilterInterface $filter, ?SorterInterface $sorter)
    {
        try {
            $errorList = $this->loadIdFileMap();
            if(!$errorList->isEmpty()) {
                return $errorList;
            }
            $seriesList = [];
            foreach ($this->idFileMap as $id => $file) {
                $series = $this->loadSeries($id, $file);
                if($series instanceof ErrorListInterface) {
                    return $series;
                }
                $seriesList[] = $series;
            }
            if(isset($filter)) {
                $filter->filter($seriesList);
            }
            if(isset($sorter)) {
                $sorter->sort($seriesList);
            }
        } catch (Exception $e) {
            $errorList = new ErrorList();
            return $errorList->add(ErrorList::CANNOT_LOAD_ALL_SERIES);
        }
        return $seriesList;
    }

    /**
     * @param string $id
     * @param string $file
     * @return array|ErrorListInterface
     */
    private function loadSeries(string $id, string $file)
    {
        $seriesStr = $this->reader->readFile(self::SERIES_DIR . '/' . $file);
        if($seriesStr === null) {
            $errorList = new ErrorList();
            return $errorList->add(ErrorList::CANNOT_LOAD_SERIES . ' ' . $id);
        }
        return json_decode($seriesStr, true);
    }

    public function seriesExist(string $id): bool
    {
        $this->loadIdFileMap();
        return isset($this->idFileMap[$id]);
    }

    public function saveSeries(array $series): ErrorListInterface
    {
        $errorList = $this->loadIdFileMap();
        if(!$errorList->isEmpty()) {
            return $errorList;
        }
        $file = $this->idFileMap[$series[SeriesInterface::KEY_ID]];
        if($file === null) {
            $errorList = new ErrorList();
            return $errorList->add(
                ErrorList::CANNOT_SAVE_SERIES_NOT_EXIST . ': '
                . $series[SeriesInterface::KEY_NAME_DE] . ', '
                . $series[SeriesInterface::KEY_NAME_EN] . ', '
                . $series[SeriesInterface::KEY_NAME_JPN]
            );
        }
        $content = json_encode($series, JSON_PRETTY_PRINT);
        $success = $this->writer->writeFile(self::SERIES_DIR . '/' . $file, $content);
        $errorList = new ErrorList();
        if(!$success) {
            $errorList->add(ErrorList::CANNOT_SAVE_SERIES);
        }
        return $errorList;
    }

    /**
     * Does not check for duplicate and empty names!
     *
     * @param string $id
     * @param array $series
     * @return ErrorListInterface
     */
    public function createSeries(string $id, array $series): ErrorListInterface
    {
        $errorList = $this->loadIdFileMap();
        if(!$errorList->isEmpty()) {
            return $errorList;
        }
        $newFile = $this->generateFileName($series);
        $content = json_encode($series, JSON_PRETTY_PRINT);
        $success = $this->writer->writeFile(self::SERIES_DIR . '/' . $newFile, $content);
        if(!$success) {
            $errorList = new ErrorList();
            return $errorList->add(ErrorList::CANNOT_CREATE_NEW_SERIES);
        }
        $this->idFileMap[$id] = $newFile;
        return $this->saveIdFileMap();
    }

    public function deleteSeries(string $id): ErrorListInterface
    {
        $errorList = $this->loadIdFileMap();
        if(!$errorList->isEmpty()) {
            return $errorList;
        }
        $file = $this->idFileMap[$id];
        $success = $this->writer->deleteFile(self::SERIES_DIR . '/' . $file);
        if(!$success) {
            $errorList = new ErrorList();
            return $errorList->add(ErrorList::CANNOT_DELETE_SERIES);
        }
        unset($this->idFileMap[$id]);
        return $this->saveIdFileMap();
    }

    /**
     * @return ErrorListInterface|string
     */
    public function loadTvdbApiKeyAsJSON(): string
    {
        return $this->readFileWithErrMsg(
            self::TVDB_API_KEY_FILE,
            ErrorListInterface::CANNOT_LOAD_TVDB_API_KEY
        );
    }

    public function isTvdbApiTokenValid(): bool
    {
        if(!file_exists(self::TVDB_API_TOKEN_FILE)) {
            return false;
        }
        $now = time();
        $filetime = filemtime(self::TVDB_API_TOKEN_FILE);
        return ($now - $filetime <= self::TVDB_API_TOKEN_TIME_DIFF);
    }

    /**
     * @return ErrorListInterface|string
     */
    public function loadTvdbApiToken(): string
    {
        return $this->readFileWithErrMsg(
            self::TVDB_API_TOKEN_FILE,
            ErrorListInterface::CANNOT_LOAD_TVDB_API_TOKEN
        );
    }

    public function getCaFilePath(): string
    {
        return self::CERT_FILE;
    }

    public function saveTvdbApiToken(string $token): ErrorListInterface
    {
        $success = $this->writer->writeFile(self::TVDB_API_TOKEN_FILE, $token);
        $errorList = new ErrorList();
        if(!$success) {
            $errorList->add(ErrorList::CANNOT_SAVE_TVDB_API_TOKEN);
        }
        return $errorList;
    }

    public function checkSeriesNames(array $series): ErrorListInterface
    {
        $errorList = $this->loadIdFileMap();
        if(!$errorList->isEmpty()) {
            return $errorList;
        }
        $allNames = $this->getAllNames();
        if($allNames instanceof ErrorListInterface) {
            return $allNames;
        }
        foreach (SeriesInterface::NAME_PRIO_LIST as $nameKey) {
            $errorList->add($this->checkForDuplicateName($nameKey, $series[$nameKey], $allNames));
        }
        $errorList->add($this->checkForAlreadyExistingFiles($series));
        return $errorList;
    }

    private function loadIdFileMap(): ErrorListInterface
    {
        $errorList = new ErrorList();
        if(isset($this->idFileMap)) {
            return $errorList;
        }
        $idFileMapStr = $this->reader->readFile(self::ID_FILE_MAP_FILE);
        if($idFileMapStr === null) {
            return $errorList->add(ErrorList::CANNOT_READ_ID_FILE_MAP);
        }
        $this->idFileMap = json_decode($idFileMapStr, true);
        return $errorList;
    }

    private function saveIdFileMap(): ErrorListInterface
    {
        $content = json_encode($this->idFileMap, JSON_PRETTY_PRINT);
        $success = $this->writer->writeFile(self::ID_FILE_MAP_FILE, $content);
        $errorList = new ErrorList();
        if(!$success) {
            $errorList->add(ErrorList::CANNOT_SAVE_ID_FILE_MAP);
        }
        return $errorList;
    }

    private function generateFileName(array $series): string
    {
        foreach (SeriesInterface::NAME_PRIO_LIST as $nameKey) {
            if($series[$nameKey] !== '') {
                return $this->nameGenerator->generate($series[$nameKey]);
            }
        }
        return '';
    }

    /**
     * @param string $filePath
     * @param string $message
     * @return ErrorListInterface|string
     */
    private function readFileWithErrMsg(string $filePath, string $message)
    {
        $content = $this->reader->readFile($filePath);
        if($content === null) {
            $errorList = new ErrorList();
            return $errorList->add($message);
        }
        return $content;
    }

    /**
     * @return array|ErrorListInterface
     */
    private function getAllNames()
    {
        $allNames = [];
        foreach ($this->idFileMap as $id => $file) {
            $series = $this->loadSeries($id, $file);
            if($series instanceof ErrorListInterface) {
                return $series;
            }
            $allNames[$series[SeriesInterface::KEY_NAME_DE]] = $id;
            $allNames[$series[SeriesInterface::KEY_NAME_EN]] = $id;
            $allNames[$series[SeriesInterface::KEY_NAME_JPN]] = $id;
        }
        return $allNames;
    }

    private function checkForDuplicateName(string $nameKey, string $name, array $allNames): ErrorListInterface
    {
        $errorList = new ErrorList();
        if($name !== '' && isset($allNames[$name])) {
            $errorList->add(ErrorList::DUPLICATE_SERIES_NAME . ': ' . $nameKey);
        }
        return $errorList;
    }

    private function checkForAlreadyExistingFiles(array $series): ErrorListInterface
    {
        $errorList = new ErrorList();
        $generatedFile = $this->generateFileName($series);
        if($generatedFile === '' || file_exists(self::SERIES_DIR . '/' . $generatedFile)) {
            $errorList->add(ErrorList::SERIES_NAMES_INVALID);
        }
        return $errorList;
    }
}