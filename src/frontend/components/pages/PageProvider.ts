class PageProvider {

    private static _instance: PageProvider;

    private constructor() {
    }

    static get instance(): PageProvider {
        if (!this._instance) {
            this._instance = new PageProvider();
        }
        return this._instance;
    }
}

export default PageProvider;