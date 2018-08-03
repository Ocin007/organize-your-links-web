var ListID;
(function (ListID) {
    ListID[ListID["WATCHED"] = 1] = "WATCHED";
    ListID[ListID["PLAYLIST"] = 2] = "PLAYLIST";
    ListID[ListID["NOT_WATCHED"] = 3] = "NOT_WATCHED";
})(ListID || (ListID = {}));
//# sourceMappingURL=ListID.js.map
//# sourceMappingURL=DataListElement.js.map
var ServerData = /** @class */ (function () {
    function ServerData() {
        this.watched = [];
        this.playList = [];
        this.notWatched = [];
    }
    ServerData.prototype.get = function (callback) {
        var instance = this;
        this.sendAjaxRequest('../api/get.php', {}, function (http) {
            ServerData.errFunction(http, 'get');
        }, function (http) {
            var resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.log(resObj.error);
                return;
            }
            instance.splitInThreeLists(resObj.response);
            if (callback !== undefined) {
                callback();
            }
        });
    };
    ServerData.prototype.put = function (list) {
    };
    ServerData.prototype.post = function (list) {
    };
    ServerData.prototype.delete = function (idArray) {
    };
    ServerData.prototype.getList = function (id) {
        switch (id) {
            case ListID.WATCHED: return this.watched;
            case ListID.PLAYLIST: return this.playList;
            case ListID.NOT_WATCHED: return this.notWatched;
        }
    };
    ServerData.prototype.splitInThreeLists = function (list) {
        for (var i = 0; i < list.length; i++) {
            switch (list[i].list) {
                case ListID.WATCHED:
                    this.watched.push(list[i]);
                    break;
                case ListID.PLAYLIST:
                    this.playList.push(list[i]);
                    break;
                case ListID.NOT_WATCHED:
                    this.notWatched.push(list[i]);
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
                onSuccess(http);
            }
            else {
                onError(http);
            }
        });
        http.send(JSON.stringify(data));
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
    function ListElement(data, listId) {
        this.data = data;
        this.listId = listId;
        _a = this.getIndicesAndCountOfFirstNotWatched(), this.sIndex = _a[0], this.epIndex = _a[1], this.epCount = _a[2], this.maxCount = _a[3], this.success = _a[4];
        var _a;
    }
    ListElement.prototype.getId = function () {
        return this.data.id;
    };
    ListElement.prototype.getName = function () {
        return this.data.name;
    };
    ListElement.prototype.getElement = function () {
        return this.htmlListElement;
    };
    ListElement.prototype.generateNewElement = function () {
        var listElement = document.createElement('div');
        listElement.id = this.getId();
        listElement.classList.add('list-element');
        listElement.classList.add('shadow-bottom');
        var imgLabelContainer = document.createElement('div');
        imgLabelContainer.classList.add('list-img-label');
        var thumbnail = this.generateThumbnail();
        imgLabelContainer.appendChild(thumbnail);
        var labelContainer = this.generateLabelContainer();
        imgLabelContainer.appendChild(labelContainer);
        listElement.appendChild(imgLabelContainer);
        listElement.appendChild(this.generateButtonContainer());
        this.htmlListElement = listElement;
    };
    ListElement.prototype.generateThumbnail = function () {
        var thumbnail = this.generateButton(this.data.seasons[this.sIndex].thumbnail, 'thumbnail', function () {
        });
        thumbnail.classList.add('thumbnail');
        return thumbnail;
        /*
        debugger;
        const thumbnail = document.createElement('img');
        thumbnail.classList.add('thumbnail');
        if(this.success) {
            thumbnail.src = this.data.seasons[this.sIndex].thumbnail;
        } else {
            thumbnail.src = this.data.seasons[this.sIndex-1].thumbnail;
        }
        thumbnail.alt = 'thumbnail';
        return thumbnail;
        */
    };
    ListElement.prototype.generateButtonContainer = function () {
        var container = document.createElement('div');
        container.classList.add('list-button-container');
        switch (this.listId) {
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
        container.appendChild(this.watchedButton());
        container.appendChild(this.editButton());
        container.appendChild(this.deleteButton());
        return container;
    };
    ListElement.prototype.arrowLeftButton = function () {
        return this.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            //TODO
        });
    };
    ListElement.prototype.arrowRightButton = function () {
        return this.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            //TODO
        });
    };
    ListElement.prototype.playButton = function () {
        return this.generateButton('img/play.ico', 'play', function () {
            //TODO
        });
    };
    ListElement.prototype.watchedButton = function () {
        var watchedStatus = document.createElement('img');
        if (this.data.seasons[this.sIndex].episodes[this.epIndex].watched) {
            watchedStatus.src = 'img/watched.ico';
            watchedStatus.alt = 'watched';
        }
        else {
            watchedStatus.src = 'img/not-watched.ico';
            watchedStatus.alt = 'not-watched';
        }
        watchedStatus.addEventListener('click', function () {
            //TODO
        });
        return watchedStatus;
    };
    ListElement.prototype.editButton = function () {
        return this.generateButton('img/edit.ico', 'edit', function () {
            //TODO
        });
    };
    ListElement.prototype.deleteButton = function () {
        return this.generateButton('img/delete.ico', 'delete', function () {
            //TODO
        });
    };
    ListElement.prototype.generateButton = function (src, alt, onClick) {
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
        container.appendChild(this.generateTitle());
        var episode = this.generateEpisodeName();
        container.appendChild(episode);
        container.appendChild(this.generateAddSubContainer(episode));
        return container;
    };
    ListElement.prototype.generateTitle = function () {
        var title = document.createElement('h3');
        title.innerHTML = this.getName();
        title.addEventListener('click', function () {
            //TODO
        });
        return title;
    };
    ListElement.prototype.generateEpisodeName = function () {
        var episode = document.createElement('p');
        episode.classList.add('episode-name');
        episode.classList.add('list-label-p');
        episode.innerHTML = this.data.seasons[this.sIndex].episodes[this.epIndex].name;
        return episode;
    };
    ListElement.prototype.generateAddSubContainer = function (episode) {
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
        addSub.appendChild(this.generateButton('img/add-button.ico', 'add', function () {
            //TODO
        }));
        addSub.appendChild(this.generateButton('img/subtr-button.ico', 'subtr', function () {
            //TODO
        }));
        return addSub;
    };
    ListElement.prototype.getIndicesAndCountOfFirstNotWatched = function () {
        var sIndex, epIndex, epCount = 0, maxCount = 0, success = false;
        var flag = true;
        var s, ep;
        for (s = 0; s < this.data.seasons.length; s++) {
            for (ep = 0; ep < this.data.seasons[s].episodes.length; ep++) {
                if (flag) {
                    epCount++;
                }
                if (!this.data.seasons[s].episodes[ep].watched && flag) {
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
var PageList = /** @class */ (function () {
    function PageList(listID, pageElement, serverData) {
        this.listID = listID;
        this.pageElement = pageElement;
        this.serverData = serverData;
    }
    PageList.prototype.showElement = function () {
        this.pageElement.style.display = 'block';
    };
    PageList.prototype.hideElement = function () {
        this.pageElement.style.display = 'none';
    };
    PageList.prototype.generateMap = function () {
        this.dataList = {};
        var dataList = this.serverData.getList(this.listID);
        for (var i = 0; i < dataList.length; i++) {
            var firstChar = dataList[i].name.charAt(0).toUpperCase();
            if (this.dataList[firstChar] === undefined) {
                this.dataList[firstChar] = [new ListElement(dataList[i], this.listID)];
            }
            else {
                this.dataList[firstChar].push(new ListElement(dataList[i], this.listID));
            }
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
    window.onscroll = function () { myFunction(); };
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
            setMargin('47px');
        }
        else {
            navTabs.style.position = 'static';
            setMargin('0');
        }
    }
});
//# sourceMappingURL=style.js.map
var serverData;
var playlist;
document.addEventListener('DOMContentLoaded', function () {
    serverData = new ServerData();
    var playlistElement = document.getElementById('playlist');
    playlist = new PageList(ListID.PLAYLIST, playlistElement, serverData);
    serverData.get(function () {
        playlist.generateMap();
        playlist.renderList();
    });
});
//# sourceMappingURL=init.js.map
