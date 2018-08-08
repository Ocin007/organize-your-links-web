class PageOptions {

    private activePage: ForeachElement;
    private countCurrent: HTMLParagraphElement;
    private countMax: HTMLParagraphElement;

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
        } else {
            this.renderNoContent();
        }
    }

    private renderForPlayList() {
        const label = PageOptions.createLabel();
        const actionContainer = this.createActionsContainer();
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

    private createActionsContainer() {
        const container = PageDetail.createDiv('opt-action-container');
        container.appendChild(this.createAction(
            'img/play.ico', 'play', 'Ungesehene Folgen in Tab öffnen', this.playButton, 'no-border'
        ));
        container.appendChild(this.createAction(
            'img/close.ico', 'close-tab', 'Geöffnete Tabs schließen', this.closeTabButton
        ));
        container.appendChild(this.createAction(
            'img/watched.ico', 'watched', 'Folgen als gesehen markieren', this.watchedButton
        ));
        container.appendChild(this.createAction(
            'img/not-watched.ico', 'not-watched', 'Folgen als nicht gesehen markieren', this.notWatchedButton
        ));
        container.appendChild(this.createAction(
            'img/add-button.ico', 'add', 'Alle eine Folge weiter', this.addButton, 'add-sub'
        ));
        container.appendChild(this.createAction(
            'img/subtr-button.ico', 'subtr', 'Alle eine Folge zurück', this.subtrButton, 'add-sub'
        ));
        container.appendChild(this.createAction(
            'img/arrow-left.ico', 'arrow-left', 'Verschiebene alle abgeschlossenen Serien', this.arrowLeftButton
        ));
        container.appendChild(this.createAction(
            'img/arrow-right.ico', 'arrow-right', 'Verschiebe alle nicht angefangenen Serien', this.arrowRightButton
        ));
        return container;
    }

    private createCountContainer() {
        const container = PageDetail.createDiv('count-actions');
        this.countCurrent = document.createElement('p');
        this.countCurrent.innerHTML = '-';
        this.countCurrent.classList.add('count-number-field');
        const node1 = document.createElement('p');
        node1.innerHTML = 'von';
        this.countMax = document.createElement('p');
        this.countMax.innerHTML = '-';
        this.countMax.classList.add('count-number-field');
        const node2 = document.createElement('p');
        node2.innerHTML = 'ausgeführt.';
        container.appendChild(this.countCurrent);
        container.appendChild(node1);
        container.appendChild(this.countMax);
        container.appendChild(node2);
        return container;
    }

    private createAction(src: string, alt: string, label: string, callback: Function, token?: string) {
        const container = PageDetail.createDiv('opt-action');
        container.classList.add('list-button-container');
        if(token !== undefined) {
            container.classList.add(token);
        }
        const img = PageDetail.createImg(src, alt);
        const instance = this;
        img.addEventListener('click', function () {
            const changedElements = [];
            let countAll = 0;
            let countSuccess = 0;
            instance.activePage.foreachListElement(function (element: ListElement) {
                countAll++;
                let data = callback(instance, element);
                if(data === undefined) {
                    return;
                }
                countSuccess++;
                if(data !== true) {
                    changedElements.push(data);
                }
            });
            instance.countCurrent.innerHTML = countSuccess.toString();
            instance.countMax.innerHTML = countAll.toString();
            instance.serverData.put(changedElements);
        });
        container.appendChild(img);
        const labelElement = document.createElement('p');
        labelElement.innerHTML = label;
        container.appendChild(labelElement);
        return container;
    }

    private playButton(instance: PageOptions, element: ListElement) {
        if(!element.currentEpWatched()) {
            return element.playButton();
        }
    }

    private closeTabButton(instance: PageOptions, element: ListElement) {
        return element.closeTabButton();
    }

    private watchedButton(instance: PageOptions, element: ListElement) {
        return element.watchedButton();
    }

    private notWatchedButton(instance: PageOptions, element: ListElement) {
        return element.notWatchedButton();
    }

    private addButton(instance: PageOptions, element: ListElement) {
        return element.addButton();
    }

    private subtrButton(instance: PageOptions, element: ListElement) {
        return element.subtrButton();
    }

    private arrowLeftButton(instance: PageOptions, element: ListElement) {
        //TODO: arrowLeftButton
        navMap.flag = true;
        return element.arrowLeftButton(5/100, function () {

        });
    }

    private arrowRightButton(instance: PageOptions, element: ListElement) {
        //TODO: arrowRightButton
    }
}