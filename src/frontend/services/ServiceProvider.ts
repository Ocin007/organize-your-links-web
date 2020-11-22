import SettingsService from "./SettingsService";

class ServiceProvider {

    private static _instance: ServiceProvider;

    private constructor() {
    }

    static get instance(): ServiceProvider {
        if (!this._instance) {
            this._instance = new ServiceProvider();
        }
        return this._instance;
    }

    get settings(): SettingsService {
        return SettingsService.instance;
    }
}

export default ServiceProvider;