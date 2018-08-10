class Settings extends AjaxRequest {

    static startPage: ListID;
    static initialDataId: string;
    static animationSpeedSingle: number;
    static animationSpeedMulti: number;
    static minSizeOfPlaylist: number;
    static colorBrightness: number;

    static load(callback?: Function) {
        Settings.sendAjaxRequest('../api/loadSettings.php', {}, function (http) {
            Settings.errFunction(http, 'load');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "get"');
                console.warn(resObj.error);
                return;
            }
            Settings.setAllSettings(resObj.response);
            if (callback !== undefined) {
                callback();
            }
        });
    }

    static update(callback?: Function) {
        const data = Settings.generateSettingsObj();
        Settings.sendAjaxRequest('../api/updateSettings.php', data, function (http) {
            Settings.errFunction(http, 'load');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if (resObj.error !== undefined) {
                console.warn('Error "get"');
                console.warn(resObj.error);
                return;
            }
            if (callback !== undefined) {
                callback();
            }
        });
    }

    static setAllSettings(response: any) {
        Settings.startPage = response.startPage;
        Settings.initialDataId = response.initialDataId;
        Settings.animationSpeedSingle = response.animationSpeedSingle;
        Settings.animationSpeedMulti = response.animationSpeedMulti;
        Settings.minSizeOfPlaylist = response.minSizeOfPlaylist;
        Settings.colorBrightness = response.colorBrightness;
    }

    private static generateSettingsObj() {
        return {
            startPage: Settings.startPage,
            initialDataId: Settings.initialDataId,
            animationSpeedSingle: Settings.animationSpeedSingle,
            animationSpeedMulti: Settings.animationSpeedMulti,
            minSizeOfPlaylist: Settings.minSizeOfPlaylist,
            colorBrightness: Settings.colorBrightness
        };
    }
}