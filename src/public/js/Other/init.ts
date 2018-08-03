let serverData;
let playlist;

document.addEventListener('DOMContentLoaded', function () {
    serverData = new ServerData();
    const playlistElement = document.getElementById('playlist');


    playlist = new PageList(ListID.PLAYLIST, playlistElement, serverData);
    serverData.get(function () {
        playlist.generateMap();
        playlist.renderList();
    });
});