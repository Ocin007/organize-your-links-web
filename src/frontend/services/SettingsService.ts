import AbstractService from "./AbstractService";

class SettingsService extends AbstractService {

    private static _instance: SettingsService;

    private constructor() {
        super();
    }

    static get instance(): SettingsService {
        if (!this._instance) {
            this._instance = new SettingsService();
        }
        return this._instance;
    }

    //TODO: implement SettingsService
    get startPage(): PageID {
        return 's'
    }

    set startPage(pageId: PageID) {

    }
}

export default SettingsService;