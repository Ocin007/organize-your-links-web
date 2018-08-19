class PageEdit implements Slideable, ForeachElement {

    private oldData: DataListElement;
    private newData: DataListElement;

    private inputElementList: {
        label: HTMLElement,
        url: HTMLInputElement,
        thumbnail: HTMLInputElement,
        episodes: {
            label: HTMLElement,
            url: HTMLInputElement,
            name: HTMLInputElement,
            watched: boolean
        }[]
    }[] = [];

    private zerosS: HTMLInputElement;
    private zerosEp: HTMLInputElement;
    private genericMode: string;
    private genUrl: HTMLInputElement;
    private seasonContainer: HTMLElement;

    constructor(
        private pageElement: HTMLElement,
        private tabElement: HTMLElement,
        private serverData: ServerData) {}

    activateTab() {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    }

    deactivateTab() {
        this.tabElement.classList.remove('tab-active');
    }

    getPageElement() {
        return this.pageElement;
    }

    hidePage() {
        this.pageElement.style.display = 'none';
    }

    showPage() {
        this.pageElement.style.display = 'block';
    }

    foreachListElement(callback: Function, opt?: any) {

    }

    getDataIndexList() {

    }

    getElementWithDataIndex(dataIndex: number) {

    }

    getListId() {

    }

    hideElement() {
        this.hidePage();
        this.deactivateTab();
    }

    showElement() {
        this.showPage();
        this.activateTab();
    }

    initPage() {
        if(this.oldData !== undefined) {
            return;
        }
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(PageCreate.createDiv(['edit-no-data'], [
            PageEdit.generateText('h1', 'Keine Serie zum Bearbeiten ausgewählt')
        ]));
    }

    renderPage(data: DataListElement) {
        this.oldData = data;
        this.newData = {
            id: this.oldData.id,
            tvdbId: this.oldData.tvdbId,
            name_de: this.oldData.name_de,
            name_en: this.oldData.name_en,
            name_jpn: this.oldData.name_jpn,
            list: this.oldData.list,
            seasons: []
        };
        this.inputElementList = [];
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(this.generateTitleContainer());
        this.pageElement.appendChild(this.generateGeneralEditTools());
        this.pageElement.appendChild(this.generateSeasonsContainer());
    }

    private generateSeasonsContainer() {
        this.seasonContainer = PageCreate.createDiv(['edit-season-container']);
        for (let s = 0; s < this.oldData.seasons.length; s++) {
            let epContainer = this.appendSeason(this.oldData.seasons[s].url, this.oldData.seasons[s].thumbnail);
            for (let ep = 0; ep < this.oldData.seasons[s].episodes.length; ep++) {
                let name = this.oldData.seasons[s].episodes[ep].name;
                let url = this.oldData.seasons[s].episodes[ep].url;
                let watched = this.oldData.seasons[s].episodes[ep].watched;
                this.appendEpisode(epContainer, name, url, s, watched);
            }
        }
        return this.seasonContainer;
    }

    private generateTitleContainer() {
        const nameDE = (this.oldData.name_de === '') ? '-' : this.oldData.name_de;
        const nameEN = (this.oldData.name_en === '') ? '-' : this.oldData.name_en;
        const nameJPN = (this.oldData.name_jpn === '') ? '-' : this.oldData.name_jpn;
        return PageCreate.createDiv(['title-container-edit'], [
            PageCreate.createDiv(['title-wrapper'], [
                PageDetail.createImg('img/germany.png', 'germany'),
                PageEdit.generateText('h1', nameDE)
            ]),
            PageCreate.createDiv(['title-wrapper'], [
                PageDetail.createImg('img/uk.png', 'uk'),
                PageEdit.generateText('h1', nameEN)
            ]),
            PageCreate.createDiv(['title-wrapper'], [
                PageDetail.createImg('img/japan.png', 'japan'),
                PageEdit.generateText('h1', nameJPN)
            ]),
            this.createButtonContainer()
        ]);
    }

    private static generateText(tag: string, text: string) {
        const element = document.createElement(tag);
        element.innerHTML = text;
        return element;
    }

    private createButtonContainer() {
        const instance = this;
        const save = PageCreate.createDiv(['custom-button', 'button-green']);
        save.innerHTML = 'Speichern';
        save.addEventListener('click', function () {
            instance.createNewData();
            instance.serverData.put([instance.newData], reloadAllData);
        });
        const revert = PageCreate.createDiv(['custom-button', 'button-red']);
        revert.innerHTML = 'Verwerfen';
        revert.addEventListener('click', function () {
            instance.renderPage(instance.oldData);
        });
        return PageCreate.createDiv(['button-wrapper-edit'], [save, revert]);
    }

    private createNewData() {
        this.newData.seasons = [];
        for (let s = 0; s < this.inputElementList.length; s++) {
            this.newData.seasons.push({
                url: this.inputElementList[s].url.value,
                thumbnail: this.inputElementList[s].thumbnail.value,
                episodes: []
            });
            for (let ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                this.newData.seasons[s].episodes.push({
                    name: this.inputElementList[s].episodes[ep].name.value,
                    url: this.inputElementList[s].episodes[ep].url.value,
                    watched: this.inputElementList[s].episodes[ep].watched
                });
            }
        }
    }

    private generateGeneralEditTools() {
        const instance = this;
        this.zerosS = PageEdit.createInputNum('0', 'generic-fill-zero-s');
        this.zerosEp = PageEdit.createInputNum('0', 'generic-fill-zero-ep');
        const radioEp = this.createInputRadio('generic-mode-ep', '1', true);
        radioEp.checked = true;
        const radioSEp = this.createInputRadio('generic-mode-s-ep', '2', false);
        this.genUrl = PageEdit.createInputText('Generische Url mit {{s}}, {{ep}}');
        return PageCreate.createDiv(['edit-tools'], [
            PageCreate.createDiv(['edit-wrapper'], [
                this.createButton('button-green', 'TVDB Daten einfügen', function () {
                    instance.buttonFillWithTvdbData();
                })
            ]),
            this.createAddSeasonAction(),
            PageCreate.createDiv(['generic-url-container', 'edit-grow'], [
                PageCreate.createDiv(['edit-wrapper'], [
                    this.createButton('button-silver', 'Los', function () {
                        instance.buttonFillWithGenericUrls();
                    }),
                    this.genUrl
                ]),
                PageCreate.createDiv(['edit-wrapper'], [
                    radioEp,
                    PageEdit.createLabel('generic-mode-ep', '{{ep}} nicht neu zählen'),
                    radioSEp,
                    PageEdit.createLabel('generic-mode-s-ep', '{{ep}} in jeder Season neu zählen')
                ])
            ]),
            PageCreate.createDiv(['generic-url-container'], [
                PageCreate.createDiv(['edit-wrapper'], [
                    this.zerosS,
                    PageEdit.createLabel('generic-fill-zero-s', 'Stellen Season')
                ]),
                PageCreate.createDiv(['edit-wrapper'], [
                    this.zerosEp,
                    PageEdit.createLabel('generic-fill-zero-ep', 'Stellen Episode')
                ])
            ]),
        ]);
    }

    private createButton(token: string, label, callback: Function) {
        const button = PageCreate.createDiv(['custom-button', token]);
        button.innerHTML = label;
        button.addEventListener('click', function () {
            callback();
        });
        return button;
    }

    private buttonFillWithTvdbData() {
        //TODO
    }

    private buttonAppendSeason(numEpisodes: number) {
        const container = this.appendSeason('', '');
        for (let i = 0; i < numEpisodes; i++) {
            this.appendEpisode(container, '', '', this.inputElementList.length-1, false);
        }
    }

    private appendSeason(url: string, thumbnail: string) {
        const instance = this;
        const episodesContainer = PageCreate.createDiv(['edit-episodes-container', 'background-gray']);
        const urlInput = PageEdit.createInputText('Url Weiterleitung', url);
        const thumbnailInput = PageEdit.createInputText('Thumbnail', thumbnail);
        const label = PageEdit.generateText('h2', 'Season '+(this.inputElementList.length+1));
        const seasonObj = {
            label: label,
            url: urlInput,
            thumbnail: thumbnailInput,
            episodes: []
        };
        this.inputElementList.push(seasonObj);
        const close = PageDetail.createImg('img/close.ico', 'delete');
        close.addEventListener('click', function () {
            instance.seasonContainer.removeChild(season);
            instance.inputElementList.splice(instance.inputElementList.indexOf(seasonObj), 1);
            for (let s = 0; s < instance.inputElementList.length; s++) {
                instance.inputElementList[s].label.innerHTML = 'Season '+(s+1);
            }
        });
        const numEpisode = PageEdit.createInputNum('1');
        const addEpisode = this.createButton('button-silver', 'Episoden hinzufügen', function () {
            const num = parseInt(numEpisode.value);
            for (let i = 0; i < num; i++) {
                instance.appendEpisode(episodesContainer, '', '', instance.inputElementList.indexOf(seasonObj), false);
            }
        });
        const season = PageCreate.createDiv(['edit-season'], [
            PageCreate.createDiv(['season-header-wrapper'], [
                PageCreate.createDiv(['add-episodes-wrapper', 'edit-img-button'], [
                    close,
                    label
                ]),
                PageCreate.createDiv(['add-episodes-wrapper'], [
                    numEpisode,
                    addEpisode
                ])
            ]),
            PageCreate.createDiv(['input-wrapper'], [
                urlInput,
                thumbnailInput
            ]),
            episodesContainer
        ]);
        this.seasonContainer.appendChild(season);
        return episodesContainer;
    }

    private appendEpisode(container: HTMLElement, name: string, url: string, index: number, watched: boolean) {
        const instance = this;
        const sObj = this.inputElementList[index];
        const close = PageDetail.createImg('img/close.ico', 'delete');
        close.addEventListener('click', function () {
            console.log(instance.inputElementList[index]);
            container.removeChild(episode);
            sObj.episodes.splice(sObj.episodes.indexOf(epObj), 1);
            for (let ep = 0; ep < sObj.episodes.length; ep++) {
                sObj.episodes[ep].label.innerHTML = 'Folge '+(ep+1);
            }
        });
        const label = PageEdit.generateText('p', 'Folge '+(this.inputElementList[index].episodes.length+1));
        const nameInput = PageEdit.createInputText('Name', name);
        const urlInput = PageEdit.createInputText('Url', url);
        const episode = PageCreate.createDiv(['edit-episode', 'font-green'], [
            close, label, nameInput, urlInput
        ]);
        container.appendChild(episode);
        const epObj = {
            label: label,
            url: urlInput,
            name: nameInput,
            watched: watched
        };
        sObj.episodes.push(epObj);
    }

    private buttonFillWithGenericUrls() {
        let count = 0;
        for (let s = 0; s < this.inputElementList.length; s++) {
            for (let ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                count++;
                let realEp;
                if(this.genericMode === '1') {
                    realEp = PageEdit.appendZeros(count.toString(), parseInt(this.zerosEp.value));
                } else {
                    realEp = PageEdit.appendZeros((ep+1).toString(), parseInt(this.zerosEp.value));
                }
                let url = this.genUrl.value.replace(/{{s}}/g, PageEdit.appendZeros((s+1).toString(), parseInt(this.zerosS.value)));
                url = url.replace(/{{ep}}/g, realEp);
                if(this.inputElementList[s].episodes[ep].url.value === '') {
                    this.inputElementList[s].episodes[ep].url.value = url;
                }
            }
        }
    }

    private static appendZeros(str: string, numZeros: number) {
        let zeros = '';
        for (let i = 0; i < numZeros - str.length; i++) {
            zeros += '0';
        }
        return zeros + str;
    }

    private createAddSeasonAction() {
        const  instance = this;
        const inputS = PageEdit.createInputNum('1');
        const inputEp = PageEdit.createInputNum('1', 'episodes-per-seasons');
        const button = this.createButton('button-silver', 'Seasons hinzufügen', function () {
            for (let i = 0; i < parseInt(inputS.value); i++) {
                instance.buttonAppendSeason(parseInt(inputEp.value));
            }
        });
        const label = PageEdit.createLabel('episodes-per-seasons', 'Episoden pro Season');
        return PageCreate.createDiv(['generic-url-container'], [
            PageCreate.createDiv(['edit-wrapper'], [inputS, button]),
            PageCreate.createDiv(['edit-wrapper'], [inputEp, label])
        ]);
    }

    private static createInputNum(min: string, id?: string) {
        const input = document.createElement('input');
        input.classList.add('edit-input');
        input.classList.add('edit-number');
        input.type = 'number';
        input.min = min;
        input.value = min;
        if(id !== undefined) {
            input.id = id;
        }
        return input;
    }

    private static createLabel(htmlFor: string, text: string) {
        const label = PageEdit.generateText('label', text);
        label.setAttribute('for', htmlFor);
        return label;
    }

    private createInputRadio(id: string, value: string, checked: boolean) {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'generate-mode';
        input.id = id;
        input.value = value;
        input.checked = checked;
        if(checked) {
            this.genericMode = value;
        }
        const instance = this;
        input.addEventListener('click', function () {
            input.checked = true;
            instance.genericMode = input.value;
        });
        return input;
    }

    private static createInputText(placeholder: string, value?: string) {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('edit-input');
        input.classList.add('edit-text');
        input.placeholder = placeholder;
        if(value !== undefined) {
            input.value = value;
        }
        return input;
    }
}