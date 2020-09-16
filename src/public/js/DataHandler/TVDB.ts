class TVDB extends AjaxRequest {

    static search(token: string, callback: Function) {
        TVDB.sendAjaxRequest('../api/tvdb/search.php', {searchStr: token}, function (http) {
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
        TVDB.sendAjaxRequest('../api/tvdb/getEpisodes.php', id, function (http) {
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
        TVDB.sendAjaxRequest('../api/tvdb/getImages.php', id, function (http) {
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