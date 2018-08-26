//*
let serverData: ServerData;
let playlist: PageList;
let watched: PageList;
let notWatched: PageList;
let details: PageDetail;
let create: PageCreate;
let edit: PageEdit;
let ranking: PageRanking;
let optionPage: PageOptions;
let revert: PageDelete;
let navMap;

function reloadAllData() {
    serverData.get(function () {
        navMap = {
            1: watched,
            2: playlist,
            3: notWatched,
            4: details,
            5: create,
            6: edit,
            7: ranking,
            active: Settings.startPage,
            flag: true
        };
        switch (Settings.startPage) {
            case ListID.WATCHED:
                watched.showElement();
                notWatched.hideElement();
                playlist.hideElement();
                details.hideElement();
                create.hideElement();
                edit.hideElement();
                ranking.hideElement();
                break;
            case ListID.PLAYLIST:
                playlist.showElement();
                watched.hideElement();
                notWatched.hideElement();
                details.hideElement();
                create.hideElement();
                edit.hideElement();
                ranking.hideElement();
                break;
            case ListID.NOT_WATCHED:
                notWatched.showElement();
                details.hideElement();
                playlist.hideElement();
                watched.hideElement();
                create.hideElement();
                edit.hideElement();
                ranking.hideElement();
                break;
            case ListID.DETAILS:
                details.showElement();
                notWatched.hideElement();
                playlist.hideElement();
                watched.hideElement();
                create.hideElement();
                edit.hideElement();
                ranking.hideElement();
                break;
            case ListID.CREATE:
                details.hideElement();
                notWatched.hideElement();
                playlist.hideElement();
                watched.hideElement();
                create.showElement();
                edit.hideElement();
                ranking.hideElement();
                break;
            case ListID.EDIT:
                details.hideElement();
                notWatched.hideElement();
                playlist.hideElement();
                watched.hideElement();
                create.hideElement();
                edit.showElement();
                ranking.hideElement();
                break;
            case ListID.RANKING:
                details.hideElement();
                notWatched.hideElement();
                playlist.hideElement();
                watched.hideElement();
                create.hideElement();
                edit.hideElement();
                ranking.showElement();
                break;
        }
        playlist.generateMap();
        playlist.renderList();

        watched.generateMap();
        watched.renderList();

        notWatched.generateMap();
        notWatched.renderList();

        details.initPage();
        details.renderPage(serverData.getListElement(
            serverData.getIndexOfELement({
                id: Settings.initialDataId
            })
        ));

        create.initPage();

        edit.initPage();

        ranking.renderPage();
    });
}

function reloadEverything() {
    const playlistElement = document.getElementById('playlist');
    const watchedElement = document.getElementById('watched');
    const notWatchedElement = document.getElementById('not-watched');
    const detailsElement = document.getElementById('details');
    const opacityLayer = document.getElementById('opacity-layer');
    const pageOption = document.getElementById('page-option');
    const createElement = document.getElementById('create');
    const editElement = document.getElementById('edit');
    const rankingElement = document.getElementById('ranking');
    const deleteElement = document.getElementById('page-delete');

    const tabWatched = document.getElementById('tab-watched');
    const tabPlaylist = document.getElementById('tab-playlist');
    const tabNotWatched = document.getElementById('tab-not-watched');
    const tabDetails = document.getElementById('tab-details');
    const tabOptions = document.getElementById('option-button');
    const tabCreate = document.getElementById('tab-create');
    const tabEdit = document.getElementById('tab-edit');
    const tabRanking = document.getElementById('tab-ranking');

    const tabWatchedCount = document.getElementById('tab-watched-count');
    const tabPlaylistCount = document.getElementById('tab-playlist-count');
    const tabNotWatchedCount = document.getElementById('tab-not-watched-count');
    Settings.load(function () {
        serverData = new ServerData();

        revert = new PageDelete(opacityLayer, deleteElement, serverData);
        edit = new PageEdit(editElement, tabEdit, serverData);
        details = new PageDetail(detailsElement, tabDetails, serverData, edit, revert);
        playlist = new PageList(ListID.PLAYLIST, playlistElement, tabPlaylist, tabPlaylistCount, serverData, details, edit, revert);
        watched = new PageList(ListID.WATCHED, watchedElement, tabWatched, tabWatchedCount, serverData, details, edit, revert);
        notWatched = new PageList(ListID.NOT_WATCHED, notWatchedElement, tabNotWatched, tabNotWatchedCount, serverData, details, edit, revert);
        optionPage = new PageOptions(opacityLayer, pageOption, serverData);
        create = new PageCreate(createElement, tabCreate, serverData);
        ranking = new PageRanking(rankingElement, tabRanking, serverData);
        reloadAllData();
        tabWatched.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToWatched();
            }
        });
        tabPlaylist.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToPlaylist();
            }
        });
        tabNotWatched.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToNotWatched();
            }
        });
        tabDetails.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToDetails();
            }
        });
        tabOptions.addEventListener('click', function () {
            optionPage.renderPage(navMap[navMap.active], navMap.active);
            optionPage.showElement();
            if (navMap !== undefined) {
                slideOpenOptions(optionPage.getOptionContainer());
            }
        });
        tabCreate.addEventListener('click', function () {
            if(navMap !== undefined) {
                slideToCreate();
            }
        });
        tabEdit.addEventListener('click', function () {
            if(navMap !== undefined) {
                slideToEdit();
            }
        });
        tabRanking.addEventListener('click', function () {
            if(navMap !== undefined) {
                slideToRanking();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    reloadEverything();
});
//*/