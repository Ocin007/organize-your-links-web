class PageDetail implements Slideable, ForeachElement {

    private readonly colorBrightness = Settings.colorBrightness;
    private readonly episodeCount = Settings.episodeCount;

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
    private episodeList: HTMLElement[][] = [];

    private sIndex: number;
    private epIndex: number;
    private epCount: number;
    private maxCount: number;
    private success: boolean;

    constructor(
        private pageElement: HTMLElement,
        private tabElement: HTMLElement,
        private serverData: ServerData,
        private editPage: PageEdit,
        private deletePage: PageDelete
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
        this.renderPage(this.serverData.getListElement(this.currentIndex));
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
        const jumpButton = this.generateJumpButton();
        thumbnailAndDetails.appendChild(jumpButton);
        thumbnailAndDetails.appendChild(this.generateInfoContainer());
        this.pageElement.appendChild(thumbnailAndDetails);
        this.pageElement.appendChild(this.detailContainer);
    }

    renderPage(data: DataListElement) {
        if(data === undefined) {
            return;
        }
        this.setFlags(data);
        this.episodeList = [];
        if(data.seasons.length !== 0) {
            this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
            this.seasonUrl = data.seasons[this.sIndex].url;
        }
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

    private setupSeriesFavoriteButton(data: DataListElement) {
        let favoriteButton = PageDetail.createImg('', '');
        favoriteButton.classList.add('series-favorite-button');
        if(data.favorite) {
            favoriteButton.src = 'img/favorite-big.ico';
            favoriteButton.alt = 'favorite-big';
        } else {
            favoriteButton.src = 'img/not-favorite-big.ico';
            favoriteButton.alt = 'not-favorite-big';
        }
        const instance = this;
        favoriteButton.addEventListener('click', function () {
            const oldBool = data.favorite;
            data.favorite = !oldBool;
            if(oldBool) {
                favoriteButton.src = 'img/not-favorite-big.ico';
                favoriteButton.alt = 'not-favorite-big';
            } else {
                favoriteButton.src = 'img/favorite-big.ico';
                favoriteButton.alt = 'favorite-big';
            }
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        return favoriteButton;
    }

    private renderDetailsContainer(data: DataListElement) {
        this.detailContainer.innerHTML = '';
        this.detailContainer.appendChild(this.setupSeriesFavoriteButton(data));
        const titleContainer = this.generateTitleContainer(data);
        this.detailContainer.appendChild(titleContainer);
        let epCount = 0;
        for (let s = 0; s < data.seasons.length; s++) {
            this.detailContainer.appendChild(this.createSegment(s, epCount, data));
            epCount += data.seasons[s].episodes.length;
        }
    }

    private generateTitleContainer(data: DataListElement) {
        const titleContainer = PageDetail.createDiv('title-container');
        const lang = PageDetail.calcTitleLang(data);
        const titleMain = this.generateMainTitle(data, lang);

        const titleDE = document.createElement('h5');
        titleDE.innerHTML = (data[TitleLang.DE] !== '') ? data[TitleLang.DE] : '-';
        const titleEN = document.createElement('h5');
        titleEN.innerHTML = (data[TitleLang.EN] !== '') ? data[TitleLang.EN] : '-';
        const titleJPN = document.createElement('h5');
        titleJPN.innerHTML = (data[TitleLang.JPN] !== '') ? data[TitleLang.JPN] : '-';

        let wrapper1;
        let wrapper2;
        const wrapperMain = PageDetail.generateTitleWrapper(lang, titleMain, 'main-title');
        switch (lang) {
            case TitleLang.DE:
                wrapper1 = PageDetail.generateTitleWrapper(TitleLang.EN, titleEN);
                wrapper2 = PageDetail.generateTitleWrapper(TitleLang.JPN, titleJPN);
                break;
            case TitleLang.EN:
                wrapper1 = PageDetail.generateTitleWrapper(TitleLang.DE, titleDE);
                wrapper2 = PageDetail.generateTitleWrapper(TitleLang.JPN, titleJPN);
                break;
            case TitleLang.JPN:
                wrapper1 = PageDetail.generateTitleWrapper(TitleLang.DE, titleDE);
                wrapper2 = PageDetail.generateTitleWrapper(TitleLang.EN, titleEN);
                break;
        }
        titleContainer.appendChild(wrapperMain);
        titleContainer.appendChild(wrapper1);
        titleContainer.appendChild(wrapper2);
        return titleContainer;
    }

    private static generateTitleWrapper(lang: TitleLang, append: HTMLElement, token?: string) {
        const container = PageDetail.createDiv('title-wrapper');
        if(token !== undefined) {
            container.classList.add(token);
        }
        let img;
        switch (lang) {
            case TitleLang.DE:
                img = PageDetail.createImg('img/germany.png', 'germany');
                break;
            case TitleLang.EN:
                img = PageDetail.createImg('img/uk.png', 'uk');
                break;
            case TitleLang.JPN:
                img = PageDetail.createImg('img/japan.png', 'japan');
                break;
        }
        container.appendChild(img);
        container.appendChild(append);
        return container;
    }

    private generateMainTitle(data: DataListElement, lang: TitleLang) {
        const title = document.createElement('h1');
        if(data[lang] !== '') {
            title.innerHTML = data[lang];
        }
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
        return title;
    }

    private createSegment(sIndex: number, epCount: number, data: DataListElement) {
        const segment = PageDetail.createDiv('list-segment');
        const label = document.createElement('h2');
        label.innerHTML = 'Season '+(sIndex+1);
        let watchedSeason;
        if(PageDetail.checkSeasonWatched(sIndex, data)) {
            watchedSeason = PageDetail.createImg('img/watched.ico', 'watched');
        } else {
            watchedSeason = PageDetail.createImg('img/not-watched.ico', 'not-watched');
        }
        label.appendChild(watchedSeason);
        let favoriteSeason;
        if(data.seasons[sIndex].favorite) {
            favoriteSeason = PageDetail.createImg('img/favorite.ico', 'favorite');
        } else {
            favoriteSeason = PageDetail.createImg('img/not-favorite.ico', 'not-favorite');
        }
        label.appendChild(favoriteSeason);
        segment.appendChild(label);
        const epContainer = PageDetail.createDiv('episode-container');
        epContainer.classList.add('background-gray');
        const seasonElements = [];
        for (let ep = 0; ep < data.seasons[sIndex].episodes.length; ep++) {
            let [episode, watchedButton] = this.createEpisode(sIndex, ep, epCount + ep, data, watchedSeason);
            epContainer.appendChild(episode);
            seasonElements.push([episode, watchedButton]);
        }
        const instance = this;
        watchedSeason.addEventListener('click', function () {
            const oldBool = PageDetail.checkSeasonWatched(sIndex, data);
            if(oldBool) {
                watchedSeason.src = 'img/not-watched.ico';
                watchedSeason.alt = 'not-watched';
            } else {
                watchedSeason.src = 'img/watched.ico';
                watchedSeason.alt = 'watched';
            }
            for (let ep = 0; ep < seasonElements.length; ep++) {
                PageDetail.setAttributesWatched(!oldBool, seasonElements[ep][0], seasonElements[ep][1]);
                data.seasons[sIndex].episodes[ep].watched = !oldBool;
            }
            instance.updateInfo(data);
            instance.updateThumbnail(data);
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        favoriteSeason.addEventListener('click', function () {
            const oldBool = data.seasons[sIndex].favorite;
            if(oldBool) {
                favoriteSeason.src = 'img/not-favorite.ico';
                favoriteSeason.alt = 'not-favorite';
            } else {
                favoriteSeason.src = 'img/favorite.ico';
                favoriteSeason.alt = 'favorite';
            }
            data.seasons[sIndex].favorite = !oldBool;
            instance.serverData.put([data], function () {

            });
        });
        segment.appendChild(epContainer);
        return segment;
    }

    private static checkSeasonWatched(sIndex: number, data: DataListElement) {
        for (let ep = 0; ep < data.seasons[sIndex].episodes.length; ep++) {
            if(!data.seasons[sIndex].episodes[ep].watched) {
                return false;
            }
        }
        return true;
    }

    private createEpisode(sIndex: number, epIndex: number, epCount: number, data: DataListElement, watchedSeason: HTMLImageElement) {
        const episode = PageDetail.createDiv('episode-detail');
        const [buttonContainer, watchedButton] = this.generateEpisodeButtons(sIndex, epIndex, data, episode, watchedSeason);
        episode.appendChild(buttonContainer);
        let epLabel;
        if(this.episodeCount) {
            epLabel = PageDetail.generateEpisodeLabel(epCount, data.seasons[sIndex].episodes[epIndex].name);
        } else {
            epLabel = PageDetail.generateEpisodeLabel(epIndex, data.seasons[sIndex].episodes[epIndex].name);
        }
        episode.appendChild(epLabel);
        if(this.episodeList[sIndex] === undefined) {
            this.episodeList[sIndex] = [episode];
        } else {
            this.episodeList[sIndex].push(episode);
        }
        return [episode, watchedButton];
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

    private generateEpisodeButtons(sIndex: number, epIndex: number, data: DataListElement, episode: HTMLElement, watchedSeason: HTMLImageElement) {
        const container = PageDetail.createDiv('episode-button-container');
        container.appendChild(this.playButton(sIndex, epIndex, data));
        const watchedButton = this.watchedButton(sIndex, epIndex, data, episode, watchedSeason);
        container.appendChild(watchedButton);
        const favoriteButton = this.favoriteButton(sIndex, epIndex, data, episode);
        container.appendChild(favoriteButton);
        return [container, watchedButton];
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

    private watchedButton(sIndex: number, epIndex: number, data: DataListElement, episode: HTMLElement, watchedSeason: HTMLImageElement) {
        const watchedStatus = document.createElement('img');
        PageDetail.setAttributesWatched(data.seasons[sIndex].episodes[epIndex].watched, episode, watchedStatus);
        const instance = this;
        watchedStatus.addEventListener('click', function () {
            const oldBool = data.seasons[sIndex].episodes[epIndex].watched;
            data.seasons[sIndex].episodes[epIndex].watched = !oldBool;
            PageDetail.setAttributesWatched(!oldBool, episode, watchedStatus);
            instance.updateInfo(data);
            instance.updateThumbnail(data);
            PageDetail.updateWatchedSeason(watchedSeason, data, sIndex);
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        return watchedStatus;
    }

    private favoriteButton(sIndex: number, epIndex: number, data: DataListElement, episode: HTMLElement) {
        const favoriteStatus = document.createElement('img');
        PageDetail.setAttributesFavorite(data.seasons[sIndex].episodes[epIndex].favorite, episode, favoriteStatus);
        const instance = this;
        favoriteStatus.addEventListener('click', function () {
            const oldBool = data.seasons[sIndex].episodes[epIndex].favorite;
            data.seasons[sIndex].episodes[epIndex].favorite = !oldBool;
            PageDetail.setAttributesFavorite(!oldBool, episode, favoriteStatus);
            instance.serverData.put([data], function () {
                instance.listElementMap[data.id].renderPageList();
            });
        });
        return favoriteStatus;
    }

    private static setAttributesWatched(bool: boolean, episode: HTMLElement, watchedStatus: HTMLImageElement) {
        if (bool) {
            watchedStatus.src = 'img/watched.ico';
            watchedStatus.alt = 'watched';
            episode.classList.remove('font-green');
            episode.classList.add('font-lighter-green');
        } else {
            watchedStatus.src = 'img/not-watched.ico';
            watchedStatus.alt = 'not-watched';
            episode.classList.remove('font-lighter-green');
            episode.classList.add('font-green');
        }
    }

    private static setAttributesFavorite(bool: boolean, episode: HTMLElement, favoriteStatus: HTMLImageElement) {
        if (bool) {
            favoriteStatus.src = 'img/favorite.ico';
            favoriteStatus.alt = 'favorite';
            episode.classList.add('font-gold');
            episode.classList.add('font-gold-hover');
        } else {
            favoriteStatus.src = 'img/not-favorite.ico';
            favoriteStatus.alt = 'not-favorite';
            episode.classList.remove('font-gold');
            episode.classList.remove('font-gold-hover');
        }
    }

    private updateInfo(data: DataListElement) {
        this.setFlags(data);
        this.setInfoValues(data);
    }

    private updateThumbnail(data: DataListElement) {
        this.thumbnail.src = data.seasons[this.sIndex].thumbnail;
        this.seasonUrl = data.seasons[this.sIndex].url;
    }

    private static updateWatchedSeason(watchedSeason: HTMLImageElement, data: DataListElement, sIndex: number) {
        if(PageDetail.checkSeasonWatched(sIndex, data)) {
            watchedSeason.src = 'img/watched.ico';
            watchedSeason.alt = 'watched';
        } else {
            watchedSeason.src = 'img/not-watched.ico';
            watchedSeason.alt = 'not-watched';
        }
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
            const data = instance.serverData.getListElement(instance.currentIndex);
            if(data === undefined) {
                return;
            }
            instance.editPage.renderPage(data);
            slideToEdit();
            setTimeout(function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 120);
        });
    }

    private deleteButton() {
        const instance = this;
        return ListElement.generateButton('img/delete.ico', 'delete', function () {
            const data = instance.serverData.getListElement(instance.currentIndex);
            if(data === undefined) {
                return;
            }
            instance.deletePage.showElement();
            instance.deletePage.renderPage(data);
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
        input.addEventListener('focus', function () {
            blockKeyboardOnInputFocus = true;
        });
        input.addEventListener('blur', function () {
            blockKeyboardOnInputFocus = false;
        });
        container.appendChild(input);
        const dataList = document.createElement('dataList');
        dataList.id = 'all-names';
        this.fillWithOptions(dataList);
        container.appendChild(dataList);
        return container;
    }

    private fillWithOptions(dataList: HTMLElement) {
        const list = this.serverData.getSortedListWithNames();
        for (let i = 0; i < list.length; i++) {
            let option = document.createElement('option');
            option.innerHTML = list[i];
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
        if(isNaN(Number(result))) {
            this.infoProgress.innerHTML = result;
        } else {
            this.infoProgress.innerHTML = result+'%';
        }
        const [r, g] = this.calculateColor(parseFloat(result));
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

    private calculateColor(result: number) {
        if(isNaN(result)) {
            return [this.colorBrightness, 0];
        }
        let r, g;
        if(result <= 50) {
            r = this.colorBrightness;
            g = (result/50) * this.colorBrightness;
        } else {
            r = ((100-result)/50) * this.colorBrightness;
            g = this.colorBrightness;
        }
        return [r, g];
    }

    private generateJumpButton() {
        const container = PageDetail.createDiv('jump-button-container');
        const button = PageDetail.createDiv('custom-button');
        button.classList.add('button-green');
        button.innerHTML = 'Zur aktuellen Folge';
        const instance = this;
        button.addEventListener('click', function () {
            if(instance.sIndex === undefined || instance.epIndex === undefined) {
                return;
            }
            const firstNotWatched = instance.episodeList[instance.sIndex][instance.epIndex];
            const height = firstNotWatched.offsetTop-30;
            window.scrollTo({
                top: height,
                behavior: 'smooth'
            });
        });
        container.appendChild(button);
        return container;
    }

    static calcTitleLang(data: DataListElement) {
        if(data[Settings.titleLanguage] !== '') {
            return Settings.titleLanguage;
        }
        if(data[TitleLang.DE] !== '') {
            return TitleLang.DE;
        }
        if(data[TitleLang.EN] !== '') {
            return TitleLang.EN;
        }
        if(data[TitleLang.JPN] !== '') {
            return TitleLang.JPN;
        }
    }
}