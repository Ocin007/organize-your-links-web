class Settings extends AjaxRequest {

    static startPage: ListID;
    static initialDataId: string;
    static animationSpeedSingle: number;
    static animationSpeedMulti: number;
    static minSizeOfPlaylist: number;
    static colorBrightness: number;
    static titleLanguage: TitleLang;
    static episodeCount: boolean;

    static load(callback?: Function) {
        Settings.sendAjaxRequest('GET', '../api/settings/get', {}, function (http) {
            Settings.errFunction(http, 'load');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if(Settings.checkForErrorNotifications(resObj)) {
                return;
            }
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
        Settings.sendAjaxRequest('PUT', '../api/settings/update', data, function (http) {
            Settings.errFunction(http, 'update');
        }, function (http) {
            const resObj = JSON.parse(http.responseText);
            if(Settings.checkForErrorNotifications(resObj)) {
                return;
            }
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
        Settings.titleLanguage = response.titleLanguage;
        Settings.episodeCount = response.episodeCount;
    }

    private static generateSettingsObj() {
        return {
            startPage: Settings.startPage,
            initialDataId: Settings.initialDataId,
            animationSpeedSingle: Settings.animationSpeedSingle,
            animationSpeedMulti: Settings.animationSpeedMulti,
            minSizeOfPlaylist: Settings.minSizeOfPlaylist,
            colorBrightness: Settings.colorBrightness,
            titleLanguage: Settings.titleLanguage,
            episodeCount: Settings.episodeCount
        };
    }
}