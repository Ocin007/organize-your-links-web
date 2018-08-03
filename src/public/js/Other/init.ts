let serverData;
let playlist;
let watched;
let notWatched;

document.addEventListener('DOMContentLoaded', function () {
    serverData = new ServerData();
    const playlistElement = document.getElementById('playlist');
    const watchedElement = document.getElementById('watched');
    const notWatchedElement = document.getElementById('not-watched');

    playlist = new PageList(ListID.PLAYLIST, playlistElement, serverData);
    watched = new PageList(ListID.WATCHED, watchedElement, serverData);
    notWatched = new PageList(ListID.NOT_WATCHED, notWatchedElement, serverData);
    serverData.get(function () {
        playlist.generateMap();
        playlist.renderList();

        watched.hideElement();
        watched.generateMap();
        watched.renderList();

        notWatched.hideElement();
        notWatched.generateMap();
        notWatched.renderList();
    });
    const tabWatched = document.getElementById('tab-watched');
    tabWatched.addEventListener('click', function () {
        watched.showElement();
        playlist.hideElement();
        notWatched.hideElement();
        if(!tabWatched.classList.contains('tab-active')) {
            tabWatched.classList.add('tab-active');
        }
        tabPlaylist.classList.remove('tab-active');
        tabNotWatched.classList.remove('tab-active');
    });
    const tabPlaylist = document.getElementById('tab-playlist');
    tabPlaylist.addEventListener('click', function () {
        watched.hideElement();
        playlist.showElement();
        notWatched.hideElement();
        tabWatched.classList.remove('tab-active');
        if(!tabPlaylist.classList.contains('tab-active')) {
            tabPlaylist.classList.add('tab-active');
        }
        tabNotWatched.classList.remove('tab-active');
    });
    const tabNotWatched = document.getElementById('tab-not-watched');
    tabNotWatched.addEventListener('click', function () {
        watched.hideElement();
        playlist.hideElement();
        notWatched.showElement();
        tabWatched.classList.remove('tab-active');
        tabPlaylist.classList.remove('tab-active');
        if(!tabNotWatched.classList.contains('tab-active')) {
            tabNotWatched.classList.add('tab-active');
        }
    });
});