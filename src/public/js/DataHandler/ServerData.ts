class ServerData {
    private watched: DataListElement[] = [];
    private playList: DataListElement[] = [];
    private notWatched: DataListElement[] = [];

    constructor() {

    }

    get(callback?: Function) {
        const instance = this;
        this.sendAjaxRequest('../api/get.php', {}, function (http) {
            ServerData.errFunction(http, 'get');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.log(resObj.error);
                return;
            }
            instance.splitInThreeLists(resObj.response);
            if (callback !== undefined) {
                callback();
            }
        });
    }

    put(list: DataListElement[], callback?: Function) {
        const instance = this;
        this.sendAjaxRequest('../api/put.php', list, function (http) {
            ServerData.errFunction(http, 'put');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.log(resObj.error);
            }
            if (resObj.response === undefined) {
                return;
            }
            for (let i = 0; i < list.length; i++) {
                if (resObj.response.indexOf(list[i].id) !== -1) {
                    instance.refreshLists(list[i]);
                }
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }

    post(list: DataListElement[], callback?: Function) {

    }

    delete(idArray: string[], callback?: Function) {

    }

    getList(id: ListID) {
        switch (id) {
            case ListID.WATCHED:
                return this.watched;
            case ListID.PLAYLIST:
                return this.playList;
            case ListID.NOT_WATCHED:
                return this.notWatched;
        }
    }

    private splitInThreeLists(list: DataListElement[]) {
        for (let i = 0; i < list.length; i++) {
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
    }

    private refreshLists(element: DataListElement) {
        switch (element.list) {
            case ListID.WATCHED:
                ServerData.updateList(this.watched, element);
                break;
            case ListID.PLAYLIST:
                ServerData.updateList(this.playList, element);
                break;
            case ListID.NOT_WATCHED:
                ServerData.updateList(this.notWatched, element);
                break;
        }
    }

    private sendAjaxRequest(url: string, data: any, onError: Function, onSuccess: Function) {
        let http = new XMLHttpRequest();
        http.open("POST", url);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.addEventListener('load', function () {
            if (http.status >= 200 && http.status < 300) {
                try {
                    onSuccess(http);
                } catch (e) {
                    const errWindow = window.open();
                    errWindow.document.write(http.responseText);
                    return;
                }
            } else {
                onError(http);
            }
        });
        http.send('data=' + JSON.stringify(data));
    }

    private static updateList(list: DataListElement[], element: DataListElement) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === element.id) {
                list[i] = element;
                return;
            }
        }
    }

    private static errFunction(http: XMLHttpRequest, title: string) {
        console.warn('Error: ' + title + ', code: ' + http.status + ' ' + http.statusText);
        console.log(http.responseText);
        try {
            console.log(JSON.parse(http.responseText));
        } catch (e) {
            console.log('cannot be parsed');
        }
    }
}