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
            if(resObj.error !== undefined) {
                console.log(resObj.error);
                return;
            }
            instance.splitInThreeLists(resObj.response);
            if(callback !== undefined) {
                callback();
            }
        });
    }

    put(list: DataListElement[]) {

    }

    post(list: DataListElement[]) {

    }

    delete(idArray: string[]) {

    }

    getList(id: ListID) {
        switch (id) {
            case ListID.WATCHED: return this.watched;
            case ListID.PLAYLIST: return this.playList;
            case ListID.NOT_WATCHED: return this.notWatched;
        }
    }

    private splitInThreeLists(list: DataListElement[]) {
        for (let i = 0; i < list.length; i++) {
            switch (list[i].list){
                case ListID.WATCHED: this.watched.push(list[i]); break;
                case ListID.PLAYLIST: this.playList.push(list[i]); break;
                case ListID.NOT_WATCHED: this.notWatched.push(list[i]); break;
            }
        }
    }

    sendAjaxRequest(url: string, data: any, onError: Function, onSuccess: Function) {
        let http = new XMLHttpRequest();
        http.open("POST", url);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        http.addEventListener('load', function () {
            if (http.status >= 200 && http.status < 300) {
                onSuccess(http);
            } else {
                onError(http);
            }
        });
        http.send(JSON.stringify(data));
    }

    private static errFunction(http: XMLHttpRequest, title: string) {
        console.warn('Error: '+title+', code: '+http.status+' '+http.statusText);
        console.log(http.responseText);
        try {
            console.log(JSON.parse(http.responseText));
        } catch (e) {
            console.log('cannot be parsed');
        }
    }
}