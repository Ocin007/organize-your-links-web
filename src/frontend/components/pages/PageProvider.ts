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
                pageId: '3',
                label: 'Ein Testlabel (3)'
            },
            {
                pageId: 'playlist_all',
                label: 'Playlist: Alle'
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