var FilterType;
(function (FilterType) {
    FilterType[FilterType["ALL_WATCHED"] = 1] = "ALL_WATCHED";
    FilterType[FilterType["NO_WATCHED"] = 2] = "NO_WATCHED";
    FilterType[FilterType["NOT_ALL_WATCHED"] = 3] = "NOT_ALL_WATCHED";
    FilterType[FilterType["NOT_NO_WATCHED"] = 4] = "NOT_NO_WATCHED";
    FilterType[FilterType["ALL"] = 5] = "ALL";
})(FilterType || (FilterType = {}));
//# sourceMappingURL=FilterType.js.map
var ListID;
(function (ListID) {
    ListID[ListID["WATCHED"] = 1] = "WATCHED";
    ListID[ListID["PLAYLIST"] = 2] = "PLAYLIST";
    ListID[ListID["NOT_WATCHED"] = 3] = "NOT_WATCHED";
    ListID[ListID["DETAILS"] = 4] = "DETAILS";
    ListID[ListID["CREATE"] = 5] = "CREATE";
    ListID[ListID["EDIT"] = 6] = "EDIT";
    ListID[ListID["RANKING"] = 7] = "RANKING";
})(ListID || (ListID = {}));
//# sourceMappingURL=ListID.js.map
var TitleLang;
(function (TitleLang) {
    TitleLang["DE"] = "name_de";
    TitleLang["EN"] = "name_en";
    TitleLang["JPN"] = "name_jpn";
})(TitleLang || (TitleLang = {}));
//# sourceMappingURL=TitleLang.js.map
//# sourceMappingURL=DataListElement.js.map
//# sourceMappingURL=ForeachElement.js.map
//# sourceMappingURL=Slideable.js.map
var AjaxRequest = /** @class */ (function () {
    function AjaxRequest() {
    }
    AjaxRequest.sendAjaxRequest = function (url, data, onError, onSuccess) {
        var http = new XMLHttpRequest();
        http.open("POST", url);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.addEventListener('load', function () {
            if (http.status >= 200 && http.status < 300) {
                try {
                    onSuccess(http);
                }
                catch (e) {
                    var errWindow = window.open();
                    errWindow.document.write(http.responseText);
                    errWindow.document.write(e);
                }
            }
            else {
                onError(http);
            }
        });
        http.send('data=' + JSON.stringify(data));
    };
    AjaxRequest.errFunction = function (http, title) {
        console.warn('Error: ' + title + ', code: ' + http.status + ' ' + http.statusText);
        console.log(http.responseText);
        try {
            console.log(JSON.parse(http.responseText));
        }
        catch (e) {
            console.log('cannot be parsed');
        }
        var errWindow = window.open();
        errWindow.document.write(http.responseText);
    };
    return AjaxRequest;
}());
//# sourceMappingURL=AjaxRequest.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ServerData = /** @class */ (function (_super) {
    __extends(ServerData, _super);
    function ServerData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.watched = [];
        _this.playList = [];
        _this.notWatched = [];
        _this.allElements = [];
        return _this;
    }
    ServerData.prototype.get = function (callback) {
        var instance = this;
        ServerData.sendAjaxRequest('../api/get.php', {}, function (http) {
            ServerData.errFunction(http, 'get');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "get"');
                console.warn(resObj.error);
                return;
            }
            instance.allElements = resObj.response;
            instance.splitInThreeLists();
            if (callback !== undefined) {
                callback();
            }
        });
    };
    ServerData.prototype.put = function (list, callback) {
        var instance = this;
        ServerData.encodeAllElements(list);
        ServerData.sendAjaxRequest('../api/put.php', list, function (http) {
            ServerData.errFunction(http, 'put');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "put"');
                console.warn(resObj.error);
            }
            if (resObj.response === undefined) {
                return;
            }
            for (var i = 0; i < list.length; i++) {
                if (resObj.response.indexOf(list[i].id) !== -1) {
                    instance.updateList(list[i]);
                }
            }
            instance.decodeAllElements();
            if (callback !== undefined) {
                callback();
            }
        });
    };
    ServerData.prototype.post = function (list, onError, onSuccess) {
        ServerData.encodeAllElements(list);
        ServerData.sendAjaxRequest('../api/post.php', list, function (http) {
            ServerData.errFunction(http, 'post');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                onError(resObj.error);
                return;
            }
            if (resObj.response !== undefined) {
                onSuccess();
                return;
            }
        });
    };
    ServerData.prototype.delete = function (idArray, callback) {
    };
    ServerData.prototype.getIndexList = function (id) {
        switch (id) {
            case ListID.WATCHED:
                return this.watched;
            case ListID.PLAYLIST:
                return this.playList;
            case ListID.NOT_WATCHED:
                return this.notWatched;
        }
    };
    ServerData.prototype.getListLen = function () {
        return this.allElements.length;
    };
    ServerData.prototype.getListElement = function (index) {
        return this.allElements[index];
    };
    ServerData.prototype.getIndexOfElementWithName = function (name) {
        if (name === '') {
            return -1;
        }
        for (var i = 0; i < this.allElements.length; i++) {
            var boolDE = this.allElements[i][TitleLang.DE] === name;
            var boolEN = this.allElements[i][TitleLang.EN] === name;
            var boolJPN = this.allElements[i][TitleLang.JPN] === name;
            if (boolDE || boolEN || boolJPN) {
                return i;
            }
        }
        return -1;
    };
    ServerData.prototype.getSortedListWithNames = function () {
        var list = [];
        var len = this.allElements.length;
        for (var i = 0; i < len; i++) {
            var helperArray = [];
            var data = this.allElements[i];
            if (data[TitleLang.DE] !== '' && helperArray.indexOf(data[TitleLang.DE]) === -1) {
                helperArray.push(data[TitleLang.DE]);
            }
            if (data[TitleLang.EN] !== '' && helperArray.indexOf(data[TitleLang.EN]) === -1) {
                helperArray.push(data[TitleLang.EN]);
            }
            if (data[TitleLang.JPN] !== '' && helperArray.indexOf(data[TitleLang.JPN]) === -1) {
                helperArray.push(data[TitleLang.JPN]);
            }
            list = list.concat(helperArray);
        }
        list.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        return list;
    };
    ServerData.prototype.getIndexOfELement = function (data) {
        for (var i = 0; i < this.allElements.length; i++) {
            if (this.allElements[i].id === data.id) {
                return i;
            }
        }
        return -1;
    };
    ServerData.prototype.splitInThreeLists = function () {
        this.watched = [];
        this.playList = [];
        this.notWatched = [];
        for (var i = 0; i < this.allElements.length; i++) {
            switch (this.allElements[i].list) {
                case ListID.WATCHED:
                    this.watched.push(i);
                    break;
                case ListID.PLAYLIST:
                    this.playList.push(i);
                    break;
                case ListID.NOT_WATCHED:
                    this.notWatched.push(i);
                    break;
            }
        }
    };
    ServerData.prototype.decodeAllElements = function () {
        for (var i = 0; i < this.allElements.length; i++) {
            this.decodeElement(i);
        }
    };
    ServerData.prototype.decodeElement = function (index) {
        var element = this.allElements[index];
        element.name_de = decodeURIComponent(element.name_de);
        element.name_en = decodeURIComponent(element.name_en);
        element.name_jpn = decodeURIComponent(element.name_jpn);
        for (var s = 0; s < element.seasons.length; s++) {
            element.seasons[s].url = decodeURIComponent(element.seasons[s].url);
            element.seasons[s].thumbnail = decodeURIComponent(element.seasons[s].thumbnail);
            for (var ep = 0; ep < element.seasons[s].episodes.length; ep++) {
                element.seasons[s].episodes[ep].url = decodeURIComponent(element.seasons[s].episodes[ep].url);
                element.seasons[s].episodes[ep].name = decodeURIComponent(element.seasons[s].episodes[ep].name);
            }
        }
    };
    ServerData.encodeAllElements = function (elementList) {
        for (var i = 0; i < elementList.length; i++) {
            ServerData.encodeElement(elementList[i]);
        }
    };
    ServerData.encodeElement = function (element) {
        element.name_de = encodeURIComponent(element.name_de);
        element.name_en = encodeURIComponent(element.name_en);
        element.name_jpn = encodeURIComponent(element.name_jpn);
        for (var s = 0; s < element.seasons.length; s++) {
            element.seasons[s].url = encodeURIComponent(element.seasons[s].url);
            element.seasons[s].thumbnail = encodeURIComponent(element.seasons[s].thumbnail);
            for (var ep = 0; ep < element.seasons[s].episodes.length; ep++) {
                element.seasons[s].episodes[ep].url = encodeURIComponent(element.seasons[s].episodes[ep].url);
                element.seasons[s].episodes[ep].name = encodeURIComponent(element.seasons[s].episodes[ep].name);
            }
        }
    };
    ServerData.prototype.updateList = function (element) {
        for (var i = 0; i < this.allElements.length; i++) {
            if (this.allElements[i].id === element.id) {
                this.allElements[i] = element;
                return;
            }
        }
    };
    return ServerData;
}(AjaxRequest));
//# sourceMappingURL=ServerData.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Settings = /** @class */ (function (_super) {
    __extends(Settings, _super);
    function Settings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Settings.load = function (callback) {
        Settings.sendAjaxRequest('../api/loadSettings.php', {}, function (http) {
            Settings.errFunction(http, 'load');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "get"');
                console.warn(resObj.error);
                return;
            }
            Settings.setAllSettings(resObj.response);
            if (callback !== undefined) {
                callback();
            }
        });
    };
    Settings.update = function (callback) {
        var data = Settings.generateSettingsObj();
        Settings.sendAjaxRequest('../api/updateSettings.php', data, function (http) {
            Settings.errFunction(http, 'load');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "get"');
                console.warn(resObj.error);
                return;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    };
    Settings.setAllSettings = function (response) {
        Settings.startPage = response.startPage;
        Settings.initialDataId = response.initialDataId;
        Settings.animationSpeedSingle = response.animationSpeedSingle;
        Settings.animationSpeedMulti = response.animationSpeedMulti;
        Settings.minSizeOfPlaylist = response.minSizeOfPlaylist;
        Settings.colorBrightness = response.colorBrightness;
        Settings.titleLanguage = response.titleLanguage;
        Settings.episodeCount = response.episodeCount;
    };
    Settings.generateSettingsObj = function () {
        return {
            startPage: Settings.startPage,
            initialDataId: Settings.initialDataId,
            animationSpeedSingle: Settings.animationSpeedSingle,
            animationSpeedMulti: Settings.animationSpeedMulti,
            minSizeOfPlaylist: Settings.minSizeOfPlaylist,
            colorBrightness: Settings.colorBrightness,
            titleLanguage: Settings.titleLanguage,
            episodeCount: Settings.episodeCount
        };
    };
    return Settings;
}(AjaxRequest));
//# sourceMappingURL=Settings.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TVDB = /** @class */ (function (_super) {
    __extends(TVDB, _super);
    function TVDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TVDB.search = function (token, callback) {
        TVDB.sendAjaxRequest('../api/tvdb/search.php', token, function (http) {
            TVDB.errFunction(http, 'search');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            callback(resObj);
        });
    };
    TVDB.getEpisodes = function (id, callback) {
        TVDB.sendAjaxRequest('../api/tvdb/getEpisodes.php', id, function (http) {
            TVDB.errFunction(http, 'getEpisodes');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            callback(resObj);
        });
    };
    TVDB.getImages = function (id, callback) {
        TVDB.sendAjaxRequest('../api/tvdb/getImages.php', id, function (http) {
            TVDB.errFunction(http, 'getImages');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            callback(resObj);
        });
    };
    return TVDB;
}(AjaxRequest));
//# sourceMappingURL=TVDB.js.map
var ListElement = /** @class */ (function () {
    function ListElement(dataIndex, serverData, detailPage, pageList, editPage) {
        this.dataIndex = dataIndex;
        this.serverData = serverData;
        this.detailPage = detailPage;
        this.pageList = pageList;
        this.editPage = editPage;
        this.openTab = [];
        var element = this.serverData.getListElement(this.dataIndex);
        _a = ListElement.getIndicesAndCountOfFirstNotWatched(element), this.sIndex = _a[0], this.epIndex = _a[1], this.epCount = _a[2], this.maxCount = _a[3], this.success = _a[4];
        var _a;
    }
    ListElement.prototype.getDataIndex = function () {
        return this.dataIndex;
    };
    ListElement.prototype.getId = function () {
        return this.serverData.getListElement(this.dataIndex).id;
    };
    ListElement.prototype.getName = function (lang) {
        var data = this.serverData.getListElement(this.dataIndex);
        if (data[lang] !== '') {
            return data[lang];
        }
        if (data[TitleLang.DE] !== '') {
            return data[TitleLang.DE];
        }
        if (data[TitleLang.EN] !== '') {
            return data[TitleLang.EN];
        }
        if (data[TitleLang.JPN] !== '') {
            return data[TitleLang.JPN];
        }
    };
    ListElement.prototype.getListId = function () {
        return this.serverData.getListElement(this.dataIndex).list;
    };
    ListElement.prototype.getElement = function () {
        return this.htmlListElement;
    };
    ListElement.prototype.currentEpWatched = function () {
        return this.data.seasons[this.sIndex].episodes[this.epIndex].watched;
    };
    ListElement.prototype.allEpWatched = function () {
        for (var s = this.data.seasons.length - 1; s > -1; s--) {
            for (var ep = this.data.seasons[s].episodes.length - 1; ep > -1; ep--) {
                if (!this.data.seasons[s].episodes[ep].watched) {
                    return false;
                }
            }
        }
        return true;
    };
    ListElement.prototype.noEpWatched = function () {
        for (var s = 0; s < this.data.seasons.length; s++) {
            for (var ep = 0; ep < this.data.seasons[s].episodes.length; ep++) {
                if (this.data.seasons[s].episodes[ep].watched) {
                    return false;
                }
            }
        }
        return true;
    };
    ListElement.prototype.showPageList = function () {
        this.pageList.showElement();
    };
    ListElement.prototype.renderPageList = function () {
        this.pageList.generateMap();
        this.pageList.renderList();
    };
    ListElement.prototype.playButton = function () {
        var len = this.openTab.push(window.open(this.data.seasons[this.sIndex].episodes[this.epIndex].url));
        if (this.openTab[len - 1] !== null) {
            return true;
        }
    };
    ListElement.prototype.closeTabButton = function () {
        var success;
        for (var i = 0; i < this.openTab.length; i++) {
            if (this.openTab[i] !== null && this.openTab[i] !== undefined) {
                if (!this.openTab[i].closed) {
                    this.openTab[i].close();
                    success = true;
                }
            }
        }
        this.openTab = [];
        return success;
    };
    ListElement.prototype.watchedButton = function () {
        return this.setWatchedTo(true);
    };
    ListElement.prototype.notWatchedButton = function () {
        return this.setWatchedTo(false);
    };
    ListElement.prototype.addButton = function () {
        var success;
        if (this.data.seasons[this.sIndex].episodes.length - 1 > this.epIndex) {
            this.epIndex++;
            this.epCount++;
            success = true;
        }
        else if (this.data.seasons.length - 1 > this.sIndex) {
            this.sIndex++;
            this.epIndex = 0;
            this.epCount++;
            success = true;
        }
        this.refresh();
        return success;
    };
    ListElement.prototype.subtrButton = function () {
        var success;
        if (this.epIndex > 0) {
            this.epIndex--;
            this.epCount--;
            success = true;
        }
        else if (this.sIndex > 0) {
            this.sIndex--;
            this.epIndex = this.data.seasons[this.sIndex].episodes.length - 1;
            this.epCount--;
            success = true;
        }
        this.refresh();
        return success;
    };
    ListElement.prototype.arrowLeftButton = function (relSpeed, callback) {
        if (!navMap.flag) {
            return;
        }
        slideListElementLeft(this, relSpeed, callback);
        return this.data;
    };
    ListElement.prototype.arrowRightButton = function (relSpeed, callback) {
        if (!navMap.flag) {
            return;
        }
        slideListElementRight(this, relSpeed, callback);
        return this.data;
    };
    ListElement.prototype.generateNewElement = function () {
        this.data = this.serverData.getListElement(this.dataIndex);
        var listElement = document.createElement('div');
        listElement.id = this.getId();
        listElement.classList.add('list-element');
        listElement.classList.add('shadow-bottom');
        var imgLabelContainer = document.createElement('div');
        imgLabelContainer.classList.add('list-img-label');
        if (this.data.seasons.length !== 0) {
            this.thumbnail = this.generateThumbnail();
            imgLabelContainer.appendChild(this.thumbnail);
        }
        var buttonContainer = this.generateButtonContainer();
        var labelContainer = this.generateLabelContainer();
        imgLabelContainer.appendChild(labelContainer);
        listElement.appendChild(imgLabelContainer);
        listElement.appendChild(buttonContainer);
        this.htmlListElement = listElement;
    };
    ListElement.prototype.generateThumbnail = function () {
        var instance = this;
        var thumbnail = ListElement.generateButton(this.data.seasons[this.sIndex].thumbnail, 'thumbnail', function () {
            window.open(instance.data.seasons[instance.sIndex].url);
        });
        thumbnail.classList.add('thumbnail');
        return thumbnail;
    };
    ListElement.prototype.generateButtonContainer = function () {
        var container = document.createElement('div');
        container.classList.add('list-button-container');
        switch (this.data.list) {
            case ListID.WATCHED:
                container.appendChild(this.createArrowRightButton());
                break;
            case ListID.PLAYLIST:
                container.appendChild(this.createArrowLeftButton());
                container.appendChild(this.createArrowRightButton());
                break;
            case ListID.NOT_WATCHED:
                container.appendChild(this.createArrowLeftButton());
                break;
        }
        if (this.data.seasons.length !== 0) {
            container.appendChild(this.createPlayButton());
            container.appendChild(this.createWatchedButton());
        }
        container.appendChild(this.createEditButton());
        container.appendChild(this.createDeleteButton());
        return container;
    };
    ListElement.prototype.createArrowLeftButton = function () {
        var instance = this;
        return ListElement.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            instance.arrowLeftButton(Settings.animationSpeedSingle, function () {
                var element = instance.serverData.getListElement(instance.dataIndex);
                element.list--;
                instance.serverData.put([element], function () {
                    instance.renderAfterArrowLeft(element.list);
                });
            });
        });
    };
    ListElement.prototype.renderAfterArrowLeft = function (newListId) {
        this.serverData.splitInThreeLists();
        navMap[newListId].generateMap();
        navMap[newListId].renderList();
        navMap[newListId + 1].generateMap();
        navMap[newListId + 1].renderList();
    };
    ListElement.prototype.createArrowRightButton = function () {
        var instance = this;
        return ListElement.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            instance.arrowRightButton(Settings.animationSpeedSingle, function () {
                var element = instance.serverData.getListElement(instance.dataIndex);
                element.list++;
                instance.serverData.put([element], function () {
                    instance.renderAfterArrowRight(element.list);
                });
            });
        });
    };
    ListElement.prototype.renderAfterArrowRight = function (newListId) {
        this.serverData.splitInThreeLists();
        navMap[newListId].generateMap();
        navMap[newListId].renderList();
        navMap[newListId - 1].generateMap();
        navMap[newListId - 1].renderList();
    };
    ListElement.prototype.createPlayButton = function () {
        var instance = this;
        return ListElement.generateButton('img/play.ico', 'play', function () {
            instance.playButton();
        });
    };
    ListElement.prototype.createWatchedButton = function () {
        this.watchedStatus = document.createElement('img');
        this.setAttributesWatched(this.data.seasons[this.sIndex].episodes[this.epIndex].watched);
        var instance = this;
        this.watchedStatus.addEventListener('click', function () {
            var oldBool = instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched;
            instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched = !oldBool;
            instance.setAttributesWatched(!oldBool);
            instance.serverData.put([instance.data]);
        });
        return this.watchedStatus;
    };
    ListElement.prototype.setWatchedTo = function (bool) {
        if (this.data.seasons[this.sIndex].episodes[this.epIndex].watched === bool) {
            return;
        }
        this.data.seasons[this.sIndex].episodes[this.epIndex].watched = bool;
        this.setAttributesWatched(bool);
        return this.data;
    };
    ListElement.prototype.setAttributesWatched = function (bool) {
        if (bool) {
            this.watchedStatus.src = 'img/watched.ico';
            this.watchedStatus.alt = 'watched';
        }
        else {
            this.watchedStatus.src = 'img/not-watched.ico';
            this.watchedStatus.alt = 'not-watched';
        }
    };
    ;
    ListElement.prototype.createEditButton = function () {
        var instance = this;
        return ListElement.generateButton('img/edit.ico', 'edit', function () {
            instance.editPage.renderPage(instance.data);
            slideToEdit();
            setTimeout(function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 120);
        });
    };
    ListElement.prototype.createDeleteButton = function () {
        var instance = this;
        return ListElement.generateButton('img/delete.ico', 'delete', function () {
            //TODO: delete
        });
    };
    ListElement.generateButton = function (src, alt, onClick) {
        var button = document.createElement('img');
        button.src = src;
        button.alt = alt;
        button.addEventListener('click', function (ev) {
            onClick(ev);
        });
        return button;
    };
    ListElement.prototype.generateLabelContainer = function () {
        var container = document.createElement('div');
        container.classList.add('list-label');
        var labelContainer = document.createElement('div');
        labelContainer.classList.add('title-episode-container');
        labelContainer.appendChild(this.generateTitle());
        if (this.data.seasons.length !== 0) {
            this.episode = this.generateEpisodeName();
            labelContainer.appendChild(this.episode);
        }
        container.appendChild(labelContainer);
        if (this.data.seasons.length !== 0) {
            container.appendChild(this.generateAddSubContainer());
        }
        return container;
    };
    ListElement.prototype.generateTitle = function () {
        var title = document.createElement('h3');
        title.innerHTML = this.getName(Settings.titleLanguage);
        var instance = this;
        title.addEventListener('click', function () {
            instance.detailPage.renderPage(instance.data);
            slideToDetails();
            setTimeout(function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 120);
        });
        return title;
    };
    ListElement.prototype.generatePrefix = function () {
        return 's' + (this.sIndex + 1) + 'ep' + (this.epIndex + 1) + ': ';
    };
    ListElement.prototype.generateEpisodeName = function () {
        var episode = document.createElement('p');
        episode.classList.add('episode-name');
        episode.classList.add('list-label-p');
        var prefix = this.generatePrefix();
        episode.innerHTML = prefix + this.data.seasons[this.sIndex].episodes[this.epIndex].name;
        return episode;
    };
    ListElement.prototype.generateAddSubContainer = function () {
        var addSub = document.createElement('div');
        addSub.classList.add('add-sub-count-container');
        var count = document.createElement('p');
        count.classList.add('list-label-p');
        this.countEp = document.createElement('span');
        this.countEp.innerHTML = this.epCount.toString();
        var node = document.createTextNode('/');
        var countMax = document.createElement('span');
        countMax.innerHTML = this.maxCount.toString();
        count.appendChild(this.countEp);
        count.appendChild(node);
        count.appendChild(countMax);
        addSub.appendChild(count);
        var instance = this;
        addSub.appendChild(ListElement.generateButton('img/add-button.ico', 'add', function () {
            instance.addButton();
        }));
        addSub.appendChild(ListElement.generateButton('img/subtr-button.ico', 'subtr', function () {
            instance.subtrButton();
        }));
        return addSub;
    };
    ListElement.prototype.refresh = function () {
        var prefix = this.generatePrefix();
        this.episode.innerHTML = prefix + this.data.seasons[this.sIndex].episodes[this.epIndex].name;
        this.countEp.innerHTML = this.epCount.toString();
        this.thumbnail.src = this.data.seasons[this.sIndex].thumbnail;
        this.setAttributesWatched(this.data.seasons[this.sIndex].episodes[this.epIndex].watched);
    };
    ListElement.getIndicesAndCountOfFirstNotWatched = function (data) {
        var sIndex, epIndex, epCount = 0, maxCount = 0, success = false;
        var flag = true;
        var s, ep;
        for (s = 0; s < data.seasons.length; s++) {
            for (ep = 0; ep < data.seasons[s].episodes.length; ep++) {
                if (flag) {
                    epCount++;
                }
                if (!data.seasons[s].episodes[ep].watched && flag) {
                    sIndex = s;
                    epIndex = ep;
                    flag = false;
                    success = true;
                }
                maxCount++;
            }
        }
        if (!success) {
            sIndex = s - 1;
            epIndex = ep - 1;
        }
        return [sIndex, epIndex, epCount, maxCount, success];
    };
    return ListElement;
}());
//# sourceMappingURL=ListElement.js.map
var PageCreate = /** @class */ (function () {
    function PageCreate(pageElement, tabElement, serverData) {
        this.pageElement = pageElement;
        this.tabElement = tabElement;
        this.serverData = serverData;
    }
    PageCreate.prototype.activateTab = function () {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    };
    PageCreate.prototype.deactivateTab = function () {
        this.tabElement.classList.remove('tab-active');
    };
    PageCreate.prototype.getPageElement = function () {
        return this.pageElement;
    };
    PageCreate.prototype.hidePage = function () {
        this.pageElement.style.display = 'none';
    };
    PageCreate.prototype.showPage = function () {
        this.pageElement.style.display = 'flex';
    };
    PageCreate.prototype.foreachListElement = function (callback, opt) {
    };
    PageCreate.prototype.getDataIndexList = function () {
    };
    PageCreate.prototype.getElementWithDataIndex = function (dataIndex) {
    };
    PageCreate.prototype.getListId = function () {
    };
    PageCreate.prototype.hideElement = function () {
        this.hidePage();
        this.deactivateTab();
    };
    PageCreate.prototype.showElement = function () {
        this.showPage();
        this.activateTab();
    };
    PageCreate.prototype.setResults = function (tvdbID, nameDE, nameEN, nameJPN) {
        this.inputDE.value = nameDE;
        this.inputEN.value = nameEN;
        this.inputJPN.value = nameJPN;
        this.tvdbID = tvdbID;
        this.msgContainer.innerHTML = 'TVDB ID: #' + tvdbID;
        this.msgContainer.classList.remove('create-msg-success');
        this.msgContainer.classList.remove('create-msg-error');
    };
    PageCreate.prototype.initPage = function () {
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(PageCreate.generateTitel());
        this.appendTvdbSearch();
        this.pageElement.appendChild(this.generateInputContainer('img/germany-big.png', 'germany', 'inputDE'));
        this.pageElement.appendChild(this.generateInputContainer('img/uk-big.png', 'uk', 'inputEN'));
        this.pageElement.appendChild(this.generateInputContainer('img/japan-big.png', 'japan', 'inputJPN'));
        this.pageElement.appendChild(this.generateMsgContainer());
        this.pageElement.appendChild(this.generateButtonContainer());
    };
    PageCreate.prototype.appendTvdbSearch = function () {
        var searchButton = PageCreate.createDiv(['custom-button'], [PageDetail.createImg('img/search-icon.ico', 'search')]);
        var input = PageCreate.createTextInput(['name-input'], 'TVDB durchsuchen...');
        this.pageElement.appendChild(PageCreate.createDiv(['name-input-container'], [searchButton, input]));
        var container = PageCreate.createDiv(['search-result-container']);
        this.pageElement.appendChild(PageCreate.createDiv(['create-msg-wrapper'], [container]));
        this.tvdbSearch = new TvdbSearchResults(searchButton, input, container, this);
        this.tvdbSearch.init();
    };
    PageCreate.prototype.postNewElement = function () {
        var data = this.createNewDataListElement();
        var instance = this;
        this.serverData.post([data], function (error) {
            instance.msgContainer.classList.remove('create-msg-success');
            instance.msgContainer.classList.remove('create-msg-error');
            instance.msgContainer.classList.add('create-msg-error');
            instance.inputDE.classList.remove('name-input-error');
            instance.inputEN.classList.remove('name-input-error');
            instance.inputJPN.classList.remove('name-input-error');
            instance.msgContainer.innerHTML = JSON.stringify(error[0]);
            if (error[0].name !== undefined) {
                instance.msgContainer.innerHTML = 'Es muss mindestens 1 Name angegeben werden. ';
                instance.inputDE.classList.remove('name-input-error');
                instance.inputEN.classList.remove('name-input-error');
                instance.inputJPN.classList.remove('name-input-error');
            }
            if (error[0]['name-dublicate'] !== undefined) {
                instance.msgContainer.innerHTML = 'Name existiert bereits. ';
                if (error[0]['name-dublicate']['name_de'] !== undefined) {
                    instance.inputDE.classList.add('name-input-error');
                }
                if (error[0]['name-dublicate']['name_en'] !== undefined) {
                    instance.inputEN.classList.add('name-input-error');
                }
                if (error[0]['name-dublicate']['name_jpn'] !== undefined) {
                    instance.inputJPN.classList.add('name-input-error');
                }
            }
            if (error[0]['name-file'] !== undefined) {
                instance.msgContainer.innerHTML = 'Serie konnte nicht hinzugefügt werden. Bitte andere Namen wählen.';
            }
        }, function () {
            instance.msgContainer.innerHTML = 'Neue Serie angelegt!';
            instance.msgContainer.classList.remove('create-msg-success');
            instance.msgContainer.classList.remove('create-msg-error');
            instance.msgContainer.classList.add('create-msg-success');
            setTimeout(reloadEverything, 1000);
        });
    };
    PageCreate.prototype.resetInput = function () {
        this.tvdbSearch.reset();
        this.inputDE.value = '';
        this.inputEN.value = '';
        this.inputJPN.value = '';
        this.inputDE.classList.remove('name-input-error');
        this.inputEN.classList.remove('name-input-error');
        this.inputJPN.classList.remove('name-input-error');
        this.msgContainer.innerHTML = '';
        this.msgContainer.classList.remove('create-msg-success');
        this.msgContainer.classList.remove('create-msg-error');
    };
    PageCreate.generateTitel = function () {
        var title = document.createElement('h1');
        title.innerHTML = 'Neue Serie anlegen';
        return PageCreate.createDiv(['title-container-create'], [title]);
    };
    PageCreate.prototype.generateInputContainer = function (src, alt, inputField) {
        var img = PageDetail.createImg(src, alt);
        this[inputField] = PageCreate.createTextInput(['name-input'], 'Name der Serie');
        return PageCreate.createDiv(['name-input-container'], [img, this[inputField]]);
    };
    PageCreate.prototype.generateMsgContainer = function () {
        this.msgContainer = PageCreate.createDiv(['create-msg-container']);
        return PageCreate.createDiv(['create-msg-wrapper'], [this.msgContainer]);
    };
    PageCreate.prototype.generateButtonContainer = function () {
        var buttonSave = PageCreate.createDiv(['custom-button', 'button-green']);
        buttonSave.innerHTML = 'Erstellen';
        var buttonRevert = PageCreate.createDiv(['custom-button', 'button-red']);
        buttonRevert.innerHTML = 'Verwerfen';
        var instance = this;
        buttonSave.addEventListener('click', function () {
            instance.postNewElement();
        });
        buttonRevert.addEventListener('click', function () {
            instance.resetInput();
        });
        return PageCreate.createDiv(['create-button-container'], [buttonSave, buttonRevert]);
    };
    PageCreate.createDiv = function (classArray, appendArray) {
        var div = document.createElement('div');
        for (var i = 0; i < classArray.length; i++) {
            div.classList.add(classArray[i]);
        }
        if (appendArray !== undefined) {
            for (var i = 0; i < appendArray.length; i++) {
                div.appendChild(appendArray[i]);
            }
        }
        return div;
    };
    PageCreate.createTextInput = function (classArray, placeholder) {
        var input = document.createElement('input');
        input.type = 'text';
        for (var i = 0; i < classArray.length; i++) {
            input.classList.add(classArray[i]);
        }
        input.placeholder = placeholder;
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
            input.placeholder = '';
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
            input.placeholder = placeholder;
        });
        return input;
    };
    PageCreate.prototype.createNewDataListElement = function () {
        return {
            id: '',
            tvdbId: this.tvdbID,
            name_de: this.inputDE.value,
            name_en: this.inputEN.value,
            name_jpn: this.inputJPN.value,
            list: ListID.NOT_WATCHED,
            rank: 0,
            seasons: []
        };
    };
    return PageCreate;
}());
//# sourceMappingURL=PageCreate.js.map
var PageDetail = /** @class */ (function () {
    function PageDetail(pageElement, tabElement, serverData, editPage) {
        this.pageElement = pageElement;
        this.tabElement = tabElement;
        this.serverData = serverData;
        this.editPage = editPage;
        this.colorBrightness = Settings.colorBrightness;
        this.episodeCount = Settings.episodeCount;
        this.currentIndex = 0;
        this.seasonUrl = '';
        this.listElementMap = {};
        this.episodeList = [];
    }
    PageDetail.prototype.showElement = function () {
        this.showPage();
        this.activateTab();
    };
    PageDetail.prototype.hideElement = function () {
        this.hidePage();
        this.deactivateTab();
    };
    PageDetail.prototype.showPage = function () {
        this.renderPage(this.serverData.getListElement(this.currentIndex));
        this.pageElement.style.display = 'flex';
    };
    PageDetail.prototype.activateTab = function () {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    };
    PageDetail.prototype.hidePage = function () {
        this.pageElement.style.display = 'none';
    };
    PageDetail.prototype.deactivateTab = function () {
        this.tabElement.classList.remove('tab-active');
    };
    PageDetail.prototype.getPageElement = function () {
        return this.pageElement;
    };
    PageDetail.prototype.foreachListElement = function (callback, opt) {
    };
    PageDetail.prototype.getDataIndexList = function () {
    };
    PageDetail.prototype.getListId = function () {
    };
    PageDetail.prototype.getElementWithDataIndex = function (dataIndex) {
    };
    PageDetail.prototype.registerListElement = function (id, listElement) {
        this.listElementMap[id] = listElement;
    };
    PageDetail.prototype.initPage = function () {
        this.pageElement.innerHTML = '';
        this.thumbnail = PageDetail.createImg('', 'thumbnail');
        var instance = this;
        this.thumbnail.addEventListener('click', function () {
            window.open(instance.seasonUrl);
        });
        this.detailContainer = PageDetail.createDiv('detail-container');
        var thumbnailAndDetails = PageDetail.createDiv('big-thumbnail');
        thumbnailAndDetails.appendChild(this.thumbnail);
        var buttonContainer = this.generateButtonContainer();
        thumbnailAndDetails.appendChild(buttonContainer);
        var countContainer = this.generateCountCounainer();
        thumbnailAndDetails.appendChild(countContainer);
        var inputContainer = this.generateInputContainer();
        thumbnailAndDetails.appendChild(inputContainer);
        var jumpButton = this.generateJumpButton();
        thumbnailAndDetails.appendChild(jumpButton);
        thumbnailAndDetails.appendChild(this.generateInfoContainer());
        this.pageElement.appendChild(thumbnailAndDetails);
        this.pageElement.appendChild(this.detailContainer);
    };
    PageDetail.prototype.renderPage = function (data) {
        this.setFlags(data);
        this.episodeList = [];
        if (data.seasons.length !== 0) {
            this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
            this.seasonUrl = data.seasons[this.sIndex].url;
        }
        this.currentIndex = this.serverData.getIndexOfELement(data);
        this.pageNumberElement.innerHTML = (this.currentIndex + 1).toString();
        this.setInfoValues(data);
        this.renderDetailsContainer(data);
    };
    PageDetail.prototype.setFlags = function (data) {
        _a = ListElement.getIndicesAndCountOfFirstNotWatched(data), this.sIndex = _a[0], this.epIndex = _a[1], this.epCount = _a[2], this.maxCount = _a[3], this.success = _a[4];
        var _a;
    };
    PageDetail.prototype.renderDetailsContainer = function (data) {
        this.detailContainer.innerHTML = '';
        var titleContainer = this.generateTitleContainer(data);
        this.detailContainer.appendChild(titleContainer);
        var epCount = 0;
        for (var s = 0; s < data.seasons.length; s++) {
            this.detailContainer.appendChild(this.createSegment(s, epCount, data));
            epCount += data.seasons[s].episodes.length;
        }
    };
    PageDetail.prototype.generateTitleContainer = function (data) {
        var titleContainer = PageDetail.createDiv('title-container');
        var lang = PageDetail.calcTitleLang(data);
        var titleMain = this.generateMainTitle(data, lang);
        var titleDE = document.createElement('h5');
        titleDE.innerHTML = (data[TitleLang.DE] !== '') ? data[TitleLang.DE] : '-';
        var titleEN = document.createElement('h5');
        titleEN.innerHTML = (data[TitleLang.EN] !== '') ? data[TitleLang.EN] : '-';
        var titleJPN = document.createElement('h5');
        titleJPN.innerHTML = (data[TitleLang.JPN] !== '') ? data[TitleLang.JPN] : '-';
        var wrapper1;
        var wrapper2;
        var wrapperMain = PageDetail.generateTitleWrapper(lang, titleMain, 'main-title');
        switch (lang) {
            case TitleLang.DE:
                wrapper1 = PageDetail.generateTitleWrapper(TitleLang.EN, titleEN);
                wrapper2 = PageDetail.generateTitleWrapper(TitleLang.JPN, titleJPN);
                break;
            case TitleLang.EN:
                wrapper1 = PageDetail.generateTitleWrapper(TitleLang.DE, titleDE);
                wrapper2 = PageDetail.generateTitleWrapper(TitleLang.JPN, titleJPN);
                break;
            case TitleLang.JPN:
                wrapper1 = PageDetail.generateTitleWrapper(TitleLang.DE, titleDE);
                wrapper2 = PageDetail.generateTitleWrapper(TitleLang.EN, titleEN);
                break;
        }
        titleContainer.appendChild(wrapperMain);
        titleContainer.appendChild(wrapper1);
        titleContainer.appendChild(wrapper2);
        return titleContainer;
    };
    PageDetail.generateTitleWrapper = function (lang, append, token) {
        var container = PageDetail.createDiv('title-wrapper');
        if (token !== undefined) {
            container.classList.add(token);
        }
        var img;
        switch (lang) {
            case TitleLang.DE:
                img = PageDetail.createImg('img/germany.png', 'germany');
                break;
            case TitleLang.EN:
                img = PageDetail.createImg('img/uk.png', 'uk');
                break;
            case TitleLang.JPN:
                img = PageDetail.createImg('img/japan.png', 'japan');
                break;
        }
        container.appendChild(img);
        container.appendChild(append);
        return container;
    };
    PageDetail.prototype.generateMainTitle = function (data, lang) {
        var title = document.createElement('h1');
        if (data[lang] !== '') {
            title.innerHTML = data[lang];
        }
        var instance = this;
        title.addEventListener('click', function () {
            var listElement = instance.listElementMap[data.id];
            switch (listElement.getListId()) {
                case ListID.WATCHED:
                    slideToWatched();
                    break;
                case ListID.PLAYLIST:
                    slideToPlaylist();
                    break;
                case ListID.NOT_WATCHED:
                    slideToNotWatched();
                    break;
            }
            var height = listElement.getElement().offsetTop - 30;
            setTimeout(function () {
                window.scrollTo({
                    top: height,
                    behavior: 'smooth'
                });
            }, 120);
        });
        return title;
    };
    PageDetail.prototype.createSegment = function (sIndex, epCount, data) {
        var segment = PageDetail.createDiv('list-segment');
        var label = document.createElement('h2');
        label.innerHTML = 'Season ' + (sIndex + 1);
        var watchedSeason;
        if (PageDetail.checkSeasonWatched(sIndex, data)) {
            watchedSeason = PageDetail.createImg('img/watched.ico', 'watched');
        }
        else {
            watchedSeason = PageDetail.createImg('img/not-watched.ico', 'not-watched');
        }
        label.appendChild(watchedSeason);
        segment.appendChild(label);
        var epContainer = PageDetail.createDiv('episode-container');
        epContainer.classList.add('background-gray');
        var seasonElements = [];
        for (var ep = 0; ep < data.seasons[sIndex].episodes.length; ep++) {
            var _a = this.createEpisode(sIndex, ep, epCount + ep, data, watchedSeason), episode = _a[0], watchedButton = _a[1];
            epContainer.appendChild(episode);
            seasonElements.push([episode, watchedButton]);
        }
        var instance = this;
        watchedSeason.addEventListener('click', function () {
            var oldBool = PageDetail.checkSeasonWatched(sIndex, data);
            if (oldBool) {
                watchedSeason.src = 'img/not-watched.ico';
                watchedSeason.alt = 'not-watched';
            }
            else {
                watchedSeason.src = 'img/watched.ico';
                watchedSeason.alt = 'watched';
            }
            for (var ep = 0; ep < seasonElements.length; ep++) {
                PageDetail.setAttributes(!oldBool, seasonElements[ep][0], seasonElements[ep][1]);
                data.seasons[sIndex].episodes[ep].watched = !oldBool;
            }
            instance.updateInfo(data);
            instance.updateThumbnail(data);
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        segment.appendChild(epContainer);
        return segment;
    };
    PageDetail.checkSeasonWatched = function (sIndex, data) {
        for (var ep = 0; ep < data.seasons[sIndex].episodes.length; ep++) {
            if (!data.seasons[sIndex].episodes[ep].watched) {
                return false;
            }
        }
        return true;
    };
    PageDetail.prototype.createEpisode = function (sIndex, epIndex, epCount, data, watchedSeason) {
        var episode = PageDetail.createDiv('episode-detail');
        var _a = this.generateEpisodeButtons(sIndex, epIndex, data, episode, watchedSeason), buttonContainer = _a[0], watchedButton = _a[1];
        episode.appendChild(buttonContainer);
        var epLabel;
        if (this.episodeCount) {
            epLabel = PageDetail.generateEpisodeLabel(epCount, data.seasons[sIndex].episodes[epIndex].name);
        }
        else {
            epLabel = PageDetail.generateEpisodeLabel(epIndex, data.seasons[sIndex].episodes[epIndex].name);
        }
        episode.appendChild(epLabel);
        if (this.episodeList[sIndex] === undefined) {
            this.episodeList[sIndex] = [episode];
        }
        else {
            this.episodeList[sIndex].push(episode);
        }
        return [episode, watchedButton];
    };
    PageDetail.generateEpisodeLabel = function (epIndex, name) {
        var container = PageDetail.createDiv('episode-label');
        var prefix = document.createElement('p');
        prefix.classList.add('episode-prefix');
        prefix.innerHTML = 'Folge ' + (epIndex + 1);
        container.appendChild(prefix);
        var label = document.createElement('p');
        label.innerHTML = name;
        container.appendChild(label);
        return container;
    };
    PageDetail.prototype.generateEpisodeButtons = function (sIndex, epIndex, data, episode, watchedSeason) {
        var container = PageDetail.createDiv('episode-button-container');
        container.appendChild(this.playButton(sIndex, epIndex, data));
        var watchedButton = this.watchedButton(sIndex, epIndex, data, episode, watchedSeason);
        container.appendChild(watchedButton);
        return [container, watchedButton];
    };
    PageDetail.prototype.generateButtonContainer = function () {
        var container = PageDetail.createDiv('list-button-container');
        container.appendChild(this.arrowLeftButton());
        container.appendChild(this.editButton());
        container.appendChild(this.deleteButton());
        container.appendChild(this.arrowRightButton());
        return container;
    };
    PageDetail.prototype.playButton = function (sIndex, epIndex, data) {
        return ListElement.generateButton('img/play.ico', 'play', function () {
            window.open(data.seasons[sIndex].episodes[epIndex].url);
        });
    };
    PageDetail.prototype.watchedButton = function (sIndex, epIndex, data, episode, watchedSeason) {
        var watchedStatus = document.createElement('img');
        PageDetail.setAttributes(data.seasons[sIndex].episodes[epIndex].watched, episode, watchedStatus);
        var instance = this;
        watchedStatus.addEventListener('click', function () {
            var oldBool = data.seasons[sIndex].episodes[epIndex].watched;
            data.seasons[sIndex].episodes[epIndex].watched = !oldBool;
            PageDetail.setAttributes(!oldBool, episode, watchedStatus);
            instance.updateInfo(data);
            instance.updateThumbnail(data);
            PageDetail.updateWatchedSeason(watchedSeason, data, sIndex);
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        return watchedStatus;
    };
    PageDetail.setAttributes = function (bool, episode, watchedStatus) {
        if (bool) {
            watchedStatus.src = 'img/watched.ico';
            watchedStatus.alt = 'watched';
            episode.classList.remove('font-green');
            episode.classList.add('font-lighter-green');
        }
        else {
            watchedStatus.src = 'img/not-watched.ico';
            watchedStatus.alt = 'not-watched';
            episode.classList.remove('font-lighter-green');
            episode.classList.add('font-green');
        }
    };
    PageDetail.prototype.updateInfo = function (data) {
        this.setFlags(data);
        this.setInfoValues(data);
    };
    PageDetail.prototype.updateThumbnail = function (data) {
        this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
        this.seasonUrl = data.seasons[this.sIndex].url;
    };
    PageDetail.updateWatchedSeason = function (watchedSeason, data, sIndex) {
        if (PageDetail.checkSeasonWatched(sIndex, data)) {
            watchedSeason.src = 'img/watched.ico';
            watchedSeason.alt = 'watched';
        }
        else {
            watchedSeason.src = 'img/not-watched.ico';
            watchedSeason.alt = 'not-watched';
        }
    };
    PageDetail.prototype.arrowLeftButton = function () {
        var instance = this;
        return ListElement.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            if (instance.currentIndex > 0) {
                instance.currentIndex--;
            }
            else {
                instance.currentIndex = instance.serverData.getListLen() - 1;
            }
            var data = instance.serverData.getListElement(instance.currentIndex);
            instance.renderPage(data);
        });
    };
    PageDetail.prototype.arrowRightButton = function () {
        var instance = this;
        return ListElement.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            if (instance.currentIndex + 1 < instance.serverData.getListLen()) {
                instance.currentIndex++;
            }
            else {
                instance.currentIndex = 0;
            }
            var data = instance.serverData.getListElement(instance.currentIndex);
            instance.renderPage(data);
        });
    };
    PageDetail.prototype.editButton = function () {
        var instance = this;
        return ListElement.generateButton('img/edit.ico', 'edit', function () {
            var data = instance.serverData.getListElement(instance.currentIndex);
            instance.editPage.renderPage(data);
            slideToEdit();
            setTimeout(function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 120);
        });
    };
    PageDetail.prototype.deleteButton = function () {
        var instance = this;
        return ListElement.generateButton('img/delete.ico', 'delete', function () {
            //TODO: delete detail
        });
    };
    PageDetail.prototype.generateCountCounainer = function () {
        var container = PageDetail.createDiv('page-count');
        var right = PageDetail.createDiv('align-right');
        var count = document.createElement('p');
        right.appendChild(count);
        this.pageNumberElement = count;
        container.appendChild(right);
        var node = document.createElement('p');
        node.innerHTML = 'von';
        container.appendChild(node);
        var left = PageDetail.createDiv('align-left');
        var maxCount = document.createElement('p');
        maxCount.innerHTML = this.serverData.getListLen().toString();
        left.appendChild(maxCount);
        container.appendChild(left);
        return container;
    };
    PageDetail.prototype.generateInputContainer = function () {
        var container = PageDetail.createDiv('input-container');
        var label = document.createElement('label');
        label.htmlFor = 'search-textfield';
        label.innerHTML = 'Suche:';
        container.appendChild(label);
        var input = document.createElement('input');
        input.id = 'search-textfield';
        input.type = 'search';
        input.setAttribute('list', 'all-names');
        var instance = this;
        input.addEventListener('keypress', function (ev) {
            if (ev.key !== 'Enter') {
                return;
            }
            var index = instance.serverData.getIndexOfElementWithName(ev.target.value);
            if (index === -1) {
                return;
            }
            instance.renderPage(instance.serverData.getListElement(index));
        });
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        container.appendChild(input);
        var dataList = document.createElement('dataList');
        dataList.id = 'all-names';
        this.fillWithOptions(dataList);
        container.appendChild(dataList);
        return container;
    };
    PageDetail.prototype.fillWithOptions = function (dataList) {
        var list = this.serverData.getSortedListWithNames();
        for (var i = 0; i < list.length; i++) {
            var option = document.createElement('option');
            option.innerHTML = list[i];
            dataList.appendChild(option);
        }
    };
    PageDetail.prototype.generateInfoContainer = function () {
        var container = PageDetail.createDiv('info-container');
        var label = document.createElement('h3');
        label.innerHTML = 'Details';
        container.appendChild(label);
        var standard = document.createElement('div');
        var _a = PageDetail.generateInfoWrapper('Liste', ''), infoList = _a[0], p1 = _a[1];
        var _b = PageDetail.generateInfoWrapper('Fortschritt', ''), infoProgress = _b[0], p2 = _b[1];
        var _c = PageDetail.generateInfoWrapper('Bereits geschaut', ''), infoWatched = _c[0], p3 = _c[1];
        var _d = PageDetail.generateInfoWrapper('Noch nicht geschaut', ''), infoNotWatched = _d[0], p4 = _d[1];
        var _e = PageDetail.generateInfoWrapper('# Folgen insgesamt', ''), infoMaxAmount = _e[0], p5 = _e[1];
        p2.classList.add('info-progress');
        this.infoList = p1;
        this.infoProgress = p2;
        this.infoWatched = p3;
        this.infoNotWatched = p4;
        this.infoMaxAmount = p5;
        standard.appendChild(infoList);
        standard.appendChild(infoProgress);
        standard.appendChild(infoWatched);
        standard.appendChild(infoNotWatched);
        standard.appendChild(infoMaxAmount);
        container.appendChild(standard);
        this.infoSeasonContainer = PageDetail.createDiv('info-episodes-per-season');
        container.appendChild(this.infoSeasonContainer);
        return container;
    };
    PageDetail.prototype.setInfoListValue = function (list) {
        switch (list) {
            case ListID.WATCHED:
                this.infoList.innerHTML = 'Fertig gesehen';
                break;
            case ListID.PLAYLIST:
                this.infoList.innerHTML = 'Aktuelle Playlist';
                break;
            case ListID.NOT_WATCHED:
                this.infoList.innerHTML = 'Noch nicht gesehen';
                break;
        }
    };
    PageDetail.prototype.setInfoValues = function (data) {
        var count = 0;
        this.infoSeasonContainer.innerHTML = '';
        for (var s = 0; s < data.seasons.length; s++) {
            var countPerSeason = 0;
            for (var ep = 0; ep < data.seasons[s].episodes.length; ep++) {
                if (data.seasons[s].episodes[ep].watched) {
                    count++;
                }
                countPerSeason++;
            }
            var label = '# Folgen Season ' + (s + 1);
            this.infoSeasonContainer.appendChild(PageDetail.generateInfoWrapper(label, countPerSeason.toString())[0]);
        }
        var result = ((count / this.maxCount) * 100).toFixed(1);
        if (isNaN(Number(result))) {
            this.infoProgress.innerHTML = result;
        }
        else {
            this.infoProgress.innerHTML = result + '%';
        }
        var _a = this.calculateColor(parseFloat(result)), r = _a[0], g = _a[1];
        this.infoProgress.style.color = 'rgb(' + r + ', ' + g + ', 0)';
        this.infoNotWatched.innerHTML = (this.maxCount - count).toString();
        this.infoWatched.innerHTML = count.toString();
        this.setInfoListValue(data.list);
        this.infoMaxAmount.innerHTML = this.maxCount.toString();
    };
    PageDetail.generateInfoWrapper = function (label, value) {
        var wrapper = PageDetail.createDiv('info-wrapper');
        var labelElement = document.createElement('p');
        labelElement.innerHTML = label;
        wrapper.appendChild(labelElement);
        var p = document.createElement('p');
        p.innerHTML = value;
        wrapper.appendChild(p);
        return [wrapper, p];
    };
    PageDetail.createImg = function (src, alt) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        return img;
    };
    PageDetail.createDiv = function (str) {
        var div = document.createElement('div');
        div.classList.add(str);
        return div;
    };
    PageDetail.prototype.calculateColor = function (result) {
        if (isNaN(result)) {
            return [this.colorBrightness, 0];
        }
        var r, g;
        if (result <= 50) {
            r = this.colorBrightness;
            g = (result / 50) * this.colorBrightness;
        }
        else {
            r = ((100 - result) / 50) * this.colorBrightness;
            g = this.colorBrightness;
        }
        return [r, g];
    };
    PageDetail.prototype.generateJumpButton = function () {
        var container = PageDetail.createDiv('jump-button-container');
        var button = PageDetail.createDiv('custom-button');
        button.classList.add('button-green');
        button.innerHTML = 'Zur aktuellen Folge';
        var instance = this;
        button.addEventListener('click', function () {
            var firstNotWatched = instance.episodeList[instance.sIndex][instance.epIndex];
            var height = firstNotWatched.offsetTop - 30;
            window.scrollTo({
                top: height,
                behavior: 'smooth'
            });
        });
        container.appendChild(button);
        return container;
    };
    PageDetail.calcTitleLang = function (data) {
        if (data[Settings.titleLanguage] !== '') {
            return Settings.titleLanguage;
        }
        if (data[TitleLang.DE] !== '') {
            return TitleLang.DE;
        }
        if (data[TitleLang.EN] !== '') {
            return TitleLang.EN;
        }
        if (data[TitleLang.JPN] !== '') {
            return TitleLang.JPN;
        }
    };
    return PageDetail;
}());
//# sourceMappingURL=PageDetail.js.map
var PageEdit = /** @class */ (function () {
    function PageEdit(pageElement, tabElement, serverData) {
        this.pageElement = pageElement;
        this.tabElement = tabElement;
        this.serverData = serverData;
        this.episodeCount = Settings.episodeCount;
        this.inputElementList = [];
    }
    PageEdit.prototype.activateTab = function () {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    };
    PageEdit.prototype.deactivateTab = function () {
        this.tabElement.classList.remove('tab-active');
    };
    PageEdit.prototype.getPageElement = function () {
        return this.pageElement;
    };
    PageEdit.prototype.hidePage = function () {
        this.pageElement.style.display = 'none';
    };
    PageEdit.prototype.showPage = function () {
        this.pageElement.style.display = 'block';
    };
    PageEdit.prototype.foreachListElement = function (callback, opt) {
    };
    PageEdit.prototype.getDataIndexList = function () {
    };
    PageEdit.prototype.getElementWithDataIndex = function (dataIndex) {
    };
    PageEdit.prototype.getListId = function () {
    };
    PageEdit.prototype.hideElement = function () {
        this.hidePage();
        this.deactivateTab();
    };
    PageEdit.prototype.showElement = function () {
        this.showPage();
        this.activateTab();
    };
    PageEdit.prototype.initPage = function () {
        if (this.oldData !== undefined) {
            return;
        }
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(PageCreate.createDiv(['edit-no-data'], [
            PageEdit.generateText('h1', 'Keine Serie zum Bearbeiten ausgewählt')
        ]));
    };
    PageEdit.prototype.renderPage = function (data) {
        this.oldData = data;
        this.newData = {
            id: this.oldData.id,
            tvdbId: this.oldData.tvdbId,
            name_de: this.oldData.name_de,
            name_en: this.oldData.name_en,
            name_jpn: this.oldData.name_jpn,
            list: this.oldData.list,
            rank: this.oldData.rank,
            seasons: []
        };
        this.inputElementList = [];
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(this.generateTitleContainer());
        this.pageElement.appendChild(this.generateGeneralEditTools());
        this.pageElement.appendChild(this.generateErrMsgContainer());
        this.pageElement.appendChild(this.generateSeasonsContainer());
    };
    PageEdit.prototype.generateErrMsgContainer = function () {
        this.errMsg = PageCreate.createDiv(['create-msg-container', 'edit-msg-container']);
        return PageCreate.createDiv(['edit-msg-wrapper'], [this.errMsg]);
    };
    PageEdit.prototype.generateSeasonsContainer = function () {
        this.seasonContainer = PageCreate.createDiv(['edit-season-container']);
        for (var s = 0; s < this.oldData.seasons.length; s++) {
            var epContainer = this.appendSeason(this.oldData.seasons[s].url, this.oldData.seasons[s].thumbnail);
            for (var ep = 0; ep < this.oldData.seasons[s].episodes.length; ep++) {
                var name_1 = this.oldData.seasons[s].episodes[ep].name;
                var url = this.oldData.seasons[s].episodes[ep].url;
                var watched_1 = this.oldData.seasons[s].episodes[ep].watched;
                this.appendEpisode(epContainer, name_1, url, s, watched_1);
            }
        }
        return this.seasonContainer;
    };
    PageEdit.prototype.generateTitleContainer = function () {
        var nameDE = (this.oldData.name_de === '') ? '-' : this.oldData.name_de;
        var nameEN = (this.oldData.name_en === '') ? '-' : this.oldData.name_en;
        var nameJPN = (this.oldData.name_jpn === '') ? '-' : this.oldData.name_jpn;
        return PageCreate.createDiv(['title-container-edit'], [
            PageCreate.createDiv(['title-wrapper'], [
                PageDetail.createImg('img/germany.png', 'germany'),
                PageEdit.generateText('h1', nameDE)
            ]),
            PageCreate.createDiv(['title-wrapper'], [
                PageDetail.createImg('img/uk.png', 'uk'),
                PageEdit.generateText('h1', nameEN)
            ]),
            PageCreate.createDiv(['title-wrapper'], [
                PageDetail.createImg('img/japan.png', 'japan'),
                PageEdit.generateText('h1', nameJPN)
            ]),
            this.createButtonContainer()
        ]);
    };
    PageEdit.generateText = function (tag, text) {
        var element = document.createElement(tag);
        element.innerHTML = text;
        return element;
    };
    PageEdit.prototype.createButtonContainer = function () {
        var instance = this;
        var save = PageCreate.createDiv(['custom-button', 'button-green']);
        save.innerHTML = 'Speichern';
        save.addEventListener('click', function () {
            instance.resetErrMsg();
            instance.createNewData();
            instance.serverData.put([instance.newData], function () {
                setTimeout(reloadAllData, 400);
                instance.errMsg.innerHTML = 'Gespeichert!';
                instance.errMsg.classList.add('create-msg-success');
            });
        });
        var revert = PageCreate.createDiv(['custom-button', 'button-red']);
        revert.innerHTML = 'Verwerfen';
        revert.addEventListener('click', function () {
            instance.resetErrMsg();
            setTimeout(function () {
                instance.errMsg.innerHTML = 'Änderungen zurückgesetzt!';
                instance.errMsg.classList.add('create-msg-success');
            }, 100);
            instance.renderPage(instance.oldData);
        });
        return PageCreate.createDiv(['button-wrapper-edit'], [save, revert]);
    };
    PageEdit.prototype.createNewData = function () {
        this.newData.seasons = [];
        for (var s = 0; s < this.inputElementList.length; s++) {
            this.newData.seasons.push({
                url: this.inputElementList[s].url.value,
                thumbnail: this.inputElementList[s].thumbnail.value,
                episodes: []
            });
            for (var ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                var name_2 = this.inputElementList[s].episodes[ep].name.value.replace(/"/g, '\'');
                this.newData.seasons[s].episodes.push({
                    name: name_2,
                    url: this.inputElementList[s].episodes[ep].url.value,
                    watched: this.inputElementList[s].episodes[ep].watched
                });
            }
        }
    };
    PageEdit.prototype.generateGeneralEditTools = function () {
        var instance = this;
        this.loadingSpinner = PageCreate.createDiv(['spinner'], [
            PageCreate.createDiv(['bounce1']),
            PageCreate.createDiv(['bounce2']),
            PageCreate.createDiv(['bounce3'])
        ]);
        this.zerosS = PageEdit.createInputNum('0', 'generic-fill-zero-s');
        this.zerosEp = PageEdit.createInputNum('0', 'generic-fill-zero-ep');
        this.startS = PageEdit.createInputNum('1', 'generic-startS');
        this.startEp = PageEdit.createInputNum('1', 'generic-startEp');
        this.stopS = PageEdit.createInputNum('1', 'generic-stopS');
        this.stopEp = PageEdit.createInputNum('1', 'generic-stopEp');
        var radioEp = this.createInputRadio('generic-mode-ep', '1', true);
        radioEp.checked = true;
        var radioSEp = this.createInputRadio('generic-mode-s-ep', '2', false);
        this.genUrl = PageEdit.createInputText('Generische Url mit {{s}}, {{ep}}');
        return PageCreate.createDiv(['edit-tools'], [
            PageCreate.createDiv(['generic-url-container'], [
                PageCreate.createDiv(['edit-wrapper'], [
                    this.createButton('button-green', 'TVDB Daten laden', function () {
                        instance.buttonFillWithTvdbData();
                    })
                ]),
                PageCreate.createDiv(['edit-wrapper', 'loading-container'], [
                    this.loadingSpinner
                ])
            ]),
            this.createAddSeasonAction(),
            PageCreate.createDiv(['generic-url-container', 'edit-grow'], [
                PageCreate.createDiv(['edit-wrapper'], [
                    this.createButton('button-silver', 'Los', function () {
                        instance.buttonFillWithGenericUrls();
                    }),
                    this.genUrl
                ]),
                PageCreate.createDiv(['edit-wrapper'], [
                    PageCreate.createDiv(['generic-url-container'], [
                        PageCreate.createDiv([], [
                            radioEp,
                            PageEdit.createLabel('generic-mode-ep', 'Nicht neu zählen')
                        ]),
                        PageCreate.createDiv([], [
                            radioSEp,
                            PageEdit.createLabel('generic-mode-s-ep', 'In jeder Season neu zählen')
                        ]),
                    ]),
                    PageCreate.createDiv(['edit-wrapper'], [
                        this.zerosS,
                        PageEdit.createLabel('generic-fill-zero-s', 'Stellen Season')
                    ]),
                    PageCreate.createDiv(['edit-wrapper'], [
                        this.zerosEp,
                        PageEdit.createLabel('generic-fill-zero-ep', 'Stellen Episode')
                    ])
                ])
            ]),
            PageCreate.createDiv(['generic-url-container'], [
                this.createStartInput(),
                this.createStopInput()
            ]),
        ]);
    };
    PageEdit.prototype.createStartInput = function () {
        if (this.episodeCount) {
            return PageCreate.createDiv(['edit-wrapper'], [
                PageEdit.createLabel('generic-startEp', 'Von ep'),
                this.startEp
            ]);
        }
        return PageCreate.createDiv(['edit-wrapper'], [
            PageEdit.createLabel('generic-startS', 'Von s'),
            this.startS,
            PageEdit.createLabel('generic-startEp', 'ep'),
            this.startEp
        ]);
    };
    PageEdit.prototype.createStopInput = function () {
        if (this.episodeCount) {
            return PageCreate.createDiv(['edit-wrapper', 'edit-wrapper-end'], [
                PageEdit.createLabel('generic-stopEp', 'Bis ep'),
                this.stopEp
            ]);
        }
        return PageCreate.createDiv(['edit-wrapper', 'edit-wrapper-end'], [
            PageEdit.createLabel('generic-stopS', 'Bis s'),
            this.stopS,
            PageEdit.createLabel('generic-stopEp', 'ep'),
            this.stopEp
        ]);
    };
    PageEdit.prototype.createButton = function (token, label, callback) {
        var button = PageCreate.createDiv(['custom-button', token]);
        button.innerHTML = label;
        button.addEventListener('click', function () {
            callback();
        });
        return button;
    };
    PageEdit.prototype.resetErrMsg = function () {
        this.errMsg.innerHTML = '';
        this.errMsg.classList.remove('create-msg-success');
        this.errMsg.classList.remove('create-msg-error');
    };
    PageEdit.prototype.buttonFillWithTvdbData = function () {
        this.resetErrMsg();
        if (this.oldData.tvdbId === -1) {
            this.errMsg.innerHTML = 'Keine TVDB ID für diese Serie vergeben!';
            this.errMsg.classList.add('create-msg-error');
            return;
        }
        this.loadingSpinner.style.visibility = 'visible';
        var instance = this;
        TVDB.getEpisodes(this.oldData.tvdbId, function (resObj) {
            if (resObj.error !== undefined) {
                instance.errMsg.innerHTML = 'Error: ' + resObj.error;
                instance.errMsg.classList.add('create-msg-error');
                return;
            }
            if (resObj.response === undefined) {
                return;
            }
            instance.fillNameInputsWithData(resObj.response);
            instance.errMsg.innerHTML = '(1/2) Episoden ergänzt...';
            TVDB.getImages(instance.oldData.tvdbId, function (resObj) {
                if (resObj.error !== undefined) {
                    instance.errMsg.innerHTML = 'Error: ' + resObj.error;
                    instance.errMsg.classList.add('create-msg-error');
                    return;
                }
                if (resObj.response === undefined) {
                    return;
                }
                instance.fillThumbnailsWithData(resObj.response);
                instance.loadingSpinner.style.visibility = 'hidden';
                instance.errMsg.innerHTML = '(2/2) Thumbnails ergänzt!';
                instance.errMsg.classList.add('create-msg-success');
            });
        });
    };
    PageEdit.prototype.fillThumbnailsWithData = function (data) {
        for (var s = 1; s < this.inputElementList.length + 1; s++) {
            if (data[s] !== undefined && this.inputElementList[s - 1] !== undefined) {
                this.inputElementList[s - 1].thumbnail.value = data[s];
            }
        }
    };
    PageEdit.prototype.fillNameInputsWithData = function (data) {
        for (var s = 1; s < Object.keys(data).length + 1; s++) {
            if (data[s] !== undefined) {
                var epContainer = void 0;
                if (this.inputElementList.length < s) {
                    epContainer = this.appendSeason('', '');
                }
                else {
                    epContainer = this.seasonContainer.children[s - 1].lastChild;
                }
                for (var ep = 1; ep < Object.keys(data[s]).length + 1; ep++) {
                    if (this.inputElementList[s - 1].episodes.length < ep) {
                        this.appendEpisode(epContainer, data[s][ep], '', s - 1, false);
                    }
                    else {
                        if (this.inputElementList[s - 1].episodes[ep - 1].name.value === '') {
                            this.inputElementList[s - 1].episodes[ep - 1].name.value = data[s][ep];
                        }
                    }
                }
            }
        }
        // if(data[0] !== undefined) {
        //     let epContainer = this.appendSeason('', '');
        //     for (let ep = 1; ep < Object.keys(data[0]).length+1; ep++) {
        //         this.appendEpisode(epContainer, data[0][ep], '', Object.keys(data).length-1, false);
        //     }
        // }
    };
    PageEdit.prototype.buttonAppendSeason = function (numEpisodes) {
        var container = this.appendSeason('', '');
        for (var i = 0; i < numEpisodes; i++) {
            this.appendEpisode(container, '', '', this.inputElementList.length - 1, false);
        }
    };
    PageEdit.prototype.appendSeason = function (url, thumbnail) {
        var instance = this;
        var episodesContainer = PageCreate.createDiv(['edit-episodes-container', 'background-gray']);
        var urlInput = PageEdit.createInputText('Url Weiterleitung', url);
        var thumbnailInput = PageEdit.createInputText('Thumbnail', thumbnail);
        var label = PageEdit.generateText('h2', 'Season ' + (this.inputElementList.length + 1));
        var seasonObj = {
            label: label,
            url: urlInput,
            thumbnail: thumbnailInput,
            episodes: []
        };
        this.inputElementList.push(seasonObj);
        var close = PageDetail.createImg('img/close.ico', 'delete');
        close.addEventListener('click', function () {
            instance.seasonContainer.removeChild(season);
            var sIndex = instance.inputElementList.indexOf(seasonObj);
            instance.inputElementList.splice(sIndex, 1);
            for (var s = 0; s < instance.inputElementList.length; s++) {
                instance.inputElementList[s].label.innerHTML = 'Season ' + (s + 1);
            }
            if (instance.episodeCount) {
                instance.updateStopValuesOnlyEp();
            }
            else {
                instance.updateStopValues();
            }
            instance.updateEpLabels(sIndex);
        });
        var numEpisode = PageEdit.createInputNum('1');
        var addEpisode = this.createButton('button-silver', 'Episoden hinzufügen', function () {
            var num = parseInt(numEpisode.value);
            for (var i = 0; i < num; i++) {
                instance.appendEpisode(episodesContainer, '', '', instance.inputElementList.indexOf(seasonObj), false);
            }
        });
        var season = PageCreate.createDiv(['edit-season'], [
            PageCreate.createDiv(['season-header-wrapper'], [
                PageCreate.createDiv(['add-episodes-wrapper', 'edit-img-button'], [
                    close,
                    label
                ]),
                PageCreate.createDiv(['add-episodes-wrapper'], [
                    numEpisode,
                    addEpisode
                ])
            ]),
            PageCreate.createDiv(['input-wrapper'], [
                urlInput,
                thumbnailInput
            ]),
            episodesContainer
        ]);
        this.seasonContainer.appendChild(season);
        return episodesContainer;
    };
    PageEdit.prototype.appendEpisode = function (container, name, url, sIndex, watched) {
        var instance = this;
        var sObj = this.inputElementList[sIndex];
        var close = PageDetail.createImg('img/close.ico', 'delete');
        close.addEventListener('click', function () {
            container.removeChild(episode);
            sObj.episodes.splice(sObj.episodes.indexOf(epObj), 1);
            for (var ep = 0; ep < sObj.episodes.length; ep++) {
                sObj.episodes[ep].label.innerHTML = 'Folge ' + (ep + 1);
            }
            if (instance.episodeCount) {
                instance.updateStopValuesOnlyEp();
            }
            else {
                instance.updateStopValues();
            }
            instance.updateEpLabels(sIndex);
        });
        var label = PageEdit.generateText('p', 'Folge ' + (this.inputElementList[sIndex].episodes.length + 1));
        var nameInput = PageEdit.createInputText('Name', name);
        var urlInput = PageEdit.createInputText('Url', url);
        var episode = PageCreate.createDiv(['edit-episode', 'font-green'], [
            close, label, nameInput, urlInput
        ]);
        container.appendChild(episode);
        var epObj = {
            label: label,
            url: urlInput,
            name: nameInput,
            watched: watched
        };
        sObj.episodes.push(epObj);
        if (this.episodeCount) {
            this.updateStopValuesOnlyEp();
        }
        else {
            this.updateStopValues();
        }
        this.updateEpLabels(sIndex);
    };
    PageEdit.prototype.updateStopValuesOnlyEp = function () {
        var count = 0;
        for (var s = 0; s < this.inputElementList.length; s++) {
            for (var ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                count++;
            }
        }
        this.stopEp.value = count.toString();
    };
    PageEdit.prototype.updateStopValues = function () {
        var sMax = 1;
        for (var s = this.inputElementList.length - 1; s > -1; s--) {
            if (this.inputElementList[s].episodes.length > 0) {
                sMax = s + 1;
                break;
            }
        }
        this.stopS.value = sMax.toString();
        if (this.inputElementList[sMax - 1] !== undefined) {
            this.stopEp.value = this.inputElementList[sMax - 1].episodes.length.toString();
        }
        else {
            this.stopEp.value = '1';
        }
    };
    PageEdit.prototype.updateEpLabels = function (sIndex) {
        if (!this.episodeCount) {
            return;
        }
        var epCount = 0;
        for (var s = 0; s < sIndex; s++) {
            epCount += this.inputElementList[s].episodes.length;
        }
        for (var s = sIndex; s < this.inputElementList.length; s++) {
            for (var ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                epCount++;
                this.inputElementList[s].episodes[ep].label.innerHTML = 'Folge ' + epCount;
            }
        }
    };
    PageEdit.prototype.buttonFillWithGenericUrls = function () {
        this.resetErrMsg();
        var startS, stopS, startEp, stopEp;
        if (this.episodeCount) {
            _a = this.calcStartStopValues(), startS = _a[0], stopS = _a[1], startEp = _a[2], stopEp = _a[3];
        }
        else {
            startS = parseInt(this.startS.value) - 1;
            stopS = parseInt(this.stopS.value) - 1;
            startEp = parseInt(this.startEp.value) - 1;
            stopEp = parseInt(this.stopEp.value) - 1;
        }
        var count = 0;
        var flag = false;
        for (var s = 0; s < this.inputElementList.length; s++) {
            for (var ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                count++;
                if (s === startS && ep === startEp) {
                    flag = true;
                }
                if (flag) {
                    var realEp = void 0;
                    if (this.genericMode === '1') {
                        realEp = PageEdit.appendZeros(count.toString(), parseInt(this.zerosEp.value));
                    }
                    else {
                        realEp = PageEdit.appendZeros((ep + 1).toString(), parseInt(this.zerosEp.value));
                    }
                    var url = this.genUrl.value.replace(/{{s}}/g, PageEdit.appendZeros((s + 1).toString(), parseInt(this.zerosS.value)));
                    url = url.replace(/{{ep}}/g, realEp);
                    if (this.inputElementList[s].episodes[ep].url.value === '') {
                        this.inputElementList[s].episodes[ep].url.value = url;
                    }
                }
                if (s === stopS && ep === stopEp) {
                    flag = false;
                }
            }
        }
        this.errMsg.innerHTML = 'Urls generiert!';
        this.errMsg.classList.add('create-msg-success');
        var _a;
    };
    PageEdit.prototype.calcStartStopValues = function () {
        var startS = 0, stopS = 0, startEp = 0, stopEp = 0, count = 0;
        for (var s = 0; s < this.inputElementList.length; s++) {
            for (var ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                count++;
                if (count === parseInt(this.startEp.value)) {
                    startS = s;
                    startEp = ep;
                }
                if (count === parseInt(this.stopEp.value)) {
                    stopS = s;
                    stopEp = ep;
                }
            }
        }
        return [startS, stopS, startEp, stopEp];
    };
    PageEdit.appendZeros = function (str, numZeros) {
        var zeros = '';
        for (var i = 0; i < numZeros - str.length; i++) {
            zeros += '0';
        }
        return zeros + str;
    };
    PageEdit.prototype.createAddSeasonAction = function () {
        var instance = this;
        var inputS = PageEdit.createInputNum('1');
        var inputEp = PageEdit.createInputNum('1', 'episodes-per-seasons');
        var button = this.createButton('button-silver', 'Seasons hinzufügen', function () {
            for (var i = 0; i < parseInt(inputS.value); i++) {
                instance.buttonAppendSeason(parseInt(inputEp.value));
            }
        });
        var label = PageEdit.createLabel('episodes-per-seasons', 'Episoden pro Season');
        return PageCreate.createDiv(['generic-url-container'], [
            PageCreate.createDiv(['edit-wrapper'], [inputS, button]),
            PageCreate.createDiv(['edit-wrapper'], [inputEp, label])
        ]);
    };
    PageEdit.createInputNum = function (min, id) {
        var input = document.createElement('input');
        input.classList.add('edit-input');
        input.classList.add('edit-number');
        input.type = 'number';
        input.min = min;
        input.value = min;
        if (id !== undefined) {
            input.id = id;
        }
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        return input;
    };
    PageEdit.createLabel = function (htmlFor, text) {
        var label = PageEdit.generateText('label', text);
        label.setAttribute('for', htmlFor);
        return label;
    };
    PageEdit.prototype.createInputRadio = function (id, value, checked) {
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'generate-mode';
        input.id = id;
        input.value = value;
        input.checked = checked;
        if (checked) {
            this.genericMode = value;
        }
        var instance = this;
        input.addEventListener('click', function () {
            input.checked = true;
            instance.genericMode = input.value;
        });
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        return input;
    };
    PageEdit.createInputText = function (placeholder, value) {
        var input = document.createElement('input');
        input.type = 'text';
        input.classList.add('edit-input');
        input.classList.add('edit-text');
        input.placeholder = placeholder;
        if (value !== undefined) {
            input.value = value;
        }
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
            input.placeholder = '';
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
            input.placeholder = placeholder;
        });
        return input;
    };
    return PageEdit;
}());
//# sourceMappingURL=PageEdit.js.map
var PageList = /** @class */ (function () {
    function PageList(listID, pageElement, tabElement, serverData, detailPage, editPage) {
        this.listID = listID;
        this.pageElement = pageElement;
        this.tabElement = tabElement;
        this.serverData = serverData;
        this.detailPage = detailPage;
        this.editPage = editPage;
    }
    PageList.prototype.showElement = function () {
        this.showPage();
        this.activateTab();
    };
    PageList.prototype.hideElement = function () {
        this.hidePage();
        this.deactivateTab();
    };
    PageList.prototype.showPage = function () {
        this.pageElement.style.display = 'block';
    };
    PageList.prototype.activateTab = function () {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    };
    PageList.prototype.hidePage = function () {
        this.pageElement.style.display = 'none';
    };
    PageList.prototype.deactivateTab = function () {
        this.tabElement.classList.remove('tab-active');
    };
    PageList.prototype.getPageElement = function () {
        return this.pageElement;
    };
    PageList.prototype.foreachListElement = function (callback) {
        for (var key in this.dataList) {
            for (var i = 0; i < this.dataList[key].length; i++) {
                callback(this.dataList[key][i]);
            }
        }
    };
    PageList.prototype.getDataIndexList = function () {
        var list = [];
        this.foreachListElement(function (element) {
            list.push(element.getDataIndex());
        });
        return list;
    };
    PageList.prototype.getListId = function () {
        return this.listID;
    };
    PageList.prototype.getElementWithDataIndex = function (dataIndex) {
        var elementWithDataIndex = undefined;
        this.foreachListElement(function (element) {
            if (element.getDataIndex() === dataIndex) {
                elementWithDataIndex = element;
            }
        });
        return elementWithDataIndex;
    };
    PageList.prototype.generateMap = function () {
        this.dataList = {};
        var indexList = this.serverData.getIndexList(this.listID);
        for (var i = 0; i < indexList.length; i++) {
            var element = this.serverData.getListElement(indexList[i]);
            var firstChar = element[PageDetail.calcTitleLang(element)].charAt(0).toUpperCase();
            var listElement = new ListElement(indexList[i], this.serverData, this.detailPage, this, this.editPage);
            if (this.dataList[firstChar] === undefined) {
                this.dataList[firstChar] = [listElement];
            }
            else {
                this.dataList[firstChar].push(listElement);
            }
            this.detailPage.registerListElement(element.id, listElement);
        }
    };
    PageList.prototype.renderList = function () {
        this.pageElement.innerHTML = '';
        for (var key in this.dataList) {
            this.pageElement.appendChild(this.generateSegment(key));
        }
    };
    PageList.prototype.generateSegment = function (key) {
        var segment = document.createElement('div');
        segment.classList.add('list-segment');
        var segmentLabel = document.createElement('h2');
        segmentLabel.classList.add('font-white');
        segmentLabel.innerHTML = key;
        segment.appendChild(segmentLabel);
        var listContainer = document.createElement('div');
        listContainer.classList.add('list-container');
        for (var i = 0; i < this.dataList[key].length; i++) {
            this.dataList[key][i].generateNewElement();
            listContainer.appendChild(this.dataList[key][i].getElement());
        }
        segment.appendChild(listContainer);
        return segment;
    };
    return PageList;
}());
//# sourceMappingURL=PageList.js.map
var PageOptions = /** @class */ (function () {
    function PageOptions(opacityLayer, optionContainer, serverData) {
        this.opacityLayer = opacityLayer;
        this.optionContainer = optionContainer;
        this.serverData = serverData;
        this.arrowActionIsActive = false;
        this.changedDataList = [];
        this.inputFieldValue = 0;
        this.showSettingsFlag = false;
        var instance = this;
        this.opacityLayer.addEventListener('click', function () {
            slideCloseOptions(instance.optionContainer);
            instance.hideElement();
        });
        this.pageSettings = new PageSettings(this.serverData);
    }
    PageOptions.prototype.showElement = function () {
        this.opacityLayer.style.visibility = 'visible';
    };
    PageOptions.prototype.hideElement = function () {
        this.opacityLayer.style.visibility = 'hidden';
    };
    PageOptions.prototype.getOptionContainer = function () {
        return this.optionContainer;
    };
    PageOptions.prototype.renderPage = function (activePage, activeFlag) {
        this.optionContainer.innerHTML = '';
        this.activePage = activePage;
        if (this.showSettingsFlag) {
            this.renderSettings();
            return;
        }
        if (activeFlag === 2) {
            this.renderForPlayList();
        }
        else if (activeFlag === 1) {
            this.renderForWatched();
        }
        else if (activeFlag === 3) {
            this.renderForNotWatched();
        }
        else if (activeFlag > 3) {
            this.showSettingsFlag = true;
            this.renderSettings();
        }
        else {
            this.renderNoContent();
        }
    };
    PageOptions.prototype.renderSettings = function () {
        var label = this.createLabelContainer();
        var actionContainer = this.pageSettings.renderSettings();
        var buttonContainer = PageDetail.createDiv('settings-button-container');
        buttonContainer.appendChild(this.pageSettings.getSaveButton());
        buttonContainer.appendChild(this.pageSettings.getRevertButton());
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(buttonContainer);
    };
    PageOptions.prototype.renderForPlayList = function () {
        var label = this.createLabelContainer();
        var actionContainer = this.createActionsContainerForPlaylist();
        var countActions = this.createCountContainer();
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(countActions);
    };
    PageOptions.prototype.renderForWatched = function () {
        var label = this.createLabelContainer();
        var actionContainer = this.createActionsContainerForWatched();
        var countActions = this.createCountContainer();
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(countActions);
    };
    PageOptions.prototype.renderForNotWatched = function () {
        var inputValue = Settings.minSizeOfPlaylist - this.serverData.getIndexList(ListID.PLAYLIST).length;
        var maxValue = this.activePage.getDataIndexList().length;
        if (inputValue < 0) {
            this.inputFieldValue = 0;
        }
        else if (inputValue <= maxValue) {
            this.inputFieldValue = inputValue;
        }
        else {
            this.inputFieldValue = maxValue;
        }
        var label = this.createLabelContainer();
        var actionContainer = this.createActionsContainerForNotWatched();
        var countActions = this.createCountContainer();
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(countActions);
    };
    PageOptions.prototype.renderNoContent = function () {
        var p = document.createElement('p');
        p.classList.add('no-content');
        p.innerHTML = 'Für diese Seite sind keine Optionen verfügbar.';
        this.optionContainer.appendChild(p);
    };
    PageOptions.prototype.createLabelContainer = function () {
        var container = PageDetail.createDiv('opt-label-container');
        var triangleLeft = PageDetail.createDiv('dreieck-links');
        var label;
        var title1 = 'Aktion für alle Folgen ausführen';
        var title2 = 'Einstellungen';
        if (this.showSettingsFlag) {
            label = PageOptions.createLabel(title2);
        }
        else {
            label = PageOptions.createLabel(title1);
        }
        var triangleRight = PageDetail.createDiv('dreieck-rechts');
        container.appendChild(triangleLeft);
        container.appendChild(label);
        container.appendChild(triangleRight);
        var instance = this;
        container.addEventListener('click', function () {
            instance.showSettingsFlag = !instance.showSettingsFlag;
            slideCloseOptions(instance.optionContainer);
            setTimeout(function () {
                instance.renderPage(instance.activePage, navMap.active);
                slideOpenOptions(instance.optionContainer);
            }, 200);
        });
        return container;
    };
    PageOptions.createLabel = function (title) {
        var label = document.createElement('h3');
        label.classList.add('opt-label');
        label.classList.add('font-green');
        label.innerHTML = title;
        return label;
    };
    PageOptions.prototype.createActionsContainerForPlaylist = function () {
        var container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createAction('img/play.ico', 'play', 'Ungesehene Folgen in Tab öffnen', PageOptions.playButton, 'no-border'));
        container.appendChild(this.createAction('img/close.ico', 'close-tab', 'Geöffnete Tabs schließen', PageOptions.closeTabButton));
        container.appendChild(this.createAction('img/watched.ico', 'watched', 'Folgen als gesehen markieren', PageOptions.watchedButton));
        container.appendChild(this.createAction('img/not-watched.ico', 'not-watched', 'Folgen als nicht gesehen markieren', PageOptions.notWatchedButton));
        container.appendChild(this.createAction('img/add-button.ico', 'add', 'Alle eine Folge weiter', PageOptions.addButton, 'add-sub'));
        container.appendChild(this.createAction('img/subtr-button.ico', 'subtr', 'Alle eine Folge zurück', PageOptions.subtrButton, 'add-sub'));
        container.appendChild(this.createArrowAction('img/arrow-left.ico', 'arrow-left', 'Verschiebe alle abgeschlossenen Serien', this.arrowLeftButton, FilterType.ALL_WATCHED));
        container.appendChild(this.createArrowAction('img/arrow-right.ico', 'arrow-right', 'Verschiebe alle nicht angefangenen Serien', this.arrowRightButton, FilterType.NO_WATCHED));
        container.appendChild(this.createArrowAction('img/arrow-left.ico', 'arrow-left', 'Verschiebe alle Serien', this.arrowLeftButton, FilterType.ALL));
        container.appendChild(this.createArrowAction('img/arrow-right.ico', 'arrow-right', 'Verschiebe alle Serien', this.arrowRightButton, FilterType.ALL));
        return container;
    };
    PageOptions.prototype.createActionsContainerForWatched = function () {
        var container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createArrowAction('img/arrow-right.ico', 'arrow-right', 'Verschiebe alle nicht abgeschlossenen Serien', this.arrowRightButton, FilterType.NOT_ALL_WATCHED));
        container.appendChild(this.createArrowAction('img/arrow-right.ico', 'arrow-right', 'Verschiebe alle Serien', this.arrowRightButton, FilterType.ALL));
        return container;
    };
    PageOptions.prototype.createActionsContainerForNotWatched = function () {
        var container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createArrowAction('img/arrow-left.ico', 'arrow-left', 'Verschiebe alle angefangenen Serien', this.arrowLeftButton, FilterType.NOT_NO_WATCHED));
        container.appendChild(this.createSpecialArrowAction('img/arrow-left.ico', 'arrow-left', this.arrowLeftButton, 'random-input'));
        container.appendChild(this.createArrowAction('img/arrow-left.ico', 'arrow-left', 'Verschiebe alle Serien', this.arrowLeftButton, FilterType.ALL));
        return container;
    };
    PageOptions.prototype.createCountContainer = function () {
        var container = PageDetail.createDiv('count-actions');
        var node0 = document.createElement('p');
        node0.innerHTML = 'Aktion für';
        this.countCurrent = document.createElement('p');
        this.countCurrent.innerHTML = '-';
        this.countCurrent.classList.add('count-number-field');
        var node1 = document.createElement('p');
        node1.innerHTML = 'von';
        this.countMax = document.createElement('p');
        this.countMax.innerHTML = this.activePage.getDataIndexList().length.toString();
        this.countMax.classList.add('count-number-field');
        var node2 = document.createElement('p');
        node2.innerHTML = 'Folgen ausgeführt.';
        container.appendChild(node0);
        container.appendChild(this.countCurrent);
        container.appendChild(node1);
        container.appendChild(this.countMax);
        container.appendChild(node2);
        return container;
    };
    PageOptions.prototype.createAction = function (src, alt, label, callback, token) {
        var instance = this;
        return this.createActionContainer(src, alt, label, function () {
            var changedElements = [];
            var countAll = 0;
            var countSuccess = 0;
            instance.activePage.foreachListElement(function (element) {
                countAll++;
                var data = callback(element);
                if (data === undefined) {
                    return;
                }
                countSuccess++;
                if (data !== true) {
                    changedElements.push(data);
                }
            });
            instance.countCurrent.innerHTML = countSuccess.toString();
            instance.serverData.put(changedElements);
        }, token);
    };
    PageOptions.prototype.createArrowAction = function (src, alt, label, callback, filterType) {
        var instance = this;
        return this.createActionContainer(src, alt, label, function () {
            if (instance.arrowActionIsActive) {
                return;
            }
            instance.arrowActionIsActive = true;
            instance.elementIndexList = instance.getIndexListOfWatched(filterType);
            instance.currentArrayIndex = 0;
            instance.countCurrent.innerHTML = '0';
            callback(instance);
        });
    };
    PageOptions.prototype.createSpecialArrowAction = function (src, alt, callback, token) {
        var container = PageDetail.createDiv('opt-action');
        container.classList.add('list-button-container');
        var img = PageDetail.createImg(src, alt);
        var instance = this;
        img.addEventListener('click', function () {
            if (instance.arrowActionIsActive) {
                return;
            }
            instance.elementIndexList = [];
            var indexList = instance.activePage.getDataIndexList();
            var amountElements;
            if (indexList.length < instance.inputFieldValue) {
                amountElements = indexList.length;
            }
            else {
                amountElements = instance.inputFieldValue;
            }
            for (var i = 0; i < amountElements; i++) {
                var random = Math.floor(Math.random() * (indexList.length - 1));
                instance.elementIndexList.push(indexList[random]);
                indexList.splice(random, 1);
            }
            instance.arrowActionIsActive = true;
            instance.currentArrayIndex = 0;
            instance.countCurrent.innerHTML = '0';
            callback(instance);
        });
        container.appendChild(img);
        var labelContainer = document.createElement('div');
        if (token !== undefined) {
            labelContainer.classList.add(token);
        }
        var label1 = document.createElement('label');
        label1.htmlFor = 'input-random-number';
        label1.innerHTML = 'Verschiebe';
        labelContainer.appendChild(label1);
        this.inputField = document.createElement('input');
        this.inputField.id = 'input-random-number';
        this.inputField.type = 'number';
        this.inputField.min = '0';
        this.inputField.max = this.activePage.getDataIndexList().length.toString();
        this.inputField.value = this.inputFieldValue.toString();
        this.inputField.addEventListener('input', function () {
            if (instance.inputField.value === '') {
                instance.inputFieldValue = 0;
            }
            instance.inputFieldValue = parseInt(instance.inputField.value);
        });
        this.inputField.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        this.inputField.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        labelContainer.appendChild(this.inputField);
        var label2 = document.createElement('label');
        label2.htmlFor = 'input-random-number';
        label2.innerHTML = 'zufällige Serien';
        labelContainer.appendChild(label2);
        container.appendChild(labelContainer);
        return container;
    };
    PageOptions.prototype.getIndexListOfWatched = function (filterType) {
        var indexList = this.activePage.getDataIndexList();
        var newList = [];
        for (var i = 0; i < indexList.length; i++) {
            var currentElement = this.activePage.getElementWithDataIndex(indexList[i]);
            if (filterType === FilterType.ALL_WATCHED) {
                if (currentElement.allEpWatched()) {
                    newList.push(indexList[i]);
                }
            }
            else if (filterType === FilterType.NO_WATCHED) {
                if (currentElement.noEpWatched()) {
                    newList.push(indexList[i]);
                }
            }
            else if (filterType === FilterType.NOT_ALL_WATCHED) {
                if (!currentElement.allEpWatched()) {
                    newList.push(indexList[i]);
                }
            }
            else if (filterType === FilterType.NOT_NO_WATCHED) {
                if (!currentElement.noEpWatched()) {
                    newList.push(indexList[i]);
                }
            }
            else if (filterType === FilterType.ALL) {
                return indexList;
            }
        }
        return newList;
    };
    PageOptions.prototype.createActionContainer = function (src, alt, label, callback, token) {
        var container = PageDetail.createDiv('opt-action');
        container.classList.add('list-button-container');
        if (token !== undefined) {
            container.classList.add(token);
        }
        var img = PageDetail.createImg(src, alt);
        img.addEventListener('click', function () {
            callback();
        });
        container.appendChild(img);
        var labelElement = document.createElement('p');
        labelElement.innerHTML = label;
        container.appendChild(labelElement);
        return container;
    };
    PageOptions.playButton = function (element) {
        if (!element.currentEpWatched()) {
            return element.playButton();
        }
    };
    PageOptions.closeTabButton = function (element) {
        return element.closeTabButton();
    };
    PageOptions.watchedButton = function (element) {
        return element.watchedButton();
    };
    PageOptions.notWatchedButton = function (element) {
        return element.notWatchedButton();
    };
    PageOptions.addButton = function (element) {
        return element.addButton();
    };
    PageOptions.subtrButton = function (element) {
        return element.subtrButton();
    };
    PageOptions.prototype.arrowLeftButton = function (instance) {
        if (instance.currentArrayIndex < instance.elementIndexList.length) {
            var dataIndex = instance.elementIndexList[instance.currentArrayIndex];
            var currentElement_1 = instance.activePage.getElementWithDataIndex(dataIndex);
            var data = currentElement_1.arrowLeftButton(Settings.animationSpeedMulti, function () {
                currentElement_1.renderAfterArrowLeft(instance.activePage.getListId() - 1);
                instance.countCurrent.innerHTML = instance.currentArrayIndex.toString();
                instance.arrowLeftButton(instance);
            });
            instance.currentArrayIndex++;
            if (data !== undefined) {
                data.list--;
                instance.changedDataList.push(data);
            }
        }
        else {
            instance.updateChangedData(function () {
                instance.arrowActionIsActive = false;
            });
        }
    };
    PageOptions.prototype.arrowRightButton = function (instance) {
        if (instance.currentArrayIndex < instance.elementIndexList.length) {
            var dataIndex = instance.elementIndexList[instance.currentArrayIndex];
            var currentElement_2 = instance.activePage.getElementWithDataIndex(dataIndex);
            var data = currentElement_2.arrowRightButton(Settings.animationSpeedMulti, function () {
                currentElement_2.renderAfterArrowRight(instance.activePage.getListId() + 1);
                instance.countCurrent.innerHTML = instance.currentArrayIndex.toString();
                instance.arrowRightButton(instance);
            });
            instance.currentArrayIndex++;
            if (data !== undefined) {
                data.list++;
                instance.changedDataList.push(data);
            }
        }
        else {
            instance.updateChangedData(function () {
                instance.arrowActionIsActive = false;
            });
        }
    };
    PageOptions.prototype.updateChangedData = function (callback) {
        var instance = this;
        this.serverData.put(this.changedDataList, function () {
            instance.changedDataList = [];
            callback();
        });
    };
    return PageOptions;
}());
//# sourceMappingURL=PageOptions.js.map
var PageRanking = /** @class */ (function () {
    function PageRanking(pageElement, tabElement, serverData) {
        this.pageElement = pageElement;
        this.tabElement = tabElement;
        this.serverData = serverData;
    }
    PageRanking.prototype.activateTab = function () {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    };
    PageRanking.prototype.deactivateTab = function () {
        this.tabElement.classList.remove('tab-active');
    };
    PageRanking.prototype.getPageElement = function () {
        return this.pageElement;
    };
    PageRanking.prototype.hidePage = function () {
        this.pageElement.style.display = 'none';
    };
    PageRanking.prototype.showPage = function () {
        this.pageElement.style.display = 'block';
    };
    PageRanking.prototype.foreachListElement = function (callback, opt) {
    };
    PageRanking.prototype.getDataIndexList = function () {
    };
    PageRanking.prototype.getElementWithDataIndex = function (dataIndex) {
    };
    PageRanking.prototype.getListId = function () {
    };
    PageRanking.prototype.hideElement = function () {
        this.hidePage();
        this.deactivateTab();
    };
    PageRanking.prototype.showElement = function () {
        this.showPage();
        this.activateTab();
    };
    PageRanking.prototype.renderPage = function () {
    };
    return PageRanking;
}());
//# sourceMappingURL=PageRanking.js.map
var PageSettings = /** @class */ (function () {
    function PageSettings(serverData) {
        this.serverData = serverData;
        this.settings = {
            startPage: null,
            initialDataId: null,
            animationSpeedSingle: null,
            animationSpeedMulti: null,
            minSizeOfPlaylist: null,
            colorBrightness: null,
            titleLanguage: null,
            episodeCount: null
        };
        this.revertSettings();
        this.actionContainer = document.createElement('div');
        this.actionContainer.classList.add('opt-action-container');
    }
    PageSettings.prototype.renderSettings = function () {
        this.actionContainer.innerHTML = '';
        this.actionContainer.appendChild(this.titleLanguageAction());
        this.actionContainer.appendChild(this.startPageAction());
        this.actionContainer.appendChild(this.initialDataIdAction());
        this.actionContainer.appendChild(this.episodeCountAction());
        this.actionContainer.appendChild(this.animationSpeedSingleAction());
        this.actionContainer.appendChild(this.animationSpeedMultiAction());
        this.actionContainer.appendChild(this.minSizeOfPlaylistAction());
        this.actionContainer.appendChild(this.colorBrightnessAction());
        return this.actionContainer;
    };
    PageSettings.prototype.getSaveButton = function () {
        var instance = this;
        return this.getButton('Speichern', 'button-green', function () {
            instance.saveSettings();
        });
    };
    PageSettings.prototype.getRevertButton = function () {
        var instance = this;
        return this.getButton('Verwerfen', 'button-red', function () {
            instance.revertSettings();
            instance.renderSettings();
        });
    };
    PageSettings.prototype.getButton = function (label, token, callback) {
        var button = document.createElement('div');
        button.classList.add('custom-button');
        button.classList.add(token);
        button.innerHTML = label;
        button.addEventListener('click', function () {
            callback();
        });
        return button;
    };
    PageSettings.prototype.saveSettings = function () {
        this.updateSettingsObj();
        Settings.setAllSettings(this.settings);
        Settings.update(reloadEverything);
    };
    PageSettings.prototype.updateSettingsObj = function () {
        this.settings.startPage = parseInt(this.startPage.value);
        this.settings.initialDataId = this.initialDataId;
        this.settings.animationSpeedSingle = parseFloat(this.animationSpeedSingle);
        this.settings.animationSpeedMulti = parseFloat(this.animationSpeedMulti);
        this.settings.minSizeOfPlaylist = parseInt(this.minSizeOfPlaylist.value);
        this.settings.colorBrightness = parseInt(this.colorBrightness.value);
        this.settings.titleLanguage = this.titleLanguage;
        this.settings.episodeCount = this.episodeCount;
    };
    PageSettings.prototype.revertSettings = function () {
        this.settings.startPage = Settings.startPage;
        this.settings.initialDataId = Settings.initialDataId;
        this.settings.animationSpeedSingle = Settings.animationSpeedSingle;
        this.settings.animationSpeedMulti = Settings.animationSpeedMulti;
        this.settings.minSizeOfPlaylist = Settings.minSizeOfPlaylist;
        this.settings.colorBrightness = Settings.colorBrightness;
        this.settings.titleLanguage = Settings.titleLanguage;
        this.settings.episodeCount = Settings.episodeCount;
    };
    PageSettings.getActionDiv = function () {
        var container = document.createElement('div');
        container.classList.add('opt-action-settings');
        return container;
    };
    PageSettings.getLabel = function (label) {
        var p = document.createElement('p');
        p.innerHTML = label;
        return p;
    };
    PageSettings.getAction = function (label, append) {
        var container = PageSettings.getActionDiv();
        var labelElement = PageSettings.getLabel(label);
        container.appendChild(append);
        container.appendChild(labelElement);
        return container;
    };
    PageSettings.getOptionTag = function (label, value, selected) {
        var option = document.createElement('option');
        option.innerHTML = label;
        option.value = value;
        option.selected = selected;
        return option;
    };
    PageSettings.prototype.fillWithOptions = function (parent) {
        var list = this.serverData.getSortedListWithNames();
        for (var i = 0; i < list.length; i++) {
            var dataIndex = this.serverData.getIndexOfElementWithName(list[i]);
            var data = this.serverData.getListElement(dataIndex);
            var selected = (data.id === this.settings.initialDataId && data[this.settings.titleLanguage] === list[i]);
            var option = PageSettings.getOptionTag('', list[i], selected);
            parent.appendChild(option);
        }
    };
    PageSettings.prototype.getRangeControl = function (start, stop, step, value, callback) {
        var container = document.createElement('div');
        container.classList.add('opt-range-control');
        var range = document.createElement('input');
        range.type = 'range';
        range.min = start;
        range.max = stop;
        range.step = step;
        range.value = value;
        var display = document.createElement('p');
        display.innerHTML = value;
        range.addEventListener('change', function () {
            display.innerHTML = range.value;
            callback(range.value);
        });
        range.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        range.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        container.appendChild(range);
        container.appendChild(display);
        return container;
    };
    PageSettings.getInputNumber = function (min, max, value) {
        var input = document.createElement('input');
        input.classList.add('input-small');
        input.type = 'number';
        input.min = min;
        input.max = max;
        input.value = value;
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        return input;
    };
    PageSettings.prototype.getRadioInput = function (name, value, checked) {
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = value;
        input.checked = checked;
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        return input;
    };
    PageSettings.prototype.getRadioInputLang = function (src, alt, lang) {
        var div = document.createElement('div');
        div.classList.add('opt-single-radio');
        var img = PageDetail.createImg(src, alt);
        var input = this.getRadioInput('titleLanguage', lang, this.settings.titleLanguage === lang);
        div.appendChild(input);
        div.appendChild(img);
        var instance = this;
        div.addEventListener('click', function () {
            instance.titleLanguage = lang;
            input.checked = true;
        });
        return div;
    };
    PageSettings.prototype.getRadioInputEpCount = function (htmlFor, title, value) {
        var div = document.createElement('div');
        div.classList.add('opt-single-radio');
        var input = this.getRadioInput('episodeCount', value, this.settings.episodeCount === (value === 'true'));
        input.id = htmlFor;
        var label = document.createElement('label');
        label.htmlFor = htmlFor;
        label.innerHTML = title;
        div.appendChild(input);
        div.appendChild(label);
        var instance = this;
        div.addEventListener('click', function () {
            instance.episodeCount = input.value === 'true';
            input.checked = true;
        });
        return div;
    };
    PageSettings.prototype.startPageAction = function () {
        this.startPage = document.createElement('select');
        this.startPage.appendChild(PageSettings.getOptionTag('Fertig gesehen', ListID.WATCHED.toString(), this.settings.startPage === ListID.WATCHED));
        this.startPage.appendChild(PageSettings.getOptionTag('Aktuelle Playlist', ListID.PLAYLIST.toString(), this.settings.startPage === ListID.PLAYLIST));
        this.startPage.appendChild(PageSettings.getOptionTag('Noch nicht gesehen', ListID.NOT_WATCHED.toString(), this.settings.startPage === ListID.NOT_WATCHED));
        this.startPage.appendChild(PageSettings.getOptionTag('Details', ListID.DETAILS.toString(), this.settings.startPage === ListID.DETAILS));
        this.startPage.appendChild(PageSettings.getOptionTag('Neu', ListID.CREATE.toString(), this.settings.startPage === ListID.CREATE));
        this.startPage.appendChild(PageSettings.getOptionTag('Bearbeiten', ListID.EDIT.toString(), this.settings.startPage === ListID.EDIT));
        this.startPage.appendChild(PageSettings.getOptionTag('Ranking', ListID.RANKING.toString(), this.settings.startPage === ListID.RANKING));
        return PageSettings.getAction('Startseite festlegen', this.startPage);
    };
    PageSettings.prototype.initialDataIdAction = function () {
        var container = document.createElement('div');
        var input = document.createElement('input');
        input.classList.add('input-wide');
        input.type = 'search';
        input.setAttribute('list', 'all-names-settings');
        this.initialDataId = this.settings.initialDataId;
        var index = this.serverData.getIndexOfELement({ id: this.initialDataId });
        input.value = this.serverData.getListElement(index)[this.settings.titleLanguage];
        var instance = this;
        input.addEventListener('input', function (ev) {
            var index = instance.serverData.getIndexOfElementWithName(ev.target.value);
            if (index === -1) {
                return;
            }
            instance.initialDataId = instance.serverData.getListElement(index).id;
        });
        input.addEventListener('focus', function () {
            input.value = '';
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        var dataList = document.createElement('dataList');
        dataList.id = 'all-names-settings';
        this.fillWithOptions(dataList);
        container.appendChild(input);
        container.appendChild(dataList);
        return PageSettings.getAction('Serie als Start-Serie bei Details anzeigen', container);
    };
    PageSettings.prototype.animationSpeedSingleAction = function () {
        var instance = this;
        this.animationSpeedSingle = this.settings.animationSpeedSingle;
        var rangeControl = this.getRangeControl('0', '1', '0.01', this.settings.animationSpeedSingle.toString(), function (value) {
            instance.animationSpeedSingle = value;
        });
        return PageSettings.getAction('Animationsgeschw. Verschieben einer einzelnen Serie', rangeControl);
    };
    PageSettings.prototype.animationSpeedMultiAction = function () {
        var instance = this;
        this.animationSpeedMulti = this.settings.animationSpeedMulti;
        var rangeControl = this.getRangeControl('0', '1', '0.01', this.settings.animationSpeedMulti.toString(), function (value) {
            instance.animationSpeedMulti = value;
        });
        return PageSettings.getAction('Animationsgeschw. Verschieben mehrerer Serien', rangeControl);
    };
    PageSettings.prototype.minSizeOfPlaylistAction = function () {
        this.minSizeOfPlaylist = PageSettings.getInputNumber('0', '', this.settings.minSizeOfPlaylist.toString());
        return PageSettings.getAction('Mindestanzahl der Serien in Playlist', this.minSizeOfPlaylist);
    };
    PageSettings.prototype.colorBrightnessAction = function () {
        this.colorBrightness = PageSettings.getInputNumber('0', '255', this.settings.colorBrightness.toString());
        return PageSettings.getAction('Farbhelligkeit, nur für Serienfortschritt', this.colorBrightness);
    };
    PageSettings.prototype.titleLanguageAction = function () {
        var radioContainer = document.createElement('div');
        radioContainer.classList.add('opt-range-control');
        radioContainer.classList.add('opt-radio-buttons');
        this.titleLanguage = this.settings.titleLanguage;
        var divDE = this.getRadioInputLang('img/germany.png', 'germany', TitleLang.DE);
        var divEN = this.getRadioInputLang('img/uk.png', 'uk', TitleLang.EN);
        var divJPN = this.getRadioInputLang('img/japan.png', 'japan', TitleLang.JPN);
        radioContainer.appendChild(divDE);
        radioContainer.appendChild(divEN);
        radioContainer.appendChild(divJPN);
        return PageSettings.getAction('Titelsprache auswählen', radioContainer);
    };
    PageSettings.prototype.episodeCountAction = function () {
        var radioContainer = document.createElement('div');
        radioContainer.classList.add('opt-range-control');
        radioContainer.classList.add('opt-radio-buttons');
        this.episodeCount = this.settings.episodeCount;
        radioContainer.appendChild(this.getRadioInputEpCount('epCountTrue', 'durchgehend', 'true'));
        radioContainer.appendChild(this.getRadioInputEpCount('epCountFalse', 'in jeder Season neu', 'false'));
        return PageSettings.getAction('Folgennummerierung', radioContainer);
    };
    return PageSettings;
}());
//# sourceMappingURL=PageSettings.js.map
var TvdbSearchResults = /** @class */ (function () {
    function TvdbSearchResults(searchButton, searchInput, searchContainer, pageCreate) {
        this.searchButton = searchButton;
        this.searchInput = searchInput;
        this.searchContainer = searchContainer;
        this.pageCreate = pageCreate;
    }
    TvdbSearchResults.prototype.init = function () {
        var instance = this;
        this.loadindSpinner = PageCreate.createDiv(['loader']);
        this.searchButton.addEventListener('click', function () {
            instance.search();
        });
        this.searchInput.addEventListener('keypress', function (ev) {
            if (ev.key !== 'Enter') {
                return;
            }
            instance.search();
        });
    };
    TvdbSearchResults.prototype.reset = function () {
        this.searchContainer.innerHTML = '';
        this.searchInput.value = '';
    };
    TvdbSearchResults.prototype.search = function () {
        this.searchContainer.innerHTML = '';
        this.searchContainer.appendChild(this.loadindSpinner);
        var instance = this;
        TVDB.search(this.searchInput.value, function (result) {
            instance.searchContainer.innerHTML = '';
            if (result.error !== undefined) {
                var errMsg = TvdbSearchResults.createErrMsg(result.error);
                instance.searchContainer.appendChild(errMsg);
                return;
            }
            if (result.response !== undefined) {
                instance.filterResponse(result.response);
                instance.displayResults();
            }
        });
    };
    TvdbSearchResults.prototype.displayResults = function () {
        for (var id in this.resultMap) {
            var lang = '';
            if (this.resultMap[id].de !== undefined) {
                lang = 'de';
            }
            else if (this.resultMap[id].en !== undefined) {
                lang = 'en';
            }
            else if (this.resultMap[id].ja !== undefined) {
                lang = 'ja';
            }
            if (lang !== '') {
                this.searchContainer.appendChild(this.createSearchResult(this.resultMap[id][lang].name, parseInt(id), this.resultMap[id][lang].overview));
            }
        }
    };
    TvdbSearchResults.prototype.filterResponse = function (res) {
        this.resultMap = {};
        for (var lang in res) {
            if (res[lang].data !== undefined) {
                this.appendDataArrayToMap(res[lang].data, lang);
            }
        }
    };
    TvdbSearchResults.prototype.appendDataArrayToMap = function (data, lang) {
        for (var i = 0; i < data.length; i++) {
            if (this.resultMap[data[i].id] === undefined) {
                this.resultMap[data[i].id] = {};
            }
            this.resultMap[data[i].id][lang] = {
                name: data[i].seriesName,
                overview: data[i].overview
            };
        }
    };
    TvdbSearchResults.createErrMsg = function (msg) {
        var p = document.createElement('p');
        p.innerHTML = msg;
        return PageCreate.createDiv(['errMsg-container'], [p]);
    };
    TvdbSearchResults.prototype.createSearchResult = function (title, id, description) {
        var span = document.createElement('span');
        span.innerHTML = '#' + id;
        var h3 = document.createElement('h3');
        h3.innerHTML = title + ' ';
        var instance = this;
        h3.addEventListener('click', function () {
            var nameDE = '';
            var nameEN = '';
            var nameJPN = '';
            if (instance.resultMap[id].de !== undefined) {
                nameDE = instance.resultMap[id].de.name;
            }
            if (instance.resultMap[id].en !== undefined) {
                nameEN = instance.resultMap[id].en.name;
            }
            if (instance.resultMap[id].ja !== undefined) {
                nameJPN = instance.resultMap[id].ja.name;
            }
            instance.pageCreate.setResults(id, nameDE, nameEN, nameJPN);
        });
        h3.appendChild(span);
        var p = document.createElement('p');
        p.innerHTML = description;
        return PageCreate.createDiv(['search-result'], [h3, p]);
    };
    return TvdbSearchResults;
}());
//# sourceMappingURL=TvdbSearchResults.js.map
document.addEventListener('DOMContentLoaded', function () {
    window.onscroll = function () {
        myFunction();
    };
    var pages = document.getElementsByClassName('page');
    var navTabs = document.getElementById('nav-tabs');
    var sticky = navTabs.offsetTop;
    function setMargin(str) {
        for (var i = 0; i < pages.length; i++) {
            pages[i].style.marginTop = str;
        }
    }
    function myFunction() {
        if (window.pageYOffset > sticky) {
            navTabs.style.position = 'fixed';
            setMargin('67px');
        }
        else {
            navTabs.style.position = 'static';
            setMargin('20px');
        }
    }
});
var blockKeyboardNav = false;
var blockKeyboardOnInputFocus = false;
document.addEventListener('keydown', function (ev) {
    if (!navMap.flag || blockKeyboardNav || blockKeyboardOnInputFocus) {
        return;
    }
    if (ev.keyCode === 39) {
        if (navMap.active < 7) {
            animationSlideLeft(navMap[navMap.active], navMap[navMap.active + 1]);
            navMap.active++;
        }
        else {
            animationSlideLeft(navMap[7], navMap[1]);
            navMap.active = 1;
        }
    }
    if (ev.keyCode === 37) {
        if (navMap.active > 1) {
            animationSlideRight(navMap[navMap.active], navMap[navMap.active - 1]);
            navMap.active--;
        }
        else {
            animationSlideRight(navMap[1], navMap[7]);
            navMap.active = 7;
        }
    }
});
function animationSlideLeft(hide, show) {
    navMap.flag = false;
    show.activateTab();
    hide.deactivateTab();
    var toHide = hide.getPageElement();
    var toShow = show.getPageElement();
    var slideRange = innerWidth;
    toShow.style.left = innerWidth + 'px';
    show.showPage();
    var interval = setInterval(function () {
        if (slideRange <= 0) {
            clearInterval(interval);
            hide.hidePage();
            toHide.style.left = '0px';
            toShow.style.left = '0px';
            navMap.flag = true;
            return;
        }
        slideRange -= 80;
        if (slideRange < 0) {
            slideRange = 0;
        }
        toShow.style.left = (slideRange) + 'px';
        toHide.style.left = (slideRange - innerWidth) + 'px';
    }, 10);
}
function animationSlideRight(hide, show) {
    navMap.flag = false;
    show.activateTab();
    hide.deactivateTab();
    var toHide = hide.getPageElement();
    var toShow = show.getPageElement();
    var slideRange = (-1 * innerWidth);
    toShow.style.left = (-1 * innerWidth) + 'px';
    show.showPage();
    var interval = setInterval(function () {
        if (slideRange >= 0) {
            clearInterval(interval);
            hide.hidePage();
            toHide.style.left = '0px';
            toShow.style.left = '0px';
            navMap.flag = true;
            return;
        }
        slideRange += 80;
        if (slideRange > 0) {
            slideRange = 0;
        }
        toShow.style.left = (slideRange) + 'px';
        toHide.style.left = (slideRange + innerWidth) + 'px';
    }, 10);
}
function slideToWatched() {
    if (navMap.active === 1) {
        return;
    }
    if (!navMap.flag) {
        return;
    }
    animationSlideRight(navMap[navMap.active], watched);
    navMap.active = 1;
}
function slideToPlaylist() {
    if (navMap.active === 2) {
        return;
    }
    if (!navMap.flag) {
        return;
    }
    if (navMap.active > 2) {
        animationSlideRight(navMap[navMap.active], playlist);
    }
    else {
        animationSlideLeft(navMap[navMap.active], playlist);
    }
    navMap.active = 2;
}
function slideToNotWatched() {
    if (navMap.active === 3) {
        return;
    }
    if (!navMap.flag) {
        return;
    }
    if (navMap.active > 3) {
        animationSlideRight(navMap[navMap.active], notWatched);
    }
    else {
        animationSlideLeft(navMap[navMap.active], notWatched);
    }
    navMap.active = 3;
}
function slideToDetails() {
    if (navMap.active === 4) {
        return;
    }
    if (!navMap.flag) {
        return;
    }
    if (navMap.active > 4) {
        animationSlideRight(navMap[navMap.active], details);
    }
    else {
        animationSlideLeft(navMap[navMap.active], details);
    }
    navMap.active = 4;
}
function slideToCreate() {
    if (navMap.active === 5) {
        return;
    }
    if (!navMap.flag) {
        return;
    }
    if (navMap.active > 5) {
        animationSlideRight(navMap[navMap.active], create);
    }
    else {
        animationSlideLeft(navMap[navMap.active], create);
    }
    navMap.active = 5;
}
function slideToEdit() {
    if (navMap.active === 6) {
        return;
    }
    if (!navMap.flag) {
        return;
    }
    if (navMap.active > 6) {
        animationSlideRight(navMap[navMap.active], edit);
    }
    else {
        animationSlideLeft(navMap[navMap.active], edit);
    }
    navMap.active = 6;
}
function slideToRanking() {
    if (navMap.active === 7) {
        return;
    }
    if (!navMap.flag) {
        return;
    }
    animationSlideLeft(navMap[navMap.active], ranking);
    navMap.active = 7;
}
function resizeSegment(parent, relSpeed, callback) {
    var currentHeight = parent.parentElement.getBoundingClientRect().height;
    var heightRange;
    var newHeight;
    var noElements = (parent.children.length === 1);
    if (noElements) {
        heightRange = currentHeight;
        newHeight = 0;
    }
    else {
        heightRange = 168;
        newHeight = currentHeight - heightRange;
    }
    var stepHeight = heightRange * relSpeed;
    var interval = setInterval(function () {
        if (currentHeight - stepHeight <= newHeight) {
            clearInterval(interval);
            parent.parentElement.style.height = newHeight + 'px';
            if (noElements) {
                parent.parentElement.style.visibility = 'hidden';
            }
            navMap.flag = true;
            callback();
        }
        currentHeight -= stepHeight;
        parent.parentElement.style.height = currentHeight + 'px';
    }, 10);
}
function reorderSiblings(html, slideRangeForDiagonal, relSpeed, callback) {
    var startIndex = 1;
    for (var i = 0; i < html.parentElement.children.length; i++) {
        if (html.parentElement.children[i].id === html.id) {
            startIndex = i + 1;
            break;
        }
    }
    var bool = false;
    var slideRightMax = slideRangeForDiagonal;
    var newCallback = function () {
        if (bool) {
            resizeSegment(html.parentElement, relSpeed, callback);
        }
        else {
            navMap.flag = true;
            callback();
        }
    };
    if (startIndex === html.parentElement.children.length) {
        if (slideRangeForDiagonal === 0) {
            resizeSegment(html.parentElement, relSpeed, callback);
            return;
        }
        navMap.flag = true;
        callback();
        return;
    }
    for (var i = startIndex; i < html.parentElement.children.length; i++) {
        var current = html.parentElement.children[i];
        if (current.getBoundingClientRect().left <= 35) {
            if (i + 1 === html.parentElement.children.length) {
                bool = true;
                moveSiblingDiagonal(current, slideRightMax, relSpeed, newCallback);
            }
            else {
                moveSiblingDiagonal(current, slideRightMax, relSpeed);
            }
        }
        else {
            slideRightMax = current.getBoundingClientRect().left - 35;
            if (i + 1 === html.parentElement.children.length) {
                moveSiblingLeft(current, relSpeed, newCallback);
            }
            else {
                moveSiblingLeft(current, relSpeed);
            }
        }
    }
}
function moveSiblingLeft(element, relSpeed, callback) {
    element.style.position = 'relative';
    var leftRange = 365;
    var stepRange = leftRange * relSpeed;
    var current = 0;
    var interval = setInterval(function () {
        if (current + stepRange >= leftRange) {
            clearInterval(interval);
            element.style.right = leftRange + 'px';
            if (callback !== undefined) {
                callback();
            }
        }
        current += stepRange;
        element.style.right = current + 'px';
    }, 10);
}
function moveSiblingDiagonal(element, slideRightMax, relSpeed, callback) {
    element.style.position = 'relative';
    var topRange = 168;
    var stepRangeTop = topRange * relSpeed;
    var stepRangeRight = slideRightMax * relSpeed;
    var currentTop = 0;
    var currentRight = 0;
    var interval = setInterval(function () {
        if (currentTop + stepRangeTop >= topRange) {
            element.style.bottom = topRange + 'px';
            currentTop = topRange;
        }
        if (currentRight + stepRangeRight >= slideRightMax) {
            element.style.left = slideRightMax + 'px';
            currentRight = slideRightMax;
        }
        if (currentTop === topRange && currentRight === slideRightMax) {
            clearInterval(interval);
            if (callback !== undefined) {
                callback();
            }
            return;
        }
        currentTop += stepRangeTop;
        currentRight += stepRangeRight;
        element.style.bottom = currentTop + 'px';
        element.style.left = currentRight + 'px';
    }, 10);
}
function slideListElementLeft(listElement, relSpeed, callback) {
    navMap.flag = false;
    var html = listElement.getElement();
    html.style.position = 'relative';
    var slideRangeForDiagonal = html.getBoundingClientRect().left - 35;
    var slideRange = html.getBoundingClientRect().right + 10;
    var stepRange = slideRange * relSpeed;
    var currentRange = 0;
    var interval = setInterval(function () {
        if (currentRange >= slideRange) {
            clearInterval(interval);
            reorderSiblings(html, slideRangeForDiagonal, relSpeed, callback);
            return;
        }
        currentRange += stepRange;
        html.style.right = currentRange + 'px';
    }, 10);
}
function slideListElementRight(listElement, relSpeed, callback) {
    navMap.flag = false;
    var html = listElement.getElement();
    html.style.position = 'relative';
    var slideRangeForDiagonal = html.getBoundingClientRect().left - 35;
    var slideRange = (innerWidth - html.getBoundingClientRect().left) + 10;
    var stepRange = slideRange * relSpeed;
    var currentRange = 0;
    var interval = setInterval(function () {
        if (currentRange >= slideRange) {
            clearInterval(interval);
            reorderSiblings(html, slideRangeForDiagonal, relSpeed, callback);
            return;
        }
        currentRange += stepRange;
        html.style.left = currentRange + 'px';
    }, 10);
}
function slideOpenOptions(element) {
    // navMap.flag = false;
    blockKeyboardNav = true;
    element.style.right = '0px';
}
function slideCloseOptions(element) {
    // navMap.flag = true;
    blockKeyboardNav = false;
    element.style.right = '-25%';
}
//# sourceMappingURL=style.js.map
//*
var serverData;
var playlist;
var watched;
var notWatched;
var details;
var create;
var edit;
var ranking;
var optionPage;
var navMap;
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
        details.renderPage(serverData.getListElement(serverData.getIndexOfELement({
            id: Settings.initialDataId
        })));
        create.initPage();
        edit.initPage();
        ranking.renderPage();
    });
}
function reloadEverything() {
    var playlistElement = document.getElementById('playlist');
    var watchedElement = document.getElementById('watched');
    var notWatchedElement = document.getElementById('not-watched');
    var detailsElement = document.getElementById('details');
    var opacityLayer = document.getElementById('opacity-layer');
    var pageOption = document.getElementById('page-option');
    var createElement = document.getElementById('create');
    var editElement = document.getElementById('edit');
    var rankingElement = document.getElementById('ranking');
    var tabWatched = document.getElementById('tab-watched');
    var tabPlaylist = document.getElementById('tab-playlist');
    var tabNotWatched = document.getElementById('tab-not-watched');
    var tabDetails = document.getElementById('tab-details');
    var tabOptions = document.getElementById('option-button');
    var tabCreate = document.getElementById('tab-create');
    var tabEdit = document.getElementById('tab-edit');
    var tabRanking = document.getElementById('tab-ranking');
    Settings.load(function () {
        serverData = new ServerData();
        edit = new PageEdit(editElement, tabEdit, serverData);
        details = new PageDetail(detailsElement, tabDetails, serverData, edit);
        playlist = new PageList(ListID.PLAYLIST, playlistElement, tabPlaylist, serverData, details, edit);
        watched = new PageList(ListID.WATCHED, watchedElement, tabWatched, serverData, details, edit);
        notWatched = new PageList(ListID.NOT_WATCHED, notWatchedElement, tabNotWatched, serverData, details, edit);
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
            if (navMap !== undefined) {
                slideToCreate();
            }
        });
        tabEdit.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToEdit();
            }
        });
        tabRanking.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToRanking();
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    reloadEverything();
});
//*/ 
//# sourceMappingURL=init.js.map
