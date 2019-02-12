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
            if(ServerData.checkForErrorNotifications(resObj)) {
                return;
            }
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
            if(ServerData.checkForErrorNotifications(resObj)) {
                return;
            }
            if (resObj.error !== undefined) {
                console.warn('Error "put"');
                console.warn(resObj.error);
            }
            if (resObj.response === undefined) {
                return;
            }
            ServerData.decodeAllElements(list);
            for (let i = 0; i < list.length; i++) {
                if (resObj.response.indexOf(list[i].id) !== -1) {
                    instance.updateList(list[i]);
                }
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }

    post(list: DataListElement[], onError?: Function, onSuccess?: Function) {
        ServerData.encodeAllElements(list);
        ServerData.sendAjaxRequest('../api/post.php', list, function (http) {
            ServerData.errFunction(http, 'post');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if(ServerData.checkForErrorNotifications(resObj)) {
                return;
            }
            if(resObj.error !== undefined) {
                onError(resObj.error);
                return;
            }
            if(resObj.response !== undefined) {
                onSuccess();
            }
        });
    }

    delete(idArray: string[], callback?: Function) {
        ServerData.sendAjaxRequest('../api/delete.php', idArray, function (http) {
            ServerData.errFunction(http, 'post');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if(ServerData.checkForErrorNotifications(resObj)) {
                return;
            }
            if(resObj.error !== undefined) {
                console.warn('Error "delete"');
                console.warn(resObj.error);
                return;
            }
            if(resObj.response !== undefined) {
                callback();
            }
        });
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
        if(name === '') {
            return -1;
        }
        for (let i = 0; i < this.allElements.length; i++) {
            const boolDE = this.allElements[i][TitleLang.DE] === name;
            const boolEN = this.allElements[i][TitleLang.EN] === name;
            const boolJPN = this.allElements[i][TitleLang.JPN] === name;
            if(boolDE || boolEN || boolJPN) {
                return i;
            }
        }
        return -1;
    }

    getSortedListWithNames() {
        let list = [];
        const len = this.allElements.length;
        for (let i = 0; i < len; i++) {
            let helperArray = [];
            let data = this.allElements[i];
            if(data[TitleLang.DE] !== '' && helperArray.indexOf(data[TitleLang.DE]) === -1) {
                helperArray.push(data[TitleLang.DE]);
            }
            if(data[TitleLang.EN] !== '' && helperArray.indexOf(data[TitleLang.EN]) === -1) {
                helperArray.push(data[TitleLang.EN]);
            }
            if(data[TitleLang.JPN] !== '' && helperArray.indexOf(data[TitleLang.JPN]) === -1) {
                helperArray.push(data[TitleLang.JPN]);
            }
            list = list.concat(helperArray);
        }
        list.sort((a: any, b: any) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        return list
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

    private static decodeAllElements(list: DataListElement[]) {
        for (let i = 0; i < list.length; i++) {
            ServerData.decodeElement(list[i]);
        }
    }

    private static decodeElement(element: DataListElement) {
        element.name_de = decodeURIComponent(element.name_de);
        element.name_en = decodeURIComponent(element.name_en);
        element.name_jpn = decodeURIComponent(element.name_jpn);
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
        element.name_de = encodeURIComponent(element.name_de);
        element.name_en = encodeURIComponent(element.name_en);
        element.name_jpn = encodeURIComponent(element.name_jpn);
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