class AjaxRequest {

    static sendAjaxRequest(url: string, data: any, onError: Function, onSuccess: Function) {
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
                    errWindow.document.write(e);
                }
            } else {
                onError(http);
            }
        });
        http.send('data=' + JSON.stringify(data));
    }

    static errFunction(http: XMLHttpRequest, title: string) {
        console.warn('Error: ' + title + ', code: ' + http.status + ' ' + http.statusText);
        console.log(http.responseText);
        try {
            console.log(JSON.parse(http.responseText));
        } catch (e) {
            console.log('cannot be parsed');
        }
        const errWindow = window.open();
        errWindow.document.write(http.responseText);
    }

    static checkForErrorNotifications(resObj: any) {
        if(resObj.composer_missing === false && resObj.data_dir_not_writable === false) {
            document.getElementById('notification-container').style.display = 'none';
            return false;
        }
        document.getElementById('loadsymbol').style.display = 'none';
        document.getElementById('notification-container').style.display = 'flex';
        if(resObj.composer_missing) {
            document.getElementById('notification-composer-not-installed').style.display = 'flex';
        }
        if(resObj.data_dir_not_writable) {
            document.getElementById('notification-data-dir-not-writable').style.display = 'flex';
        }
        return true;
    }
}