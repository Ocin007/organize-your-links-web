let serverData: ServerData;
let playlist: PageList;
let watched: PageList;
let notWatched: PageList;
let details: PageDetail;

document.addEventListener('DOMContentLoaded', function () {
    serverData = new ServerData();
    const playlistElement = document.getElementById('playlist');
    const watchedElement = document.getElementById('watched');
    const notWatchedElement = document.getElementById('not-watched');
    const detailsElement = document.getElementById('details');

    const tabWatched = document.getElementById('tab-watched');
    const tabPlaylist = document.getElementById('tab-playlist');
    const tabNotWatched = document.getElementById('tab-not-watched');
    const tabDetails = document.getElementById('tab-details');

    details = new PageDetail(detailsElement, tabDetails, serverData);
    playlist = new PageList(ListID.PLAYLIST, playlistElement, tabPlaylist, serverData, details);
    watched = new PageList(ListID.WATCHED, watchedElement, tabWatched, serverData, details);
    notWatched = new PageList(ListID.NOT_WATCHED, notWatchedElement, tabNotWatched, serverData, details);
    serverData.get(function () {
        playlist.generateMap();
        playlist.renderList();

        watched.hideElement();
        watched.generateMap();
        watched.renderList();

        notWatched.hideElement();
        notWatched.generateMap();
        notWatched.renderList();

        details.hideElement();
        details.initPage();
    });
    tabWatched.addEventListener('click', function () {
        watched.showElement();
        playlist.hideElement();
        notWatched.hideElement();
        details.hideElement();
        /*
        if (!tabWatched.classList.contains('tab-active')) {
            tabWatched.classList.add('tab-active');
        }
        tabPlaylist.classList.remove('tab-active');
        tabNotWatched.classList.remove('tab-active');
        tabDetails.classList.remove('tab-active');
        */
    });
    tabPlaylist.addEventListener('click', function () {
        watched.hideElement();
        playlist.showElement();
        notWatched.hideElement();
        details.hideElement();
        /*
        tabWatched.classList.remove('tab-active');
        if (!tabPlaylist.classList.contains('tab-active')) {
            tabPlaylist.classList.add('tab-active');
        }
        tabNotWatched.classList.remove('tab-active');
        tabDetails.classList.remove('tab-active');
        */
    });
    tabNotWatched.addEventListener('click', function () {
        watched.hideElement();
        playlist.hideElement();
        notWatched.showElement();
        details.hideElement();
        /*
        tabWatched.classList.remove('tab-active');
        tabPlaylist.classList.remove('tab-active');
        if (!tabNotWatched.classList.contains('tab-active')) {
            tabNotWatched.classList.add('tab-active');
        }
        tabDetails.classList.remove('tab-active');
        */
    });
    tabDetails.addEventListener('click', function () {
        watched.hideElement();
        playlist.hideElement();
        notWatched.hideElement();
        details.showElement();
        /*
        tabWatched.classList.remove('tab-active');
        tabPlaylist.classList.remove('tab-active');
        tabNotWatched.classList.remove('tab-active');
        if (!tabDetails.classList.contains('tab-active')) {
            tabDetails.classList.add('tab-active');
        }
        */
    });
});