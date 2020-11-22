import Page from "./page";

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

    //TODO: implement PageProvider
    get all(): Page[] {
        return [
            {
                pageId: 'a',
                label: 'Ein Testlabel (a)'
            },
            {
                pageId: 's',
                label: 'Ein Testlabel (s)'
            },
            {
                pageId: 'd',
                label: 'Ein Testlabel (d)'
            },
            {
                pageId: 'f',
                label: 'Ein Testlabel (f)'
            },
        ];
    }

    get(pageId: PageID): Page {
        return {
            pageId: pageId,
            label: 'Ein Testlabel (' + pageId + ')'
        };
    }
}

export default PageProvider;