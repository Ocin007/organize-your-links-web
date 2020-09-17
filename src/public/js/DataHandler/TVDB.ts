class TVDB extends AjaxRequest {

    static search(token: string, callback: Function) {
        TVDB.sendAjaxRequest('POST', '../api/tvdb/search', {searchStr: token}, function (http) {
            TVDB.errFunction(http, 'search');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if(TVDB.checkForErrorNotifications(resObj)) {
                return;
            }
            callback(resObj);
        });
    }

    static getEpisodes(id: number, callback: Function) {
        TVDB.sendAjaxRequest('GET', '../api/tvdb/'+id+'/episodes', {}, function (http) {
            TVDB.errFunction(http, 'getEpisodes');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if(TVDB.checkForErrorNotifications(resObj)) {
                return;
            }
            callback(resObj);
        });
    }

    static getImages(id: number, callback: Function) {
        TVDB.sendAjaxRequest('GET', '../api/tvdb/'+id+'/images', {}, function (http) {
            TVDB.errFunction(http, 'getImages');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if(TVDB.checkForErrorNotifications(resObj)) {
                return;
            }
            callback(resObj);
        });
    }
}