var ListID;
(function (ListID) {
    ListID[ListID["WATCHED"] = 1] = "WATCHED";
    ListID[ListID["PLAYLIST"] = 2] = "PLAYLIST";
    ListID[ListID["NOT_WATCHED"] = 3] = "NOT_WATCHED";
})(ListID || (ListID = {}));
//# sourceMappingURL=ListID.js.map
//# sourceMappingURL=DataListElement.js.map
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
    ServerData.prototype.splitInThreeLists = function () {
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
        var element = this.serverData.getListElement(this.dataIndex);
        _a = ListElement.getIndicesAndCountOfFirstNotWatched(element), this.sIndex = _a[0], this.epIndex = _a[1], this.epCount = _a[2], this.maxCount = _a[3], this.success = _a[4];
        var _a;
    }
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
    ListElement.prototype.showPageList = function () {
        this.pageList.showElement();
    };
    ListElement.prototype.renderPageList = function () {
        this.pageList.generateMap();
        this.pageList.renderList();
    };
    ListElement.prototype.generateNewElement = function () {
        this.data = this.serverData.getListElement(this.dataIndex);
        var listElement = document.createElement('div');
        listElement.id = this.getId();
        listElement.classList.add('list-element');
        listElement.classList.add('shadow-bottom');
        var imgLabelContainer = document.createElement('div');
        imgLabelContainer.classList.add('list-img-label');
        var thumbnail = this.generateThumbnail();
        imgLabelContainer.appendChild(thumbnail);
        var _a = this.generateButtonContainer(), buttonContainer = _a[0], watchedButton = _a[1];
        var labelContainer = this.generateLabelContainer(thumbnail, watchedButton);
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
                container.appendChild(this.arrowRightButton());
                break;
            case ListID.PLAYLIST:
                container.appendChild(this.arrowLeftButton());
                container.appendChild(this.arrowRightButton());
                break;
            case ListID.NOT_WATCHED:
                container.appendChild(this.arrowLeftButton());
                break;
        }
        container.appendChild(this.playButton());
        var watchedButton = this.watchedButton();
        container.appendChild(watchedButton);
        container.appendChild(this.editButton());
        container.appendChild(this.deleteButton());
        return [container, watchedButton];
    };
    ListElement.prototype.arrowLeftButton = function () {
        var instance = this;
        return ListElement.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            //TODO: arrow left
        });
    };
    ListElement.prototype.arrowRightButton = function () {
        var instance = this;
        return ListElement.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            //TODO: arrow right
        });
    };
    ListElement.prototype.playButton = function () {
        var instance = this;
        return ListElement.generateButton('img/play.ico', 'play', function () {
            window.open(instance.data.seasons[instance.sIndex].episodes[instance.epIndex].url);
        });
    };
    ListElement.prototype.watchedButton = function () {
        var watchedStatus = document.createElement('img');
        var setAttributes = function (bool) {
            if (bool) {
                watchedStatus.src = 'img/watched.ico';
                watchedStatus.alt = 'watched';
            }
            else {
                watchedStatus.src = 'img/not-watched.ico';
                watchedStatus.alt = 'not-watched';
            }
        };
        setAttributes(this.data.seasons[this.sIndex].episodes[this.epIndex].watched);
        var instance = this;
        watchedStatus.addEventListener('click', function () {
            var oldBool = instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched;
            instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched = !oldBool;
            setAttributes(!oldBool);
            instance.serverData.put([instance.data]);
        });
        return watchedStatus;
    };
    ListElement.prototype.editButton = function () {
        var instance = this;
        return ListElement.generateButton('img/edit.ico', 'edit', function () {
            //TODO: edit
        });
    };
    ListElement.prototype.deleteButton = function () {
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
    ListElement.prototype.generateLabelContainer = function (thumbnail, watchedButton) {
        var container = document.createElement('div');
        container.classList.add('list-label');
        var labelContainer = document.createElement('div');
        labelContainer.classList.add('title-episode-container');
        labelContainer.appendChild(this.generateTitle());
        var episode = this.generateEpisodeName();
        labelContainer.appendChild(episode);
        container.appendChild(labelContainer);
        container.appendChild(this.generateAddSubContainer(episode, thumbnail, watchedButton));
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
    ListElement.prototype.generateAddSubContainer = function (episode, thumbnail, watchedButton) {
        var addSub = document.createElement('div');
        addSub.classList.add('add-sub-count-container');
        var count = document.createElement('p');
        count.classList.add('list-label-p');
        var countEp = document.createElement('span');
        countEp.innerHTML = this.epCount.toString();
        var node = document.createTextNode('/');
        var countMax = document.createElement('span');
        countMax.innerHTML = this.maxCount.toString();
        count.appendChild(countEp);
        count.appendChild(node);
        count.appendChild(countMax);
        addSub.appendChild(count);
        var instance = this;
        var refresh = function () {
            var prefix = instance.generatePrefix();
            episode.innerHTML = prefix + instance.data.seasons[instance.sIndex].episodes[instance.epIndex].name;
            countEp.innerHTML = instance.epCount.toString();
            thumbnail.src = instance.data.seasons[instance.sIndex].thumbnail;
            if (instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched) {
                watchedButton.src = 'img/watched.ico';
                watchedButton.alt = 'watched';
            }
            else {
                watchedButton.src = 'img/not-watched.ico';
                watchedButton.alt = 'not-watched';
            }
        };
        addSub.appendChild(ListElement.generateButton('img/add-button.ico', 'add', function () {
            if (instance.data.seasons[instance.sIndex].episodes.length - 1 > instance.epIndex) {
                instance.epIndex++;
                instance.epCount++;
            }
            else if (instance.data.seasons.length - 1 > instance.sIndex) {
                instance.sIndex++;
                instance.epIndex = 0;
                instance.epCount++;
            }
            refresh();
        }));
        addSub.appendChild(ListElement.generateButton('img/subtr-button.ico', 'subtr', function () {
            if (instance.epIndex > 0) {
                instance.epIndex--;
                instance.epCount--;
            }
            else if (instance.sIndex > 0) {
                instance.sIndex--;
                instance.epIndex = instance.data.seasons[instance.sIndex].episodes.length - 1;
                instance.epCount--;
            }
            refresh();
        }));
        return addSub;
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
        var _c = PageDetail.generateInfoWrapper('Noch nicht geschaut', ''), infoNotWatched = _c[0], p3 = _c[1];
        var _d = PageDetail.generateInfoWrapper('Bereits geschaut', ''), infoWatched = _d[0], p4 = _d[1];
        var _e = PageDetail.generateInfoWrapper('# Folgen insgesamt', ''), infoMaxAmount = _e[0], p5 = _e[1];
        this.infoList = p1;
        this.infoProgress = p2;
        this.infoNotWatched = p3;
        this.infoWatched = p4;
        this.infoMaxAmount = p5;
        standard.appendChild(infoList);
        standard.appendChild(infoProgress);
        standard.appendChild(infoNotWatched);
        standard.appendChild(infoWatched);
        standard.appendChild(infoMaxAmount);
        container.appendChild(standard);
        this.infoSeasonContainer = document.createElement('div');
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
/*
var myWindow;

function openWin() {
    myWindow = window.open("", "myWindow", "width=200,height=100");
    myWindow.document.write("<p>This is 'myWindow'</p>");
}

function closeWin() {
    myWindow.close();
}
*/
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
document.addEventListener('keydown', function (ev) {
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
    animationSlideRight(navMap[navMap.active], watched);
    navMap.active = 1;
}
function slideToPlaylist() {
    if (navMap.active === 2) {
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
    animationSlideLeft(navMap[navMap.active], details);
    navMap.active = 4;
}
//# sourceMappingURL=style.js.map
//*
var serverData;
var playlist;
var watched;
var notWatched;
var details;
var navMap;
document.addEventListener('DOMContentLoaded', function () {
    serverData = new ServerData();
    var playlistElement = document.getElementById('playlist');
    var watchedElement = document.getElementById('watched');
    var notWatchedElement = document.getElementById('not-watched');
    var detailsElement = document.getElementById('details');
    var tabWatched = document.getElementById('tab-watched');
    var tabPlaylist = document.getElementById('tab-playlist');
    var tabNotWatched = document.getElementById('tab-not-watched');
    var tabDetails = document.getElementById('tab-details');
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
});
//*/ 
//# sourceMappingURL=init.js.map
