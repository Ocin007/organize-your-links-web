class AjaxRequest {

    static sendAjaxRequest(method: string, url: string, data: any, onError: Function, onSuccess: Function) {
        let http = new XMLHttpRequest();
        http.open(method, url);
        http.setRequestHeader('Content-type', 'application/json');
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
        http.send(JSON.stringify(data));
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
        let container = document.getElementById('notification-container');
        if(resObj.composer_missing === false && resObj.data_dir_not_writable === false && resObj.key_file_missing === false) {
            container.style.display = 'none';
            return false;
        }
        document.getElementById('loadsymbol').style.display = 'none';
        container.style.display = 'flex';
        if(resObj.composer_missing) {
            document.getElementById('notification-composer-not-installed').style.display = 'flex';
        }
        if(resObj.data_dir_not_writable) {
            document.getElementById('notification-data-dir-not-writable').style.display = 'flex';
        }
        if(resObj.key_file_missing) {
            let element = document.getElementById('notification-keyfile-not-found');
            element.style.display = 'flex';
            setTimeout(function () {
                element.style.opacity = '0';
                setTimeout(function () {
                    container.style.display = 'none';
                    element.style.display = 'none';
                    element.style.opacity = '1';
                }, 3000);
            }, 5000);
        }
        return true;
    }
}