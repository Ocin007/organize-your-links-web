class ServerData extends AjaxRequest {
    private watched: number[] = [];
    private playList: number[] = [];
    private notWatched: number[] = [];
    private allElements: DataListElement[] = [];

    get(callback?: Function) {
        const instance = this;
        ServerData.sendAjaxRequest('../api/get.php', {}, function (http) {
            ServerData.errFunction(http, 'get');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
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
    }

    put(list: DataListElement[], callback?: Function) {
        const instance = this;
        ServerData.encodeAllElements(list);
        ServerData.sendAjaxRequest('../api/put.php', list, function (http) {
            ServerData.errFunction(http, 'put');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "put"');
                console.warn(resObj.error);
            }
            if (resObj.response === undefined) {
                return;
            }
            for (let i = 0; i < list.length; i++) {
                if (resObj.response.indexOf(list[i].id) !== -1) {
                    instance.updateList(list[i]);
                }
            }
            instance.decodeAllElements();
            if (callback !== undefined) {
                callback();
            }
        });
    }

    post(list: DataListElement[], callback?: Function) {

    }

    delete(idArray: string[], callback?: Function) {

    }

    getIndexList(id: ListID) {
        switch (id) {
            case ListID.WATCHED:
                return this.watched;
            case ListID.PLAYLIST:
                return this.playList;
            case ListID.NOT_WATCHED:
                return this.notWatched;
        }
    }

    getListLen() {
        return this.allElements.length;
    }

    getListElement(index: number) {
        return this.allElements[index];
    }

    getIndexOfElementWithName(name: string) {
        for (let i = 0; i < this.allElements.length; i++) {
            if(this.allElements[i].name === name) {
                return i;
            }
        }
        return -1;
    }

    getIndexOfELement(data: {id: string}): number
    getIndexOfELement(data: DataListElement): number {
        for (let i = 0; i < this.allElements.length; i++) {
            if(this.allElements[i].id === data.id) {
                return i;
            }
        }
        return -1;
    }

    splitInThreeLists() {
        this.watched = [];
        this.playList = [];
        this.notWatched = [];
        for (let i = 0; i < this.allElements.length; i++) {
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
    }

    private decodeAllElements() {
        for (let i = 0; i < this.allElements.length; i++) {
            this.decodeElement(i);
        }
    }

    private decodeElement(index: number) {
        const element = this.allElements[index];
        element.name = decodeURIComponent(element.name);
        for (let s = 0; s < element.seasons.length; s++) {
            element.seasons[s].url = decodeURIComponent(element.seasons[s].url);
            element.seasons[s].thumbnail = decodeURIComponent(element.seasons[s].thumbnail);
            for (let ep = 0; ep < element.seasons[s].episodes.length; ep++) {
                element.seasons[s].episodes[ep].url = decodeURIComponent(element.seasons[s].episodes[ep].url);
                element.seasons[s].episodes[ep].name = decodeURIComponent(element.seasons[s].episodes[ep].name);
            }
        }
    }

    private static encodeAllElements(elementList: DataListElement[]) {
        for (let i = 0; i < elementList.length; i++) {
            ServerData.encodeElement(elementList[i]);
        }
    }

    private static encodeElement(element: DataListElement) {
        element.name = encodeURIComponent(element.name);
        for (let s = 0; s < element.seasons.length; s++) {
            element.seasons[s].url = encodeURIComponent(element.seasons[s].url);
            element.seasons[s].thumbnail = encodeURIComponent(element.seasons[s].thumbnail);
            for (let ep = 0; ep < element.seasons[s].episodes.length; ep++) {
                element.seasons[s].episodes[ep].url = encodeURIComponent(element.seasons[s].episodes[ep].url);
                element.seasons[s].episodes[ep].name = encodeURIComponent(element.seasons[s].episodes[ep].name);
            }
        }
    }

    private updateList(element: DataListElement) {
        for (let i = 0; i < this.allElements.length; i++) {
            if (this.allElements[i].id === element.id) {
                this.allElements[i] = element;
                return;
            }
        }
    }
}