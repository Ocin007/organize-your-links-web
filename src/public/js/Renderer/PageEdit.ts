class PageEdit implements Slideable, ForeachElement {

    private oldData: DataListElement;
    private newData: DataListElement;

    private inputElementList: {
        url: HTMLInputElement,
        thumbnail: HTMLInputElement,
        episodes: {
            url: HTMLInputElement,
            name: HTMLInputElement
        }[]
    }[] = [];

    private zerosS: HTMLInputElement;
    private zerosEp: HTMLInputElement;
    private genericMode: string;
    private genUrl: HTMLInputElement;

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
        this.pageElement.appendChild(PageCreate.createDiv(['edit-no-data'], [
            PageEdit.generateText('h1', 'Keine Serie zum Bearbeiten ausgewählt')
        ]));
    }

    renderPage(data: DataListElement) {
        this.oldData = data;
        this.newData = data;
        this.pageElement.innerHTML = '';
        this.pageElement.appendChild(this.generateTitleContainer());
        this.pageElement.appendChild(this.generateGeneralEditTools());
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
            instance.serverData.put([instance.newData], reloadAllData);
        });
        const revert = PageCreate.createDiv(['custom-button', 'button-red']);
        revert.innerHTML = 'Verwerfen';
        revert.addEventListener('click', function () {
            instance.renderPage(instance.oldData);
        });
        return PageCreate.createDiv(['button-wrapper-edit'], [save, revert]);
    }

    private generateGeneralEditTools() {
        this.zerosS = PageEdit.createInputNum('0', 'generic-fill-zero-s');
        this.zerosEp = PageEdit.createInputNum('0', 'generic-fill-zero-ep');
        const radioEp = this.createInputRadio('generic-mode-ep', '1', true);
        radioEp.checked = true;
        const radioSEp = this.createInputRadio('generic-mode-s-ep', '2', false);
        this.genUrl = PageEdit.createInputText('Generische Url mit {{s}}, {{ep}}');
        return PageCreate.createDiv(['edit-tools'], [
            PageCreate.createDiv(['edit-wrapper'], [
                this.createButton('button-green', 'TVDB Daten einfügen', this.buttonFillWithTvdbData)
            ]),
            this.createAddSeasonAction(),
            PageCreate.createDiv(['generic-url-container', 'edit-grow'], [
                PageCreate.createDiv(['edit-wrapper'], [
                    this.createButton('button-silver', 'Los', this.buttonFillWithGenericUrls),
                    this.genUrl
                ]),
                PageCreate.createDiv(['edit-wrapper'], [
                    radioEp,
                    PageEdit.createLabel('generic-mode-ep', '{{ep}}'),
                    radioSEp,
                    PageEdit.createLabel('generic-mode-s-ep', '{{s}} & {{ep}}')
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

    }

    private buttonAppendSeason(numEpisodes: number) {

    }

    private buttonFillWithGenericUrls() {

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
        const instance = this;
        input.addEventListener('click', function () {
            input.checked = true;
            instance.genericMode = input.value;
        });
        return input;
    }

    private static createInputText(placeholder: string) {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('edit-input');
        input.classList.add('edit-text');
        input.placeholder = placeholder;
        return input;
    }
}