var FilterType;
(function (FilterType) {
    FilterType[FilterType["ALL_WATCHED"] = 1] = "ALL_WATCHED";
    FilterType[FilterType["NO_WATCHED"] = 2] = "NO_WATCHED";
    FilterType[FilterType["NOT_ALL_WATCHED"] = 3] = "NOT_ALL_WATCHED";
    FilterType[FilterType["NOT_NO_WATCHED"] = 4] = "NOT_NO_WATCHED";
})(FilterType || (FilterType = {}));
//# sourceMappingURL=FilterType.js.map
var ListID;
(function (ListID) {
    ListID[ListID["WATCHED"] = 1] = "WATCHED";
    ListID[ListID["PLAYLIST"] = 2] = "PLAYLIST";
    ListID[ListID["NOT_WATCHED"] = 3] = "NOT_WATCHED";
})(ListID || (ListID = {}));
//# sourceMappingURL=ListID.js.map
//# sourceMappingURL=DataListElement.js.map
//# sourceMappingURL=ForeachElement.js.map
//# sourceMappingURL=Slideable.js.map
var ServerData = /** @class */ (function () {
    function ServerData() {
        this.watched = [];
        this.playList = [];
        this.notWatched = [];
        this.allElements = [];
    }
    ServerData.prototype.get = function (callback) {
        var instance = this;
        this.sendAjaxRequest('../api/get.php', {}, function (http) {
            ServerData.errFunction(http, 'get');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "get"');
                console.warn(resObj.error);
                return;
            }
            instance.allElements = resObj.response;
            // instance.decodeAllElements();
            instance.splitInThreeLists();
            if (callback !== undefined) {
                callback();
            }
        });
    };
    ServerData.prototype.put = function (list, callback) {
        var instance = this;
        ServerData.encodeAllElements(list);
        this.sendAjaxRequest('../api/put.php', list, function (http) {
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
    ServerData.prototype.sendAjaxRequest = function (url, data, onError, onSuccess) {
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
                    return;
                }
            }
            else {
                onError(http);
            }
        });
        http.send('data=' + JSON.stringify(data));
    };
    ServerData.prototype.updateList = function (element) {
        for (var i = 0; i < this.allElements.length; i++) {
            if (this.allElements[i].id === element.id) {
                this.allElements[i] = element;
                return;
            }
        }
    };
    ServerData.errFunction = function (http, title) {
        console.warn('Error: ' + title + ', code: ' + http.status + ' ' + http.statusText);
        console.log(http.responseText);
        try {
            console.log(JSON.parse(http.responseText));
        }
        catch (e) {
            console.log('cannot be parsed');
        }
    };
    return ServerData;
}());
//# sourceMappingURL=ServerData.js.map
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
    /*
        someEpWatched() {
            let foundWatched = false;
            let foundNotWatched = false;
            for (let s = 0; s < this.data.seasons.length; s++) {
                for (let ep = 0; ep < this.data.seasons[s].episodes.length; ep++) {
                    if(this.data.seasons[s].episodes[ep].watched) {
                        foundWatched = true;
                    }
                    if(!this.data.seasons[s].episodes[ep].watched) {
                        foundNotWatched = true;
                    }
                    if(foundWatched && foundNotWatched) {
                        return true;
                    }
                }
            }
            return false;
        }
    */
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
            instance.arrowLeftButton(5 / 100, function () {
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
            instance.arrowRightButton(5 / 100, function () {
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
        this.currentIndex = 0;
        this.seasonUrl = '';
        this.listElementMap = {};
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
        thumbnailAndDetails.appendChild(this.generateInfoContainer());
        this.pageElement.appendChild(thumbnailAndDetails);
        this.pageElement.appendChild(this.detailContainer);
    };
    PageDetail.prototype.renderPage = function (data) {
        this.setFlags(data);
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
        segment.appendChild(label);
        var epContainer = PageDetail.createDiv('episode-container');
        epContainer.classList.add('background-gray');
        for (var ep = 0; ep < data.seasons[sIndex].episodes.length; ep++) {
            epContainer.appendChild(this.createEpisode(sIndex, ep, data));
        }
        segment.appendChild(epContainer);
        return segment;
    };
    PageDetail.prototype.createEpisode = function (sIndex, epIndex, data) {
        var episode = PageDetail.createDiv('episode-detail');
        var buttonContainer = this.generateEpisodeButtons(sIndex, epIndex, data, episode);
        episode.appendChild(buttonContainer);
        var epLabel = PageDetail.generateEpisodeLabel(epIndex, data.seasons[sIndex].episodes[epIndex].name);
        episode.appendChild(epLabel);
        return episode;
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
    PageDetail.prototype.generateEpisodeButtons = function (sIndex, epIndex, data, episode) {
        var container = PageDetail.createDiv('episode-button-container');
        container.appendChild(this.playButton(sIndex, epIndex, data));
        container.appendChild(this.watchedButton(sIndex, epIndex, data, episode));
        return container;
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
    PageDetail.prototype.watchedButton = function (sIndex, epIndex, data, episode) {
        var watchedStatus = document.createElement('img');
        var setAttributes = function (bool) {
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
        setAttributes(data.seasons[sIndex].episodes[epIndex].watched);
        var instance = this;
        watchedStatus.addEventListener('click', function () {
            var oldBool = data.seasons[sIndex].episodes[epIndex].watched;
            data.seasons[sIndex].episodes[epIndex].watched = !oldBool;
            setAttributes(!oldBool);
            instance.updateInfo(data);
            instance.updateThumbnail(data);
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        return watchedStatus;
    };
    PageDetail.prototype.updateInfo = function (data) {
        this.setFlags(data);
        this.setInfoValues(data);
    };
    PageDetail.prototype.updateThumbnail = function (data) {
        this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
        this.seasonUrl = data.seasons[this.sIndex].url;
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
        var _a = PageDetail.calculateColor(parseFloat(result)), r = _a[0], g = _a[1];
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
    PageDetail.calculateColor = function (result) {
        var r, g;
        if (result <= 50) {
            r = PageDetail.colorBrightness;
            g = (result / 50) * PageDetail.colorBrightness;
        }
        else {
            r = ((100 - result) / 50) * PageDetail.colorBrightness;
            g = PageDetail.colorBrightness;
        }
        return [r, g];
    };
    PageDetail.colorBrightness = 255;
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
        var instance = this;
        this.opacityLayer.addEventListener('click', function () {
            slideCloseOptions(instance.optionContainer);
            instance.hideElement();
        });
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
        if (activeFlag === 2) {
            this.renderForPlayList();
        }
        else if (activeFlag === 1) {
            this.renderForWatched();
        }
        else {
            this.renderNoContent();
        }
    };
    PageOptions.prototype.renderForPlayList = function () {
        var label = PageOptions.createLabel();
        var actionContainer = this.createActionsContainerForPlaylist();
        var countActions = this.createCountContainer();
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(countActions);
    };
    PageOptions.prototype.renderForWatched = function () {
        var label = PageOptions.createLabel();
        var actionContainer = this.createActionsContainerForWatched();
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
    PageOptions.createLabel = function () {
        var label = document.createElement('h3');
        label.classList.add('opt-label');
        label.classList.add('font-green');
        label.innerHTML = 'Aktion für alle Folgen ausführen';
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
        return container;
    };
    PageOptions.prototype.createActionsContainerForWatched = function () {
        var container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createArrowAction('img/arrow-right.ico', 'arrow-right', 'Verschiebe alle nicht abgeschlossenen Serien', this.arrowRightButton, FilterType.NOT_ALL_WATCHED));
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
            var data = currentElement_1.arrowLeftButton(10 / 100, function () {
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
            var data = currentElement_2.arrowRightButton(10 / 100, function () {
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
document.addEventListener('DOMContentLoaded', function () {
    serverData = new ServerData();
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
    details = new PageDetail(detailsElement, tabDetails, serverData);
    playlist = new PageList(ListID.PLAYLIST, playlistElement, tabPlaylist, serverData, details);
    watched = new PageList(ListID.WATCHED, watchedElement, tabWatched, serverData, details);
    notWatched = new PageList(ListID.NOT_WATCHED, notWatchedElement, tabNotWatched, serverData, details);
    optionPage = new PageOptions(opacityLayer, pageOption, serverData);
    serverData.get(function () {
        navMap = {
            1: watched,
            2: playlist,
            3: notWatched,
            4: details,
            active: 2,
            flag: true
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
//*/ 
//# sourceMappingURL=init.js.map
