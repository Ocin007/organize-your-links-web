# organize-your-links-web

- index.html in src/public  
- Benötigt composer
- data/apikey.json.example in data/apikey.json umbenennen und TVDB API Key eintragen

Geplante Funktionen:
- neue einträge erstellen
- einträge bearbeiten
- einträge löschen
- 3 listen:
    - fertig gesehen
    - aktuelle playlist
    - noch nicht angefangen

Aufbau Listenelement:
- bild
- name
- counter (gesehen / gesamt)
- verschieben in andere liste
- bearbeiten / löschen
- wenn in aktueller playlist:
    - 'öffnen...' (klick auf name)
        - liste der folgen, nach staffeln getrennt
        - jeweils play-button
    - 'play'
    - 'als gesehen markieren'