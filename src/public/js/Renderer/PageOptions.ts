class PageOptions {

    private activePage: ForeachElement;
    private countCurrent: HTMLParagraphElement;
    private countMax: HTMLParagraphElement;

    private arrowActionIsActive: boolean = false;
    private elementIndexList: number[];
    private changedDataList: DataListElement[] = [];
    private currentArrayIndex: number;
    private inputField: HTMLInputElement;
    private inputFieldValue: number = 1;

    constructor(private opacityLayer: HTMLElement, private optionContainer: HTMLElement, private serverData: ServerData) {
        const instance = this;
        this.opacityLayer.addEventListener('click', function () {
            slideCloseOptions(instance.optionContainer);
            instance.hideElement();
        });
    }

    showElement() {
        this.opacityLayer.style.visibility = 'visible';
    }

    hideElement() {
        this.opacityLayer.style.visibility = 'hidden';
    }

    getOptionContainer() {
        return this.optionContainer;
    }

    renderPage(activePage: ForeachElement, activeFlag: number) {
        this.optionContainer.innerHTML = '';
        this.activePage = activePage;
        if(activeFlag === 2) {
            this.renderForPlayList();
        } else if(activeFlag === 1) {
            this.renderForWatched();
        } else if(activeFlag === 3) {
            this.renderForNotWatched();
        } else {
            this.renderNoContent();
        }
    }

    private renderForPlayList() {
        const label = PageOptions.createLabel();
        const actionContainer = this.createActionsContainerForPlaylist();
        const countActions = this.createCountContainer();
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(countActions);
    }

    private renderForWatched() {
        const label = PageOptions.createLabel();
        const actionContainer = this.createActionsContainerForWatched();
        const countActions = this.createCountContainer();
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(countActions);
    }

    private renderForNotWatched() {
        const label = PageOptions.createLabel();
        const actionContainer = this.createActionsContainerForNotWatched();
        const countActions = this.createCountContainer();
        this.optionContainer.appendChild(label);
        this.optionContainer.appendChild(actionContainer);
        this.optionContainer.appendChild(countActions);
    }

    private renderNoContent() {
        const p = document.createElement('p');
        p.classList.add('no-content');
        p.innerHTML = 'Für diese Seite sind keine Optionen verfügbar.';
        this.optionContainer.appendChild(p);
    }

    private static createLabel() {
        const label = document.createElement('h3');
        label.classList.add('opt-label');
        label.classList.add('font-green');
        label.innerHTML = 'Aktion für alle Folgen ausführen';
        return label;
    }

    private createActionsContainerForPlaylist() {
        const container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createAction(
            'img/play.ico', 'play', 'Ungesehene Folgen in Tab öffnen', PageOptions.playButton, 'no-border'
        ));
        container.appendChild(this.createAction(
            'img/close.ico', 'close-tab', 'Geöffnete Tabs schließen', PageOptions.closeTabButton
        ));
        container.appendChild(this.createAction(
            'img/watched.ico', 'watched', 'Folgen als gesehen markieren', PageOptions.watchedButton
        ));
        container.appendChild(this.createAction(
            'img/not-watched.ico', 'not-watched', 'Folgen als nicht gesehen markieren', PageOptions.notWatchedButton
        ));
        container.appendChild(this.createAction(
            'img/add-button.ico', 'add', 'Alle eine Folge weiter', PageOptions.addButton, 'add-sub'
        ));
        container.appendChild(this.createAction(
            'img/subtr-button.ico', 'subtr', 'Alle eine Folge zurück', PageOptions.subtrButton, 'add-sub'
        ));
        container.appendChild(this.createArrowAction(
            'img/arrow-left.ico', 'arrow-left', 'Verschiebe alle abgeschlossenen Serien', this.arrowLeftButton, FilterType.ALL_WATCHED
        ));
        container.appendChild(this.createArrowAction(
            'img/arrow-right.ico', 'arrow-right', 'Verschiebe alle nicht angefangenen Serien', this.arrowRightButton, FilterType.NO_WATCHED
        ));
        return container;
    }

    private createActionsContainerForWatched() {
        const container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createArrowAction(
            'img/arrow-right.ico', 'arrow-right', 'Verschiebe alle nicht abgeschlossenen Serien', this.arrowRightButton, FilterType.NOT_ALL_WATCHED
        ));
        return container;
    }

    private createActionsContainerForNotWatched() {
        const container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createArrowAction(
            'img/arrow-left.ico', 'arrow-left', 'Verschiebe alle angefangenen Serien', this.arrowLeftButton, FilterType.NOT_NO_WATCHED
        ));
        container.appendChild(this.createSpecialArrowAction(
            'img/arrow-left.ico', 'arrow-left', this.arrowLeftButton, 'random-input'
        ));
        return container;
    }

    private createCountContainer() {
        const container = PageDetail.createDiv('count-actions');
        const node0 = document.createElement('p');
        node0.innerHTML = 'Aktion für';
        this.countCurrent = document.createElement('p');
        this.countCurrent.innerHTML = '-';
        this.countCurrent.classList.add('count-number-field');
        const node1 = document.createElement('p');
        node1.innerHTML = 'von';
        this.countMax = document.createElement('p');
        this.countMax.innerHTML = this.activePage.getDataIndexList().length.toString();
        this.countMax.classList.add('count-number-field');
        const node2 = document.createElement('p');
        node2.innerHTML = 'Folgen ausgeführt.';
        container.appendChild(node0);
        container.appendChild(this.countCurrent);
        container.appendChild(node1);
        container.appendChild(this.countMax);
        container.appendChild(node2);
        return container;
    }

    private createAction(src: string, alt: string, label: string, callback: Function, token?: string) {
        const instance = this;
        return this.createActionContainer(src, alt, label, function () {
            const changedElements = [];
            let countAll = 0;
            let countSuccess = 0;
            instance.activePage.foreachListElement(function (element: ListElement) {
                countAll++;
                let data = callback(element);
                if(data === undefined) {
                    return;
                }
                countSuccess++;
                if(data !== true) {
                    changedElements.push(data);
                }
            });
            instance.countCurrent.innerHTML = countSuccess.toString();
            instance.serverData.put(changedElements);
        }, token);
    }

    private createArrowAction(src: string, alt: string, label: string, callback: Function, filterType: FilterType) {
        const instance = this;
        return this.createActionContainer(src, alt, label, function () {
            if(instance.arrowActionIsActive) {
                return;
            }
            instance.arrowActionIsActive = true;
            instance.elementIndexList = instance.getIndexListOfWatched(filterType);
            instance.currentArrayIndex = 0;
            instance.countCurrent.innerHTML = '0';
            callback(instance);
        });
    }

    private createSpecialArrowAction(src: string, alt: string, callback: Function, token?: string) {
        const container = PageDetail.createDiv('opt-action');
        container.classList.add('list-button-container');
        const img = PageDetail.createImg(src, alt);
        const instance = this;
        img.addEventListener('click', function () {
            if(instance.arrowActionIsActive) {
                return;
            }
            instance.elementIndexList = [];
            const indexList = instance.activePage.getDataIndexList();
            let amountElements: number;
            if(indexList.length < instance.inputFieldValue) {
                amountElements = indexList.length;
            } else {
                amountElements = instance.inputFieldValue;
            }
            for (let i = 0; i < amountElements; i++) {
                let random = Math.floor(Math.random() * (indexList.length-1));
                instance.elementIndexList.push(indexList[random]);
                indexList.splice(random, 1);
            }
            instance.arrowActionIsActive = true;
            instance.currentArrayIndex = 0;
            instance.countCurrent.innerHTML = '0';
            callback(instance);
        });
        container.appendChild(img);
        const labelContainer = document.createElement('div');
        if(token !== undefined) {
            labelContainer.classList.add(token);
        }
        const label1 = document.createElement('label');
        label1.htmlFor = 'input-random-number';
        label1.innerHTML = 'Verschiebe';
        labelContainer.appendChild(label1);
        this.inputField = document.createElement('input');
        this.inputField.id = 'input-random-number';
        this.inputField.type = 'number';
        this.inputField.min = '1';
        this.inputField.value = this.inputFieldValue.toString();
        this.inputField.addEventListener('input', function () {
            if(instance.inputField.value === '') {
                instance.inputFieldValue = 1;
            }
            instance.inputFieldValue = parseInt(instance.inputField.value);
        });
        labelContainer.appendChild(this.inputField);
        const label2 = document.createElement('label');
        label2.htmlFor = 'input-random-number';
        label2.innerHTML = 'zufällige Serien';
        labelContainer.appendChild(label2);
        container.appendChild(labelContainer);
        return container;
    }

    private getIndexListOfWatched(filterType: FilterType) {
        const indexList = this.activePage.getDataIndexList();
        const newList = [];
        for (let i = 0; i < indexList.length; i++) {
            let currentElement = this.activePage.getElementWithDataIndex(indexList[i]);
            if(filterType === FilterType.ALL_WATCHED) {
                if(currentElement.allEpWatched()) {
                    newList.push(indexList[i]);
                }
            } else if(filterType === FilterType.NO_WATCHED) {
                if(currentElement.noEpWatched()) {
                    newList.push(indexList[i]);
                }
            } else if(filterType === FilterType.NOT_ALL_WATCHED) {
                if(!currentElement.allEpWatched()) {
                    newList.push(indexList[i]);
                }
            } else if(filterType === FilterType.NOT_NO_WATCHED) {
                if(!currentElement.noEpWatched()) {
                    newList.push(indexList[i]);
                }
            }
        }
        return newList;
    }

    private createActionContainer(src: string, alt: string, label: string, callback: Function, token?: string) {
        const container = PageDetail.createDiv('opt-action');
        container.classList.add('list-button-container');
        if(token !== undefined) {
            container.classList.add(token);
        }
        const img = PageDetail.createImg(src, alt);
        img.addEventListener('click', function () {
            callback();
        });
        container.appendChild(img);
        const labelElement = document.createElement('p');
        labelElement.innerHTML = label;
        container.appendChild(labelElement);
        return container;
    }

    private static playButton(element: ListElement) {
        if(!element.currentEpWatched()) {
            return element.playButton();
        }
    }

    private static closeTabButton(element: ListElement) {
        return element.closeTabButton();
    }

    private static watchedButton(element: ListElement) {
        return element.watchedButton();
    }

    private static notWatchedButton(element: ListElement) {
        return element.notWatchedButton();
    }

    private static addButton(element: ListElement) {
        return element.addButton();
    }

    private static subtrButton(element: ListElement) {
        return element.subtrButton();
    }

    private arrowLeftButton(instance: PageOptions) {
        if(instance.currentArrayIndex < instance.elementIndexList.length) {
            let dataIndex = instance.elementIndexList[instance.currentArrayIndex];
            let currentElement = instance.activePage.getElementWithDataIndex(dataIndex);
            let data = currentElement.arrowLeftButton(10/100, function () {
                currentElement.renderAfterArrowLeft(instance.activePage.getListId()-1);
                instance.countCurrent.innerHTML = instance.currentArrayIndex.toString();
                instance.arrowLeftButton(instance);
            });
            instance.currentArrayIndex++;
            if(data !== undefined) {
                data.list--;
                instance.changedDataList.push(data);
            }
        } else {
            instance.updateChangedData(function () {
                instance.arrowActionIsActive = false;
            });
        }
    }

    private arrowRightButton(instance: PageOptions) {
        if(instance.currentArrayIndex < instance.elementIndexList.length) {
            let dataIndex = instance.elementIndexList[instance.currentArrayIndex];
            let currentElement = instance.activePage.getElementWithDataIndex(dataIndex);
            let data = currentElement.arrowRightButton(10/100, function () {
                currentElement.renderAfterArrowRight(instance.activePage.getListId()+1);
                instance.countCurrent.innerHTML = instance.currentArrayIndex.toString();
                instance.arrowRightButton(instance);
            });
            instance.currentArrayIndex++;
            if(data !== undefined) {
                data.list++;
                instance.changedDataList.push(data);
            }
        } else {
            instance.updateChangedData(function () {
                instance.arrowActionIsActive = false;
            });
        }
    }

    private updateChangedData(callback: Function) {
        const instance = this;
        this.serverData.put(this.changedDataList, function () {
            instance.changedDataList = [];
            callback();
        });
    }
}