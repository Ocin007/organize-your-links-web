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
}

export default ServiceProvider;