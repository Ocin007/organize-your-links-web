class TVDB extends AjaxRequest {

    static search(token: string, callback: Function) {
        TVDB.sendAjaxRequest('../api/tvdb/search.php', token, function (http) {
            TVDB.errFunction(http, 'search');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            callback(resObj);
        });
    }

    static getEpisodes(id: number, callback: Function) {
        TVDB.sendAjaxRequest('../api/tvdb/getEpisodes.php', id, function (http) {
            TVDB.errFunction(http, 'getEpisodes');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            callback(resObj);
        });
    }
}