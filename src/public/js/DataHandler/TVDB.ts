class TVDB extends AjaxRequest {

    static search(token: string, callback: Function) {
        TVDB.sendAjaxRequest('../api/tvdb/search.php', token, function (http) {
            TVDB.errFunction(http, 'search');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            callback(resObj);
        });
    }
}