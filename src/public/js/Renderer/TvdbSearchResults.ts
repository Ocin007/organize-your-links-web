class TvdbSearchResults {

    private loadindSpinner: HTMLElement;
    private resultMap: {};

    constructor(
        private searchButton: HTMLElement,
        private searchInput: HTMLInputElement,
        private searchContainer: HTMLElement,
        private pageCreate: PageCreate
    ) {}


    init() {
        const instance = this;
        this.loadindSpinner = PageCreate.createDiv(['loader']);
        this.searchButton.addEventListener('click', function () {
            instance.search();
        });
        this.searchInput.addEventListener('keypress', function (ev: any) {
            if(ev.key !== 'Enter') {
                return;
            }
            instance.search();
        });
    }

    reset() {
        this.searchContainer.innerHTML = '';
        this.searchInput.value = '';
    }

    private search() {
        this.searchContainer.innerHTML = '';
        this.searchContainer.appendChild(this.loadindSpinner);
        const instance = this;
        TVDB.search(this.searchInput.value, function (result: any) {
            instance.searchContainer.innerHTML = '';
            if(result.error !== undefined) {
                const errMsg = TvdbSearchResults.createErrMsg(result.error);
                instance.searchContainer.appendChild(errMsg);
                return;
            }
            if(result.response !== undefined) {
                instance.filterResponse(result.response);
                instance.displayResults();
            }
        });
    }

    private displayResults() {
        for(let id in this.resultMap) {
            let lang = '';
            if(this.resultMap[id].de !== undefined) {
                lang = 'de';
            } else if(this.resultMap[id].en !== undefined) {
                lang = 'en';
            } else if(this.resultMap[id].ja !== undefined) {
                lang = 'ja';
            }
            if(lang !== '') {
                this.searchContainer.appendChild(this.createSearchResult(
                    this.resultMap[id][lang].name,
                    parseInt(id),
                    this.resultMap[id][lang].overview)
                );
            }
        }
    }

    private filterResponse(res: {de: {}, en: {}, ja: {}}) {
        this.resultMap = {};
        for(let lang in res) {
            if(res[lang].data !== undefined) {
                this.appendDataArrayToMap(res[lang].data, lang);
            }
        }
    }

    private appendDataArrayToMap(data: any[], lang: string) {
        for (let i = 0; i < data.length; i++) {
            if(this.resultMap[data[i].id] === undefined) {
                this.resultMap[data[i].id] = {};
            }
            this.resultMap[data[i].id][lang] = {
                name: data[i].seriesName,
                overview: data[i].overview
            };
        }
    }

    private static createErrMsg(msg: string) {
        const p = document.createElement('p');
        p.innerHTML = msg;
        return PageCreate.createDiv(['errMsg-container'], [p]);
    }

    private createSearchResult(title: string, id: number, description: string) {
        const span = document.createElement('span');
        span.innerHTML = '#'+id;
        const h3 = document.createElement('h3');
        h3.innerHTML = title+' ';
        const instance = this;
        h3.addEventListener('click', function () {
            let nameDE = '';
            let nameEN = '';
            let nameJPN = '';
            if(instance.resultMap[id].de !== undefined) {
                nameDE = instance.resultMap[id].de.name;
            }
            if(instance.resultMap[id].en !== undefined) {
                nameEN = instance.resultMap[id].en.name;
            }
            if(instance.resultMap[id].ja !== undefined) {
                nameJPN = instance.resultMap[id].ja.name;
            }
            instance.pageCreate.setResults(id, nameDE, nameEN, nameJPN);
        });
        h3.appendChild(span);
        const p = document.createElement('p');
        p.innerHTML = description;
        return PageCreate.createDiv(['search-result'], [h3, p]);
    }
}