# organize-your-links-web

Webanwendung zum Verwalten der Links von Serien mit [TVDB](https://api.thetvdb.com/swagger) Unterstützung.
## Funktionalitäten

- Einteilen der Serien in folgende Listen:
    - Gesehen
    - Aktuelle Playlist
    - Nicht gesehen
- Anzeige genauerer Details einer bestimmten Serie
- Anlegen neuer Serien
- Suchen von Serien in der TVDB
- Bearbeiten bestehender Serien
    - Unterstützung durch die TVDB API
- Löschen bestehender Serien
- Diverse weitere Optionen:
    - Öffnen der hinterlegten Links
    - Markieren von bestimmten Folgen als "gesehen" / "nicht gesehen"
    - Verschieben von Serien in andere Listen
    - Markieren von einzelnen Folgen, Seasons oder ganzen Serien als Favorit
- Zukünftig: Rangliste

## Requirements

- PHP-fähiger Webserver, z.B IIS (PHP 7.0, andere Versionen nicht getestet)
- Benötgt "composer"
- Apikey Zur Nutzung der TVDB API (nicht zwingend notwendig, damit die Webanwendung funktioniert)

## Installation

- Lege dieses Repo in das Root-Verzeichnis des Webservers ab
    - per Konsole: `git clone https://github.com/Ocin007/organize-your-links-web.git`
- Öffne im Repository die Konsole und führe folgenden Befehl aus:
    - ohne PHPUnit: `composer install --no-dev`
    - mit PHPUnit: `composer install`
- Statte das Verzeichnis "data" mit Schreibrechten aus:
    - Rechtsklick => Eigenschaften => Sicherheit => Bearbeiten...
    - "Users" und "IIS_IUSRS" Berechtigung für "Ändern" und "Schreiben" geben
    - Übernehmen => OK => OK
##### Für TVDB API ()
- Öffne das Verzeichnis "data"
- Benenne die Datei "apikey.json.example" in "apikey.json" um und füge deine Daten ein
- Zur Kommunikation mit der TVDB API wird die Datei "cacert.pem" im data-Verzeichnis benötigt. Sollte
diese mittlerweile veraltet sein, kann sie auf <https://curl.haxx.se/docs/caextract.html> heruntergeladen werden.

Nun kann die Webanwendung unter <http://localhost/organize-your-links-web/src/public/index.html> gestartet werden.

## Backup erstellen

- Backups von "/data" mit "/src/scripts/create-backup.php" erstellen
- Landen in "/data-backup" als .zip