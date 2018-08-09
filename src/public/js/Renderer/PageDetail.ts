class PageDetail implements Slideable, ForeachElement {

    private static readonly colorBrightness = 255;

    private thumbnail: HTMLImageElement;
    private detailContainer: HTMLElement;

    private pageNumberElement: HTMLParagraphElement;
    private infoSeasonContainer: HTMLElement;

    private infoList: HTMLParagraphElement;
    private infoProgress: HTMLParagraphElement;
    private infoNotWatched: HTMLParagraphElement;
    private infoWatched: HTMLParagraphElement;
    private infoMaxAmount: HTMLParagraphElement;

    private currentIndex: number = 0;
    private seasonUrl: string = '';
    private listElementMap: {} = {};

    private sIndex: number;
    private epIndex: number;
    private epCount: number;
    private maxCount: number;
    private success: boolean;

    constructor(
        private pageElement: HTMLElement,
        private tabElement: HTMLElement,
        private serverData: ServerData
    ) {}

    showElement() {
        this.showPage();
        this.activateTab();
    }

    hideElement() {
        this.hidePage();
        this.deactivateTab();
    }

    showPage() {
        this.pageElement.style.display = 'flex';
    }

    activateTab() {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    }

    hidePage() {
        this.pageElement.style.display = 'none';
    }

    deactivateTab() {
        this.tabElement.classList.remove('tab-active');
    }

    getPageElement() {
        return this.pageElement;
    }

    foreachListElement(callback: Function, opt?: any) {

    }

    getDataIndexList() {

    }

    getListId() {

    }

    getElementWithDataIndex(dataIndex: number) {

    }

    registerListElement(id: string, listElement: ListElement) {
        this.listElementMap[id] = listElement;
    }

    initPage() {
        this.pageElement.innerHTML = '';
        this.thumbnail = PageDetail.createImg('', 'thumbnail');
        const instance = this;
        this.thumbnail.addEventListener('click', function () {
            window.open(instance.seasonUrl);
        });
        this.detailContainer = PageDetail.createDiv('detail-container');
        const thumbnailAndDetails = PageDetail.createDiv('big-thumbnail');
        thumbnailAndDetails.appendChild(this.thumbnail);
        const buttonContainer = this.generateButtonContainer();
        thumbnailAndDetails.appendChild(buttonContainer);
        const countContainer = this.generateCountCounainer();
        thumbnailAndDetails.appendChild(countContainer);
        const inputContainer = this.generateInputContainer();
        thumbnailAndDetails.appendChild(inputContainer);
        thumbnailAndDetails.appendChild(this.generateInfoContainer());
        this.pageElement.appendChild(thumbnailAndDetails);
        this.pageElement.appendChild(this.detailContainer);
    }

    renderPage(data: DataListElement) {
        this.setFlags(data);
        this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
        this.seasonUrl = data.seasons[this.sIndex].url;
        this.currentIndex = this.serverData.getIndexOfELement(data);
        this.pageNumberElement.innerHTML = (this.currentIndex+1).toString();
        this.setInfoValues(data);
        this.renderDetailsContainer(data);
    }

    private setFlags(data) {
        [
            this.sIndex,
            this.epIndex,
            this.epCount,
            this.maxCount,
            this.success
        ] = ListElement.getIndicesAndCountOfFirstNotWatched(data);
    }

    private renderDetailsContainer(data: DataListElement) {
        this.detailContainer.innerHTML = '';
        const titleContainer = PageDetail.createDiv('title-container');
        const title = document.createElement('h1');
        title.innerHTML = data.name;
        const instance = this;
        title.addEventListener('click', function () {
            const listElement = instance.listElementMap[data.id];
            switch (listElement.getListId()) {
                case ListID.WATCHED:
                    slideToWatched();
                    break;
                case ListID.PLAYLIST:
                    slideToPlaylist();
                    break;
                case ListID.NOT_WATCHED:
                    slideToNotWatched();
                    break;
            }
            const height = listElement.getElement().offsetTop-30;
            setTimeout(function () {
                window.scrollTo({
                    top: height,
                    behavior: 'smooth'
                });
            }, 120);
        });
        titleContainer.appendChild(title);
        this.detailContainer.appendChild(titleContainer);
        for (let s = 0; s < data.seasons.length; s++) {
            this.detailContainer.appendChild(this.createSegment(s, data))
        }
    }

    private createSegment(sIndex: number, data: DataListElement) {
        const segment = PageDetail.createDiv('list-segment');
        const label = document.createElement('h2');
        label.innerHTML = 'Season '+(sIndex+1);
        segment.appendChild(label);
        const epContainer = PageDetail.createDiv('episode-container');
        epContainer.classList.add('background-gray');
        for (let ep = 0; ep < data.seasons[sIndex].episodes.length; ep++) {
            epContainer.appendChild(this.createEpisode(sIndex, ep, data));
        }
        segment.appendChild(epContainer);
        return segment;
    }

    private createEpisode(sIndex: number, epIndex: number, data: DataListElement) {
        const episode = PageDetail.createDiv('episode-detail');
        const buttonContainer = this.generateEpisodeButtons(sIndex, epIndex, data, episode);
        episode.appendChild(buttonContainer);
        const epLabel = PageDetail.generateEpisodeLabel(epIndex, data.seasons[sIndex].episodes[epIndex].name);
        episode.appendChild(epLabel);
        return episode;
    }

    private static generateEpisodeLabel(epIndex: number, name: string) {
        const container = PageDetail.createDiv('episode-label');
        const prefix = document.createElement('p');
        prefix.classList.add('episode-prefix');
        prefix.innerHTML = 'Folge '+(epIndex+1);
        container.appendChild(prefix);
        const label = document.createElement('p');
        label.innerHTML = name;
        container.appendChild(label);
        return container;
    }

    private generateEpisodeButtons(sIndex: number, epIndex: number, data: DataListElement, episode: HTMLElement) {
        const container = PageDetail.createDiv('episode-button-container');
        container.appendChild(this.playButton(sIndex, epIndex, data));
        container.appendChild(this.watchedButton(sIndex, epIndex, data, episode));
        return container;
    }

    private generateButtonContainer() {
        const container = PageDetail.createDiv('list-button-container');
        container.appendChild(this.arrowLeftButton());
        container.appendChild(this.editButton());
        container.appendChild(this.deleteButton());
        container.appendChild(this.arrowRightButton());
        return container;
    }

    private playButton(sIndex: number, epIndex: number, data: DataListElement) {
        return ListElement.generateButton('img/play.ico', 'play', function () {
            window.open(data.seasons[sIndex].episodes[epIndex].url);
        });
    }

    private watchedButton(sIndex: number, epIndex: number, data: DataListElement, episode: HTMLElement) {
        const watchedStatus = document.createElement('img');
        const setAttributes = function (bool: boolean) {
            if (bool) {
                watchedStatus.src = 'img/watched.ico';
                watchedStatus.alt = 'watched';
                episode.classList.remove('font-green');
                episode.classList.add('font-light-green');
            } else {
                watchedStatus.src = 'img/not-watched.ico';
                watchedStatus.alt = 'not-watched';
                episode.classList.remove('font-light-green');
                episode.classList.add('font-green');
            }
        };
        setAttributes(data.seasons[sIndex].episodes[epIndex].watched);
        const instance = this;
        watchedStatus.addEventListener('click', function () {
            const oldBool = data.seasons[sIndex].episodes[epIndex].watched;
            data.seasons[sIndex].episodes[epIndex].watched = !oldBool;
            setAttributes(!oldBool);
            instance.updateInfo(data);
            instance.updateThumbnail(data);
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        return watchedStatus;
    }

    private updateInfo(data: DataListElement) {
        this.setFlags(data);
        this.setInfoValues(data);
    }

    private updateThumbnail(data: DataListElement) {
        this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
        this.seasonUrl = data.seasons[this.sIndex].url;
    }

    private arrowLeftButton() {
        const instance = this;
        return ListElement.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            if(instance.currentIndex > 0) {
                instance.currentIndex--;
            } else {
                instance.currentIndex = instance.serverData.getListLen() - 1;
            }
            const data = instance.serverData.getListElement(instance.currentIndex);
            instance.renderPage(data);
        });
    }

    private arrowRightButton() {
        const instance = this;
        return ListElement.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            if(instance.currentIndex + 1 < instance.serverData.getListLen()) {
                instance.currentIndex++;
            } else {
                instance.currentIndex = 0;
            }
            const data = instance.serverData.getListElement(instance.currentIndex);
            instance.renderPage(data);
        });
    }

    private editButton() {
        const instance = this;
        return ListElement.generateButton('img/edit.ico', 'edit', function () {
            //TODO: edit detail
        });
    }

    private deleteButton() {
        const instance = this;
        return ListElement.generateButton('img/delete.ico', 'delete', function () {
            //TODO: delete detail
        });
    }

    private generateCountCounainer() {
        const container = PageDetail.createDiv('page-count');
        const right = PageDetail.createDiv('align-right');
        const count = document.createElement('p');
        right.appendChild(count);
        this.pageNumberElement = count;
        container.appendChild(right);
        const node = document.createElement('p');
        node.innerHTML = 'von';
        container.appendChild(node);
        const left = PageDetail.createDiv('align-left');
        const maxCount = document.createElement('p');
        maxCount.innerHTML = this.serverData.getListLen().toString();
        left.appendChild(maxCount);
        container.appendChild(left);
        return container;
    }

    private generateInputContainer() {
        const container = PageDetail.createDiv('input-container');
        const label = document.createElement('label');
        label.htmlFor = 'search-textfield';
        label.innerHTML = 'Suche:';
        container.appendChild(label);
        const input = document.createElement('input');
        input.id = 'search-textfield';
        input.type = 'search';
        input.setAttribute('list', 'all-names');
        const instance = this;
        input.addEventListener('keypress', function (ev: any) {
            if(ev.key !== 'Enter') {
                return;
            }
            const index = instance.serverData.getIndexOfElementWithName(ev.target.value);
            if(index === -1) {
                return;
            }
            instance.renderPage(instance.serverData.getListElement(index));
        });
        container.appendChild(input);
        const dataList = document.createElement('dataList');
        dataList.id = 'all-names';
        this.fillWithOptions(dataList);
        container.appendChild(dataList);
        return container;
    }

    private fillWithOptions(dataList: HTMLElement) {
        const len = this.serverData.getListLen();
        for (let i = 0; i < len; i++) {
            let data = this.serverData.getListElement(i);
            let option = document.createElement('option');
            option.innerHTML = data.name;
            dataList.appendChild(option);
        }
    }

    private generateInfoContainer() {
        const container = PageDetail.createDiv('info-container');
        const label = document.createElement('h3');
        label.innerHTML = 'Details';
        container.appendChild(label);
        const standard = document.createElement('div');
        const [infoList, p1] = PageDetail.generateInfoWrapper('Liste', '');
        const [infoProgress, p2] = PageDetail.generateInfoWrapper('Fortschritt', '');
        const [infoWatched, p3] = PageDetail.generateInfoWrapper('Bereits geschaut', '');
        const [infoNotWatched, p4] = PageDetail.generateInfoWrapper('Noch nicht geschaut', '');
        const [infoMaxAmount, p5] = PageDetail.generateInfoWrapper('# Folgen insgesamt', '');
        p2.classList.add('info-progress');
        this.infoList = p1;
        this.infoProgress = p2;
        this.infoWatched = p3;
        this.infoNotWatched = p4;
        this.infoMaxAmount = p5;
        standard.appendChild(infoList);
        standard.appendChild(infoProgress);
        standard.appendChild(infoWatched);
        standard.appendChild(infoNotWatched);
        standard.appendChild(infoMaxAmount);
        container.appendChild(standard);
        this.infoSeasonContainer = PageDetail.createDiv('info-episodes-per-season');
        container.appendChild(this.infoSeasonContainer);
        return container;
    }

    private setInfoListValue(list: ListID) {
        switch (list) {
            case ListID.WATCHED:
                this.infoList.innerHTML = 'Fertig gesehen';
                break;
            case ListID.PLAYLIST:
                this.infoList.innerHTML = 'Aktuelle Playlist';
                break;
            case ListID.NOT_WATCHED:
                this.infoList.innerHTML = 'Noch nicht gesehen';
                break;
        }
    }

    private setInfoValues(data: DataListElement) {
        let count = 0;
        this.infoSeasonContainer.innerHTML = '';
        for (let s = 0; s < data.seasons.length; s++) {
            let countPerSeason = 0;
            for (let ep = 0; ep < data.seasons[s].episodes.length; ep++) {
                if(data.seasons[s].episodes[ep].watched) {
                    count++;
                }
                countPerSeason++;
            }
            let label = '# Folgen Season '+(s+1);
            this.infoSeasonContainer.appendChild(PageDetail.generateInfoWrapper(label, countPerSeason.toString())[0]);
        }
        let result = ((count/this.maxCount)*100).toFixed(1);
        this.infoProgress.innerHTML = result+'%';
        const [r, g] = PageDetail.calculateColor(parseFloat(result));
        this.infoProgress.style.color = 'rgb('+r+', '+g+', 0)';
        this.infoNotWatched.innerHTML = (this.maxCount-count).toString();
        this.infoWatched.innerHTML = count.toString();
        this.setInfoListValue(data.list);
        this.infoMaxAmount.innerHTML = this.maxCount.toString();
    }

    private static generateInfoWrapper(label: string, value: string): [HTMLDivElement, HTMLParagraphElement] {
        const wrapper = PageDetail.createDiv('info-wrapper');
        const labelElement = document.createElement('p');
        labelElement.innerHTML = label;
        wrapper.appendChild(labelElement);
        const p = document.createElement('p');
        p.innerHTML = value;
        wrapper.appendChild(p);
        return [wrapper, p];
    }

    static createImg(src: string, alt: string) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        return img;
    }

    static createDiv(str: string) {
        const div = document.createElement('div');
        div.classList.add(str);
        return div;
    }

    private static calculateColor(result: number) {
        let r, g;
        if(result <= 50) {
            r = PageDetail.colorBrightness;
            g = (result/50) * PageDetail.colorBrightness;
        } else {
            r = ((100-result)/50) * PageDetail.colorBrightness;
            g = PageDetail.colorBrightness;
        }
        return [r, g];
    }
}