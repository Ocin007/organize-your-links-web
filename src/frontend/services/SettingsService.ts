import AbstractService from "./AbstractService";
import {Status} from "../@types/enums";

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
    // observable pattern
    get startPage(): PageID {
        return 's'
    }

    set startPage(pageId: PageID) {

    }

    getNotify(status: Status): NotifySettings {

        return {
            visible: true,
            autoClose: Math.floor(Math.random() * 2) === 1,
            interval: 5000
        };
    }

    setNotify(status: Status, settings: {visible?: boolean, autoClose?: boolean, interval?: number}) {

    }
}

export default SettingsService;