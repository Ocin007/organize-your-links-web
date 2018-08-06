//*
let serverData: ServerData;
let playlist: PageList;
let watched: PageList;
let notWatched: PageList;
let details: PageDetail;
let navMap;
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
        navMap = {
            1: watched,
            2: playlist,
            3: notWatched,
            4: details,
            active: 2
        };

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
        details.renderPage(serverData.getListElement(0));
    });
    tabWatched.addEventListener('click', function () {
        if(navMap !== undefined) {
            slideToWatched();
            return;
        }
        watched.showElement();
        playlist.hideElement();
        notWatched.hideElement();
        details.hideElement();
    });
    tabPlaylist.addEventListener('click', function () {
        if(navMap !== undefined) {
            slideToPlaylist();
            return;
        }
        watched.hideElement();
        playlist.showElement();
        notWatched.hideElement();
        details.hideElement();
    });
    tabNotWatched.addEventListener('click', function () {
        if(navMap !== undefined) {
            slideToNotWatched();
            return;
        }
        watched.hideElement();
        playlist.hideElement();
        notWatched.showElement();
        details.hideElement();
    });
    tabDetails.addEventListener('click', function () {
        if(navMap !== undefined) {
            slideToDetails();
            return;
        }
        watched.hideElement();
        playlist.hideElement();
        notWatched.hideElement();
        details.showElement();
    });
});
//*/