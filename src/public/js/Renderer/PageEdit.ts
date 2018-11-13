class PageEdit implements Slideable, ForeachElement {

    private oldData: DataListElement;
    private newData: DataListElement;
    private readonly episodeCount = Settings.episodeCount;

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
    private loadingSpinner: HTMLElement;
    private errMsg: HTMLElement;
    private startS: HTMLInputElement;
    private startEp: HTMLInputElement;
    private stopS: HTMLInputElement;
    private stopEp: HTMLInputElement;

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
            rank: this.oldData.rank,
            seasons: []
        };
        this.inputElementList = [];
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(this.generateTitleContainer());
        this.pageElement.appendChild(this.generateGeneralEditTools());
        this.pageElement.appendChild(this.generateErrMsgContainer());
        this.pageElement.appendChild(this.generateSeasonsContainer());
    }

    private generateErrMsgContainer() {
        this.errMsg = PageCreate.createDiv(['create-msg-container', 'edit-msg-container']);
        return PageCreate.createDiv(['edit-msg-wrapper'], [this.errMsg]);
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

    static generateText(tag: string, text: string) {
        const element = document.createElement(tag);
        element.innerHTML = text;
        return element;
    }

    private createButtonContainer() {
        const instance = this;
        const save = PageCreate.createDiv(['custom-button', 'button-green']);
        save.innerHTML = 'Speichern';
        save.addEventListener('click', function () {
            instance.resetErrMsg();
            instance.createNewData();
            instance.serverData.put([instance.newData], function () {
                setTimeout(reloadAllData, 400);
                instance.errMsg.innerHTML = 'Gespeichert!';
                instance.errMsg.classList.add('create-msg-success');
            });
        });
        const revert = PageCreate.createDiv(['custom-button', 'button-red']);
        revert.innerHTML = 'Verwerfen';
        revert.addEventListener('click', function () {
            instance.resetErrMsg();
            setTimeout(function () {
                instance.errMsg.innerHTML = 'Änderungen zurückgesetzt!';
                instance.errMsg.classList.add('create-msg-success');
            }, 100);
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
                let name = this.inputElementList[s].episodes[ep].name.value.replace(/"/g, '\'');
                name = name.replace(/\\/g, '');
                this.newData.seasons[s].episodes.push({
                    name: name,
                    url: this.inputElementList[s].episodes[ep].url.value,
                    watched: this.inputElementList[s].episodes[ep].watched
                });
            }
        }
    }

    private generateGeneralEditTools() {
        const instance = this;
        this.loadingSpinner = PageCreate.createDiv(['spinner'], [
            PageCreate.createDiv(['bounce1']),
            PageCreate.createDiv(['bounce2']),
            PageCreate.createDiv(['bounce3'])
        ]);
        this.zerosS = PageEdit.createInputNum('0', 'generic-fill-zero-s');
        this.zerosEp = PageEdit.createInputNum('0', 'generic-fill-zero-ep');
        this.startS = PageEdit.createInputNum('1', 'generic-startS');
        this.startEp = PageEdit.createInputNum('1', 'generic-startEp');
        this.stopS = PageEdit.createInputNum('1', 'generic-stopS');
        this.stopEp = PageEdit.createInputNum('1', 'generic-stopEp');
        const radioEp = this.createInputRadio('generic-mode-ep', '1', true);
        radioEp.checked = true;
        const radioSEp = this.createInputRadio('generic-mode-s-ep', '2', false);
        this.genUrl = PageEdit.createInputText('Generische Url mit {{s}}, {{ep}}');
        return PageCreate.createDiv(['edit-tools'], [
            PageCreate.createDiv(['generic-url-container'], [
                PageCreate.createDiv(['edit-wrapper'], [
                    PageEdit.createButton('button-green', 'TVDB Daten laden', function () {
                        instance.buttonFillWithTvdbData();
                    })
                ]),
                PageCreate.createDiv(['edit-wrapper', 'loading-container'], [
                    this.loadingSpinner
                ])
            ]),
            this.createAddSeasonAction(),
            PageCreate.createDiv(['generic-url-container', 'edit-grow'], [
                PageCreate.createDiv(['edit-wrapper'], [
                    PageEdit.createButton('button-silver', 'Los', function () {
                        instance.buttonFillWithGenericUrls();
                    }),
                    this.genUrl
                ]),
                PageCreate.createDiv(['edit-wrapper'], [
                    PageCreate.createDiv(['generic-url-container'], [
                        PageCreate.createDiv([], [
                            radioEp,
                            PageEdit.createLabel('generic-mode-ep', 'Nicht neu zählen')
                        ]),
                        PageCreate.createDiv([], [
                            radioSEp,
                            PageEdit.createLabel('generic-mode-s-ep', 'In jeder Season neu zählen')
                        ]),
                    ]),
                    PageCreate.createDiv(['edit-wrapper'], [
                        this.zerosS,
                        PageEdit.createLabel('generic-fill-zero-s', 'Stellen Season')
                    ]),
                    PageCreate.createDiv(['edit-wrapper'], [
                        this.zerosEp,
                        PageEdit.createLabel('generic-fill-zero-ep', 'Stellen Episode')
                    ])
                ])
            ]),
            PageCreate.createDiv(['generic-url-container'], [
                this.createStartInput(),
                this.createStopInput()
            ]),
        ]);
    }

    private createStartInput() {
        if(this.episodeCount) {
            return PageCreate.createDiv(['edit-wrapper'], [
                PageEdit.createLabel('generic-startEp', 'Von ep'),
                this.startEp
            ]);
        }
        return PageCreate.createDiv(['edit-wrapper'], [
            PageEdit.createLabel('generic-startS', 'Von s'),
            this.startS,
            PageEdit.createLabel('generic-startEp', 'ep'),
            this.startEp
        ]);
    }

    private createStopInput() {
        if(this.episodeCount) {
            return PageCreate.createDiv(['edit-wrapper', 'edit-wrapper-end'], [
                PageEdit.createLabel('generic-stopEp', 'Bis ep'),
                this.stopEp
            ]);
        }
        return PageCreate.createDiv(['edit-wrapper', 'edit-wrapper-end'], [
            PageEdit.createLabel('generic-stopS', 'Bis s'),
            this.stopS,
            PageEdit.createLabel('generic-stopEp', 'ep'),
            this.stopEp
        ]);
    }

    static createButton(token: string, label, callback: Function) {
        const button = PageCreate.createDiv(['custom-button', token]);
        button.innerHTML = label;
        button.addEventListener('click', function () {
            callback();
        });
        return button;
    }

    private resetErrMsg() {
        this.errMsg.innerHTML = '';
        this.errMsg.classList.remove('create-msg-success');
        this.errMsg.classList.remove('create-msg-error');
    }

    private buttonFillWithTvdbData() {
        this.resetErrMsg();
        if(this.oldData.tvdbId === -1) {
            this.errMsg.innerHTML = 'Keine TVDB ID für diese Serie vergeben!';
            this.errMsg.classList.add('create-msg-error');
            return;
        }
        this.loadingSpinner.style.visibility = 'visible';
        const instance = this;
        TVDB.getEpisodes(this.oldData.tvdbId, function (resObj: any) {
            if(resObj.error !== undefined) {
                instance.errMsg.innerHTML = 'Error: '+resObj.error;
                instance.errMsg.classList.add('create-msg-error');
                instance.loadingSpinner.style.visibility = 'hidden';
                return;
            }
            if(resObj.response === undefined) {
                instance.loadingSpinner.style.visibility = 'hidden';
                return;
            }
            instance.fillNameInputsWithData(resObj.response);
            instance.errMsg.innerHTML = '(1/2) Episoden ergänzt...';
            TVDB.getImages(instance.oldData.tvdbId, function (resObj: any) {
                instance.loadingSpinner.style.visibility = 'hidden';
                if(resObj.error !== undefined) {
                    instance.errMsg.innerHTML = 'Error: '+resObj.error;
                    instance.errMsg.classList.add('create-msg-error');
                    return;
                }
                if(resObj.response === undefined) {
                    return;
                }
                instance.fillThumbnailsWithData(resObj.response);
                instance.errMsg.innerHTML = '(2/2) Thumbnails ergänzt!';
                instance.errMsg.classList.add('create-msg-success');
            });
        });
    }

    private fillThumbnailsWithData(data: any) {
        for (let s = 1; s < this.inputElementList.length+1; s++) {
            if(data[s] !== undefined && this.inputElementList[s-1] !== undefined) {
                if(this.inputElementList[s-1].thumbnail.value === '') {
                    this.inputElementList[s-1].thumbnail.value = data[s];
                }
            }
        }
    }

    private fillNameInputsWithData(data: any) {
        for (let s = 1; s < Object.keys(data).length+1; s++) {
            if(data[s] !== undefined) {
                let epContainer;
                if(this.inputElementList.length < s) {
                    epContainer = this.appendSeason('', '');
                } else {
                    epContainer = this.seasonContainer.children[s-1].lastChild;
                }
                for (let ep = 1; ep < Object.keys(data[s]).length+1; ep++) {
                    if(this.inputElementList[s-1].episodes.length < ep) {
                        this.appendEpisode(epContainer, data[s][ep], '', s-1, false);
                    } else {
                        if(this.inputElementList[s-1].episodes[ep-1].name.value === '') {
                            this.inputElementList[s-1].episodes[ep-1].name.value = data[s][ep];
                        }
                    }
                }
            }
        }
        let s = Object.keys(data).length;
        if(data[0] !== undefined) {
            let epContainer;
            if(this.inputElementList.length < s) {
                epContainer = this.appendSeason('', '');
            } else {
                epContainer = this.seasonContainer.children[s-1].lastChild;
            }
            const specials = '------------------------- SPECIALS -------------------------';
            if(this.inputElementList[s-1].episodes.length === 0) {
                this.appendEpisode(epContainer, specials, '', s-1, false);
            } else {
                if(this.inputElementList[s-1].episodes[0].name.value === '') {
                    this.inputElementList[s-1].episodes[0].name.value = specials;
                }
            }
            for (let ep = 1; ep < Object.keys(data[0]).length+1; ep++) {
                if(this.inputElementList[s-1].episodes.length < ep+1) {
                    this.appendEpisode(epContainer, data[0][ep], '', s-1, false);
                } else {
                    if(this.inputElementList[s-1].episodes[ep].name.value === '') {
                        this.inputElementList[s-1].episodes[ep].name.value = data[0][ep];
                    }
                }
            }
        }
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
            const sIndex = instance.inputElementList.indexOf(seasonObj);
            instance.inputElementList.splice(sIndex, 1);
            for (let s = 0; s < instance.inputElementList.length; s++) {
                instance.inputElementList[s].label.innerHTML = 'Season '+(s+1);
            }
            if(instance.episodeCount) {
                instance.updateStopValuesOnlyEp();
            } else {
                instance.updateStopValues();
            }
            instance.updateEpLabels(sIndex);
        });
        const numEpisode = PageEdit.createInputNum('1');
        const addEpisode = PageEdit.createButton('button-silver', 'Episoden hinzufügen', function () {
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

    private appendEpisode(container: HTMLElement, name: string, url: string, sIndex: number, watched: boolean) {
        const instance = this;
        const sObj = this.inputElementList[sIndex];
        const close = PageDetail.createImg('img/close.ico', 'delete');
        close.addEventListener('click', function () {
            container.removeChild(episode);
            sObj.episodes.splice(sObj.episodes.indexOf(epObj), 1);
            for (let ep = 0; ep < sObj.episodes.length; ep++) {
                sObj.episodes[ep].label.innerHTML = 'Folge '+(ep+1);
            }
            if(instance.episodeCount) {
                instance.updateStopValuesOnlyEp();
            } else {
                instance.updateStopValues();
            }
            instance.updateEpLabels(sIndex);
        });
        const label = PageEdit.generateText('p', 'Folge '+(this.inputElementList[sIndex].episodes.length+1));
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
        if(this.episodeCount) {
            this.updateStopValuesOnlyEp();
        } else {
            this.updateStopValues();
        }
        this.updateEpLabels(sIndex);
    }

    private updateStopValuesOnlyEp() {
        let count = 0;
        for (let s = 0; s < this.inputElementList.length; s++) {
            for (let ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                count++;
            }
        }
        this.stopEp.value = count.toString();
    }

    private updateStopValues() {
        let sMax = 1;
        for (let s = this.inputElementList.length-1; s > -1; s--) {
            if(this.inputElementList[s].episodes.length > 0) {
                sMax = s+1;
                break;
            }
        }
        this.stopS.value = sMax.toString();
        if(this.inputElementList[sMax-1] !== undefined) {
            this.stopEp.value = this.inputElementList[sMax-1].episodes.length.toString();
        } else {
            this.stopEp.value = '1';
        }
    }

    private updateEpLabels(sIndex: number) {
        if(!this.episodeCount) {
            return;
        }
        let epCount = 0;
        for (let s = 0; s < sIndex; s++) {
            epCount += this.inputElementList[s].episodes.length;
        }
        for (let s = sIndex; s < this.inputElementList.length; s++) {
            for (let ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                epCount++;
                this.inputElementList[s].episodes[ep].label.innerHTML = 'Folge '+epCount;
            }
        }
    }

    private buttonFillWithGenericUrls() {
        this.resetErrMsg();
        let startS, stopS, startEp, stopEp;
        if(this.episodeCount) {
            [startS, stopS, startEp, stopEp] = this.calcStartStopValues();
        } else {
            startS = parseInt(this.startS.value)-1;
            stopS = parseInt(this.stopS.value)-1;
            startEp = parseInt(this.startEp.value)-1;
            stopEp = parseInt(this.stopEp.value)-1;
        }
        let count = 0;
        let flag = false;
        for (let s = 0; s < this.inputElementList.length; s++) {
            for (let ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                count++;
                if(s === startS && ep === startEp) {
                    flag = true;
                }
                if(flag) {
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
                if(s === stopS && ep === stopEp) {
                    flag = false;
                }
            }
        }
        this.errMsg.innerHTML = 'Urls generiert!';
        this.errMsg.classList.add('create-msg-success');
    }

    private calcStartStopValues() {
        let startS = 0, stopS = 0, startEp = 0, stopEp = 0, count = 0;
        for (let s = 0; s < this.inputElementList.length; s++) {
            for (let ep = 0; ep < this.inputElementList[s].episodes.length; ep++) {
                count++;
                if(count === parseInt(this.startEp.value)) {
                    startS = s;
                    startEp = ep;
                }
                if(count === parseInt(this.stopEp.value)) {
                    stopS = s;
                    stopEp = ep;
                }
            }
        }
        return [startS, stopS, startEp, stopEp];
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
        const button = PageEdit.createButton('button-silver', 'Seasons hinzufügen', function () {
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
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
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
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
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
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
            input.placeholder = '';
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
            input.placeholder = placeholder;
        });
        return input;
    }
}