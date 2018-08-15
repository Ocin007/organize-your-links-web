class PageSettings {

    private readonly actionContainer: HTMLElement;
    private settings = {
        startPage: null,
        initialDataId: null,
        animationSpeedSingle: null,
        animationSpeedMulti: null,
        minSizeOfPlaylist: null,
        colorBrightness: null,
        titleLanguage: null
    };
    private startPage: HTMLSelectElement;
    private initialDataId: string;
    private animationSpeedSingle: string;
    private animationSpeedMulti: string;
    private minSizeOfPlaylist: HTMLInputElement;
    private colorBrightness: HTMLInputElement;
    private titleLanguage: string;

    constructor(private serverData: ServerData) {
        this.revertSettings();
        this.actionContainer = document.createElement('div');
        this.actionContainer.classList.add('opt-action-container');
    }

    renderSettings() {
        this.actionContainer.innerHTML = '';
        this.actionContainer.appendChild(this.titleLanguageAction());
        this.actionContainer.appendChild(this.startPageAction());
        this.actionContainer.appendChild(this.initialDataIdAction());
        this.actionContainer.appendChild(this.animationSpeedSingleAction());
        this.actionContainer.appendChild(this.animationSpeedMultiAction());
        this.actionContainer.appendChild(this.minSizeOfPlaylistAction());
        this.actionContainer.appendChild(this.colorBrightnessAction());
        return this.actionContainer;
    }

    getSaveButton() {
        const instance = this;
        return this.getButton('Speichern', 'button-green', function () {
            instance.saveSettings();
        });
    }

    getRevertButton() {
        const instance = this;
        return this.getButton('Verwerfen', 'button-red', function () {
            instance.revertSettings();
            instance.renderSettings();
        });
    }

    private getButton(label: string, token: string, callback: Function) {
        const button = document.createElement('div');
        button.classList.add('custom-button');
        button.classList.add(token);
        button.innerHTML = label;
        button.addEventListener('click', function () {
            callback();
        });
        return button;
    }

    private saveSettings() {
        this.updateSettingsObj();
        Settings.setAllSettings(this.settings);
        Settings.update(reloadEverything);
    }

    private updateSettingsObj() {
        this.settings.startPage = parseInt(this.startPage.value);
        this.settings.initialDataId = this.initialDataId;
        this.settings.animationSpeedSingle = parseFloat(this.animationSpeedSingle);
        this.settings.animationSpeedMulti = parseFloat(this.animationSpeedMulti);
        this.settings.minSizeOfPlaylist = parseInt(this.minSizeOfPlaylist.value);
        this.settings.colorBrightness = parseInt(this.colorBrightness.value);
        this.settings.titleLanguage = this.titleLanguage;
    }

    private revertSettings() {
        this.settings.startPage = Settings.startPage;
        this.settings.initialDataId = Settings.initialDataId;
        this.settings.animationSpeedSingle = Settings.animationSpeedSingle;
        this.settings.animationSpeedMulti = Settings.animationSpeedMulti;
        this.settings.minSizeOfPlaylist = Settings.minSizeOfPlaylist;
        this.settings.colorBrightness = Settings.colorBrightness;
        this.settings.titleLanguage = Settings.titleLanguage;
    }

    private static getActionDiv() {
        const container = document.createElement('div');
        container.classList.add('opt-action-settings');
        return container;
    }

    private static getLabel(label: string) {
        const p = document.createElement('p');
        p.innerHTML = label;
        return p;
    }

    private static getAction(label: string, append: HTMLElement) {
        const container = PageSettings.getActionDiv();
        const labelElement = PageSettings.getLabel(label);
        container.appendChild(append);
        container.appendChild(labelElement);
        return container;
    }

    private static getOptionTag(label: string, value: string, selected: boolean) {
        const option = document.createElement('option');
        option.innerHTML = label;
        option.value = value;
        option.selected = selected;
        return option;
    }

    private fillWithOptions(parent: HTMLElement) {
        const list = this.serverData.getSortedListWithNames();
        for (let i = 0; i < list.length; i++) {
            let dataIndex = this.serverData.getIndexOfElementWithName(list[i]);
            let data = this.serverData.getListElement(dataIndex);
            let selected = (data.id === this.settings.initialDataId && data[this.settings.titleLanguage] === list[i]);
            let option = PageSettings.getOptionTag('', list[i], selected);
            parent.appendChild(option);
        }
    }

    private getRangeControl(start: string, stop: string, step: string, value: string, callback: Function) {
        const container = document.createElement('div');
        container.classList.add('opt-range-control');
        const range = document.createElement('input');
        range.type = 'range';
        range.min = start;
        range.max = stop;
        range.step = step;
        range.value = value;
        const display = document.createElement('p');
        display.innerHTML = value;
        range.addEventListener('change', function () {
            display.innerHTML = range.value;
            callback(range.value);
        });
        container.appendChild(range);
        container.appendChild(display);
        return container;
    }

    private static getInputNumber(min: string, max: string, value: string) {
        const input = document.createElement('input');
        input.classList.add('input-small');
        input.type = 'number';
        input.min = min;
        input.max = max;
        input.value = value;
        return input;
    }

    private getRadioInput(src: string, alt: string, lang: TitleLang) {
        const div = document.createElement('div');
        div.classList.add('opt-single-radio');
        const img = PageDetail.createImg(src, alt);
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'titleLanguage';
        input.value = lang;
        input.checked = this.settings.titleLanguage === lang;
        div.appendChild(img);
        div.appendChild(input);
        const instance = this;
        div.addEventListener('click', function () {
            instance.titleLanguage = lang;
            input.checked = true;
        });
        return div;
    }

    private startPageAction() {
        this.startPage = document.createElement('select');
        this.startPage.appendChild(PageSettings.getOptionTag(
            'Fertig gesehen', ListID.WATCHED.toString(), this.settings.startPage === ListID.WATCHED
        ));
        this.startPage.appendChild(PageSettings.getOptionTag(
            'Aktuelle Playlist', ListID.PLAYLIST.toString(), this.settings.startPage === ListID.PLAYLIST
        ));
        this.startPage.appendChild(PageSettings.getOptionTag(
            'Noch nicht gesehen', ListID.NOT_WATCHED.toString(), this.settings.startPage === ListID.NOT_WATCHED
        ));
        this.startPage.appendChild(PageSettings.getOptionTag(
            'Details', ListID.DETAILS.toString(), this.settings.startPage === ListID.DETAILS
        ));
        this.startPage.appendChild(PageSettings.getOptionTag(
            'Neu', ListID.CREATE.toString(), this.settings.startPage === ListID.CREATE
        ));
        this.startPage.appendChild(PageSettings.getOptionTag(
            'Bearbeiten', ListID.EDIT.toString(), this.settings.startPage === ListID.EDIT
        ));
        this.startPage.appendChild(PageSettings.getOptionTag(
            'Ranking', ListID.RANKING.toString(), this.settings.startPage === ListID.RANKING
        ));
        return PageSettings.getAction('Startseite festlegen', this.startPage);
    }

    private initialDataIdAction() {
        const container = document.createElement('div');
        const input = document.createElement('input');
        input.classList.add('input-wide');
        input.type = 'search';
        input.setAttribute('list', 'all-names-settings');
        this.initialDataId = this.settings.initialDataId;
        const index = this.serverData.getIndexOfELement({id: this.initialDataId});
        input.value = this.serverData.getListElement(index)[this.settings.titleLanguage];
        const instance = this;
        input.addEventListener('input', function (ev: any) {
            const index = instance.serverData.getIndexOfElementWithName(ev.target.value);
            if(index === -1) {
                return;
            }
            instance.initialDataId = instance.serverData.getListElement(index).id;
        });
        input.addEventListener('focus', function () {
            input.value = '';
        });
        const dataList = document.createElement('dataList');
        dataList.id = 'all-names-settings';
        this.fillWithOptions(dataList);
        container.appendChild(input);
        container.appendChild(dataList);
        return PageSettings.getAction('Serie als Start-Serie bei Details anzeigen', container);
    }

    private animationSpeedSingleAction() {
        const instance = this;
        this.animationSpeedSingle = this.settings.animationSpeedSingle;
        const rangeControl = this.getRangeControl('0', '1', '0.01', this.settings.animationSpeedSingle.toString(), function (value: string) {
            instance.animationSpeedSingle = value;
        });
        return PageSettings.getAction('Animationsgeschw. Verschieben einer einzelnen Serie', rangeControl);
    }

    private animationSpeedMultiAction() {
        const instance = this;
        this.animationSpeedMulti = this.settings.animationSpeedMulti;
        const rangeControl = this.getRangeControl('0', '1', '0.01', this.settings.animationSpeedMulti.toString(), function (value: string) {
            instance.animationSpeedMulti = value;
        });
        return PageSettings.getAction('Animationsgeschw. Verschieben mehrerer Serien', rangeControl);
    }

    private minSizeOfPlaylistAction() {
        this.minSizeOfPlaylist = PageSettings.getInputNumber('0', '', this.settings.minSizeOfPlaylist.toString());
        return PageSettings.getAction('Mindestanzahl der Serien in Playlist', this.minSizeOfPlaylist);
    }

    private colorBrightnessAction() {
        this.colorBrightness = PageSettings.getInputNumber('0', '255', this.settings.colorBrightness.toString());
        return PageSettings.getAction('Farbhelligkeit, nur für Serienfortschritt', this.colorBrightness);
    }

    private titleLanguageAction() {
        const radioContainer = document.createElement('div');
        radioContainer.classList.add('opt-range-control');
        radioContainer.classList.add('opt-radio-buttons');
        this.titleLanguage = this.settings.titleLanguage;
        const divDE = this.getRadioInput('img/germany.png', 'germany', TitleLang.DE);
        const divEN = this.getRadioInput('img/uk.png', 'uk', TitleLang.EN);
        const divJPN = this.getRadioInput('img/japan.png', 'japan', TitleLang.JPN);
        radioContainer.appendChild(divDE);
        radioContainer.appendChild(divEN);
        radioContainer.appendChild(divJPN);
        return PageSettings.getAction('Titelsprache auswählen', radioContainer);
    }
}