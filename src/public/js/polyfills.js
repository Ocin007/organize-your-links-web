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
})(ListID || (ListID = {}));
//# sourceMappingURL=ListID.js.map
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
                    return;
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
    ServerData.prototype.post = function (list, callback) {
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
        for (var i = 0; i < this.allElements.length; i++) {
            if (this.allElements[i].name === name) {
                return i;
            }
        }
        return -1;
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
        element.name = decodeURIComponent(element.name);
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
        element.name = encodeURIComponent(element.name);
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
    //TODO: titleLanguage (en, de, jpn)
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
    };
    Settings.generateSettingsObj = function () {
        return {
            startPage: Settings.startPage,
            initialDataId: Settings.initialDataId,
            animationSpeedSingle: Settings.animationSpeedSingle,
            animationSpeedMulti: Settings.animationSpeedMulti,
            minSizeOfPlaylist: Settings.minSizeOfPlaylist,
            colorBrightness: Settings.colorBrightness
        };
    };
    return Settings;
}(AjaxRequest));
//# sourceMappingURL=Settings.js.map
var ListElement = /** @class */ (function () {
    function ListElement(dataIndex, serverData, detailPage, pageList) {
        this.dataIndex = dataIndex;
        this.serverData = serverData;
        this.detailPage = detailPage;
        this.pageList = pageList;
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
    ListElement.prototype.getName = function () {
        return this.serverData.getListElement(this.dataIndex).name;
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
        this.thumbnail = this.generateThumbnail();
        imgLabelContainer.appendChild(this.thumbnail);
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
        container.appendChild(this.createPlayButton());
        container.appendChild(this.createWatchedButton());
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
            //TODO: edit
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
        this.episode = this.generateEpisodeName();
        labelContainer.appendChild(this.episode);
        container.appendChild(labelContainer);
        container.appendChild(this.generateAddSubContainer());
        return container;
    };
    ListElement.prototype.generateTitle = function () {
        var title = document.createElement('h3');
        title.innerHTML = this.getName();
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
        //TODO: add sub mousedown
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
var PageDetail = /** @class */ (function () {
    function PageDetail(pageElement, tabElement, serverData) {
        this.pageElement = pageElement;
        this.tabElement = tabElement;
        this.serverData = serverData;
        this.colorBrightness = Settings.colorBrightness;
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
        this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
        this.seasonUrl = data.seasons[this.sIndex].url;
        this.currentIndex = this.serverData.getIndexOfELement(data);
        this.pageNumberElement.innerHTML = (this.currentIndex + 1).toString();
        this.setInfoValues(data);
        this.renderDetailsContainer(data);
    };
    PageDetail.prototype.setFlags = function (data) {
        _a = ListElement.getIndicesAndCountOfFirstNotWatched(data), this.sIndex = _a[0], this.epIndex = _a[1], this.epCount = _a[2], this.maxCount = _a[3], this.success = _a[4];
        var _a;
    };
    //TODO: name_en, name_de, name_jpn
    PageDetail.prototype.renderDetailsContainer = function (data) {
        this.detailContainer.innerHTML = '';
        var titleContainer = PageDetail.createDiv('title-container');
        var title = document.createElement('h1');
        title.innerHTML = data.name;
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
        titleContainer.appendChild(title);
        this.detailContainer.appendChild(titleContainer);
        for (var s = 0; s < data.seasons.length; s++) {
            this.detailContainer.appendChild(this.createSegment(s, data));
        }
    };
    PageDetail.prototype.createSegment = function (sIndex, data) {
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
            var _a = this.createEpisode(sIndex, ep, data, watchedSeason), episode = _a[0], watchedButton = _a[1];
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
    PageDetail.prototype.createEpisode = function (sIndex, epIndex, data, watchedSeason) {
        var episode = PageDetail.createDiv('episode-detail');
        var _a = this.generateEpisodeButtons(sIndex, epIndex, data, episode, watchedSeason), buttonContainer = _a[0], watchedButton = _a[1];
        episode.appendChild(buttonContainer);
        var epLabel = PageDetail.generateEpisodeLabel(epIndex, data.seasons[sIndex].episodes[epIndex].name);
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
            episode.classList.add('font-light-green');
        }
        else {
            watchedStatus.src = 'img/not-watched.ico';
            watchedStatus.alt = 'not-watched';
            episode.classList.remove('font-light-green');
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
            //TODO: edit detail
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
    //TODO: alle namen (en, de, jpn) suchbar
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
        container.appendChild(input);
        var dataList = document.createElement('dataList');
        dataList.id = 'all-names';
        this.fillWithOptions(dataList);
        container.appendChild(dataList);
        return container;
    };
    PageDetail.prototype.fillWithOptions = function (dataList) {
        var len = this.serverData.getListLen();
        for (var i = 0; i < len; i++) {
            var data = this.serverData.getListElement(i);
            var option = document.createElement('option');
            option.innerHTML = data.name;
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
        this.infoProgress.innerHTML = result + '%';
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
    return PageDetail;
}());
//# sourceMappingURL=PageDetail.js.map
var PageList = /** @class */ (function () {
    function PageList(listID, pageElement, tabElement, serverData, detailPage) {
        this.listID = listID;
        this.pageElement = pageElement;
        this.tabElement = tabElement;
        this.serverData = serverData;
        this.detailPage = detailPage;
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
            var firstChar = element.name.charAt(0).toUpperCase();
            var listElement = new ListElement(indexList[i], this.serverData, this.detailPage, this);
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
        else if (activeFlag === 4) {
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
var PageSettings = /** @class */ (function () {
    function PageSettings(serverData) {
        this.serverData = serverData;
        this.settings = {
            startPage: null,
            initialDataId: null,
            animationSpeedSingle: null,
            animationSpeedMulti: null,
            minSizeOfPlaylist: null,
            colorBrightness: null
        };
        this.revertSettings();
        this.actionContainer = document.createElement('div');
        this.actionContainer.classList.add('opt-action-container');
    }
    PageSettings.prototype.renderSettings = function () {
        this.actionContainer.innerHTML = '';
        this.actionContainer.appendChild(this.startPageAction());
        this.actionContainer.appendChild(this.initialDataIdAction());
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
    };
    PageSettings.prototype.revertSettings = function () {
        this.settings.startPage = Settings.startPage;
        this.settings.initialDataId = Settings.initialDataId;
        this.settings.animationSpeedSingle = Settings.animationSpeedSingle;
        this.settings.animationSpeedMulti = Settings.animationSpeedMulti;
        this.settings.minSizeOfPlaylist = Settings.minSizeOfPlaylist;
        this.settings.colorBrightness = Settings.colorBrightness;
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
        var len = this.serverData.getListLen();
        for (var i = 0; i < len; i++) {
            var data = this.serverData.getListElement(i);
            var option = PageSettings.getOptionTag('', data.name, data.id === this.settings.initialDataId);
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
        return input;
    };
    PageSettings.prototype.startPageAction = function () {
        this.startPage = document.createElement('select');
        this.startPage.appendChild(PageSettings.getOptionTag('Fertig gesehen', ListID.WATCHED.toString(), this.settings.startPage === ListID.WATCHED));
        this.startPage.appendChild(PageSettings.getOptionTag('Aktuelle Playlist', ListID.PLAYLIST.toString(), this.settings.startPage === ListID.PLAYLIST));
        this.startPage.appendChild(PageSettings.getOptionTag('Noch nicht gesehen', ListID.NOT_WATCHED.toString(), this.settings.startPage === ListID.NOT_WATCHED));
        this.startPage.appendChild(PageSettings.getOptionTag('Details', ListID.DETAILS.toString(), this.settings.startPage === ListID.DETAILS));
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
        input.value = this.serverData.getListElement(index).name;
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
    return PageSettings;
}());
//# sourceMappingURL=PageSettings.js.map
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
document.addEventListener('keydown', function (ev) {
    if (!navMap.flag || blockKeyboardNav) {
        return;
    }
    if (ev.keyCode === 39 && navMap.active < 4) {
        animationSlideLeft(navMap[navMap.active], navMap[navMap.active + 1]);
        navMap.active++;
    }
    if (ev.keyCode === 37 && navMap.active > 1) {
        animationSlideRight(navMap[navMap.active], navMap[navMap.active - 1]);
        navMap.active--;
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
    animationSlideLeft(navMap[navMap.active], details);
    navMap.active = 4;
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
var optionPage;
var navMap;
function reloadAllData() {
    serverData.get(function () {
        navMap = {
            1: watched,
            2: playlist,
            3: notWatched,
            4: details,
            active: Settings.startPage,
            flag: true
        };
        switch (Settings.startPage) {
            case ListID.WATCHED:
                watched.showElement();
                notWatched.hideElement();
                playlist.hideElement();
                details.hideElement();
                break;
            case ListID.PLAYLIST:
                playlist.showElement();
                watched.hideElement();
                notWatched.hideElement();
                details.hideElement();
                break;
            case ListID.NOT_WATCHED:
                notWatched.showElement();
                details.hideElement();
                playlist.hideElement();
                watched.hideElement();
                break;
            case ListID.DETAILS:
                details.showElement();
                notWatched.hideElement();
                playlist.hideElement();
                watched.hideElement();
                break;
        }
        playlist.generateMap();
        playlist.renderList();
        // watched.hideElement();
        watched.generateMap();
        watched.renderList();
        // notWatched.hideElement();
        notWatched.generateMap();
        notWatched.renderList();
        // details.hideElement();
        details.initPage();
        details.renderPage(serverData.getListElement(serverData.getIndexOfELement({
            id: Settings.initialDataId
        })));
    });
}
function reloadEverything() {
    var playlistElement = document.getElementById('playlist');
    var watchedElement = document.getElementById('watched');
    var notWatchedElement = document.getElementById('not-watched');
    var detailsElement = document.getElementById('details');
    var opacityLayer = document.getElementById('opacity-layer');
    var pageOption = document.getElementById('page-option');
    var tabWatched = document.getElementById('tab-watched');
    var tabPlaylist = document.getElementById('tab-playlist');
    var tabNotWatched = document.getElementById('tab-not-watched');
    var tabDetails = document.getElementById('tab-details');
    var tabOptions = document.getElementById('option-button');
    Settings.load(function () {
        serverData = new ServerData();
        details = new PageDetail(detailsElement, tabDetails, serverData);
        playlist = new PageList(ListID.PLAYLIST, playlistElement, tabPlaylist, serverData, details);
        watched = new PageList(ListID.WATCHED, watchedElement, tabWatched, serverData, details);
        notWatched = new PageList(ListID.NOT_WATCHED, notWatchedElement, tabNotWatched, serverData, details);
        optionPage = new PageOptions(opacityLayer, pageOption, serverData);
        reloadAllData();
        tabWatched.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToWatched();
                return;
            }
            watched.showElement();
            playlist.hideElement();
            notWatched.hideElement();
            details.hideElement();
        });
        tabPlaylist.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToPlaylist();
                return;
            }
            watched.hideElement();
            playlist.showElement();
            notWatched.hideElement();
            details.hideElement();
        });
        tabNotWatched.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToNotWatched();
                return;
            }
            watched.hideElement();
            playlist.hideElement();
            notWatched.showElement();
            details.hideElement();
        });
        tabDetails.addEventListener('click', function () {
            if (navMap !== undefined) {
                slideToDetails();
                return;
            }
            watched.hideElement();
            playlist.hideElement();
            notWatched.hideElement();
            details.showElement();
        });
        tabOptions.addEventListener('click', function () {
            optionPage.renderPage(navMap[navMap.active], navMap.active);
            optionPage.showElement();
            if (navMap !== undefined) {
                slideOpenOptions(optionPage.getOptionContainer());
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    reloadEverything();
});
//*/ 
//# sourceMappingURL=init.js.map
