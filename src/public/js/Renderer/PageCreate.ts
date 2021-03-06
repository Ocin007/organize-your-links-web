class PageCreate implements Slideable, ForeachElement {

    private inputDE: HTMLInputElement;
    private inputEN: HTMLInputElement;
    private inputJPN: HTMLInputElement;
    private tvdbID: number = -1;

    private msgContainer: HTMLElement;
    private tvdbSearch: TvdbSearchResults;

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
        this.pageElement.style.display = 'flex';
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

    setResults(tvdbID: number, nameDE: string, nameEN: string, nameJPN: string) {
        this.inputDE.value = nameDE;
        this.inputEN.value = nameEN;
        this.inputJPN.value = nameJPN;
        this.tvdbID = tvdbID;
        this.msgContainer.innerHTML = 'TVDB ID: #'+tvdbID;
        this.msgContainer.classList.remove('create-msg-success');
        this.msgContainer.classList.remove('create-msg-error');
    }

    initPage() {
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(PageCreate.generateTitel());
        this.appendTvdbSearch();
        this.pageElement.appendChild(this.generateInputContainer('img/germany-big.png', 'germany', 'inputDE'));
        this.pageElement.appendChild(this.generateInputContainer('img/uk-big.png', 'uk', 'inputEN'));
        this.pageElement.appendChild(this.generateInputContainer('img/japan-big.png', 'japan', 'inputJPN'));
        this.pageElement.appendChild(this.generateMsgContainer());
        this.pageElement.appendChild(this.generateButtonContainer());
    }

    private appendTvdbSearch() {
        const searchButton = PageCreate.createDiv(['custom-button'],
            [PageDetail.createImg('img/search-icon.ico', 'search')]
        );
        const input = PageCreate.createTextInput(['name-input'], 'TVDB durchsuchen...');
        this.pageElement.appendChild(PageCreate.createDiv(['name-input-container'],
            [searchButton, input])
        );
        const container = PageCreate.createDiv(['search-result-container']);
        this.pageElement.appendChild(PageCreate.createDiv(['create-msg-wrapper'], [container]));
        this.tvdbSearch = new TvdbSearchResults(searchButton, input, container, this);
        this.tvdbSearch.init();
    }

    private postNewElement() {
        const data = this.createNewDataListElement();
        const instance = this;
        this.serverData.post([data], function (error) {
            instance.msgContainer.classList.remove('create-msg-success');
            instance.msgContainer.classList.remove('create-msg-error');
            instance.msgContainer.classList.add('create-msg-error');
            instance.inputDE.classList.remove('name-input-error');
            instance.inputEN.classList.remove('name-input-error');
            instance.inputJPN.classList.remove('name-input-error');
            instance.msgContainer.innerHTML = JSON.stringify(error[0]);
            if(error.includes('list element no valid series: 0')) {
                instance.msgContainer.innerHTML = 'Es muss mindestens 1 Name angegeben werden. ';
                instance.inputDE.classList.remove('name-input-error');
                instance.inputEN.classList.remove('name-input-error');
                instance.inputJPN.classList.remove('name-input-error');
            }
            if(error.includes('duplicate series name: name_de')) {
                instance.inputDE.classList.add('name-input-error');
                instance.msgContainer.innerHTML = 'Name existiert bereits. ';
            }
            if(error.includes('duplicate series name: name_en')) {
                instance.inputEN.classList.add('name-input-error');
                instance.msgContainer.innerHTML = 'Name existiert bereits. ';
            }
            if(error.includes('duplicate series name: name_jpn')) {
                instance.inputJPN.classList.add('name-input-error');
                instance.msgContainer.innerHTML = 'Name existiert bereits. ';
            }
            if(error.includes('series names invalid')) {
                instance.msgContainer.innerHTML = 'Serie konnte nicht hinzugefügt werden. Bitte andere Namen wählen.';
            }
        }, function () {
            instance.msgContainer.innerHTML = 'Neue Serie angelegt!';
            instance.msgContainer.classList.remove('create-msg-success');
            instance.msgContainer.classList.remove('create-msg-error');
            instance.msgContainer.classList.add('create-msg-success');
            setTimeout(reloadEverything, 1000);
        });
    }

    private resetInput() {
        this.tvdbSearch.reset();
        this.inputDE.value = '';
        this.inputEN.value = '';
        this.inputJPN.value = '';
        this.tvdbID = -1;
        this.inputDE.classList.remove('name-input-error');
        this.inputEN.classList.remove('name-input-error');
        this.inputJPN.classList.remove('name-input-error');
        this.msgContainer.innerHTML = '';
        this.msgContainer.classList.remove('create-msg-success');
        this.msgContainer.classList.remove('create-msg-error');
    }

    private static generateTitel() {
        const title = document.createElement('h1');
        title.innerHTML = 'Neue Serie anlegen';
        return PageCreate.createDiv(['title-container-create'], [title]);
    }

    private generateInputContainer(src: string, alt: string, inputField: string) {
        const img = PageDetail.createImg(src, alt);
        this[inputField] = PageCreate.createTextInput(['name-input'], 'Name der Serie');
        return PageCreate.createDiv(['name-input-container'], [img, this[inputField]]);
    }

    private generateMsgContainer() {
        this.msgContainer = PageCreate.createDiv(['create-msg-container']);
        return PageCreate.createDiv(['create-msg-wrapper'], [this.msgContainer]);
    }

    private generateButtonContainer() {
        const buttonSave = PageCreate.createDiv(['custom-button', 'button-green']);
        buttonSave.innerHTML = 'Erstellen';
        const buttonRevert = PageCreate.createDiv(['custom-button', 'button-red']);
        buttonRevert.innerHTML = 'Verwerfen';
        const instance = this;
        buttonSave.addEventListener('click', function () {
            instance.postNewElement();
        });
        buttonRevert.addEventListener('click', function () {
            instance.resetInput();
        });
        return PageCreate.createDiv(['create-button-container'], [buttonSave, buttonRevert]);
    }

    static createDiv(classArray: string[], appendArray?: HTMLElement[]) {
        const div = document.createElement('div');
        for (let i = 0; i < classArray.length; i++) {
            div.classList.add(classArray[i]);
        }
        if(appendArray !== undefined) {
            for (let i = 0; i < appendArray.length; i++) {
                div.appendChild(appendArray[i]);
            }
        }
        return div;
    }

    private static createTextInput(classArray: string[], placeholder: string) {
        const input = document.createElement('input');
        input.type = 'text';
        for (let i = 0; i < classArray.length; i++) {
            input.classList.add(classArray[i]);
        }
        input.placeholder = placeholder;
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

    private createNewDataListElement(): DataListElement {
        return {
            id: '',
            tvdbId: this.tvdbID,
            name_de: this.inputDE.value,
            name_en: this.inputEN.value,
            name_jpn: this.inputJPN.value,
            list: ListID.NOT_WATCHED,
            rank: 0,
            favorite: false,
            seasons: []
        };
    }
}