class ListElement {
    private sIndex: number;
    private epIndex: number;
    private epCount: number;
    private maxCount: number;
    private success: boolean;
    private htmlListElement: HTMLDivElement;
    private data: DataListElement;
    private openTab: Window[] = [];

    private watchedStatus: HTMLImageElement;
    private countEp: HTMLSpanElement;
    private episode: HTMLParagraphElement;
    private thumbnail: HTMLImageElement;

    constructor(
        private dataIndex: number,
        private serverData: ServerData,
        private detailPage: PageDetail,
        private pageList: PageList,
        private editPage: PageEdit
    ) {
        const element = this.serverData.getListElement(this.dataIndex);
        [
            this.sIndex,
            this.epIndex,
            this.epCount,
            this.maxCount,
            this.success
        ] = ListElement.getIndicesAndCountOfFirstNotWatched(element);
    }

    getDataIndex() {
        return this.dataIndex;
    }

    getId() {
        return this.serverData.getListElement(this.dataIndex).id;
    }

    getName(lang: TitleLang) {
        let data = this.serverData.getListElement(this.dataIndex);
        if(data[lang] !== '') {
            return data[lang];
        }
        if(data[TitleLang.DE] !== '') {
            return data[TitleLang.DE];
        }
        if(data[TitleLang.EN] !== '') {
            return data[TitleLang.EN];
        }
        if(data[TitleLang.JPN] !== '') {
            return data[TitleLang.JPN];
        }
    }

    getListId() {
        return this.serverData.getListElement(this.dataIndex).list;
    }

    getElement() {
        return this.htmlListElement;
    }

    currentEpWatched() {
        return this.data.seasons[this.sIndex].episodes[this.epIndex].watched;
    }

    allEpWatched() {
        for (let s = this.data.seasons.length-1; s > -1; s--) {
            for (let ep = this.data.seasons[s].episodes.length-1; ep > -1; ep--) {
                if(!this.data.seasons[s].episodes[ep].watched) {
                    return false;
                }
            }
        }
        return true;
    }

    noEpWatched() {
        for (let s = 0; s < this.data.seasons.length; s++) {
            for (let ep = 0; ep < this.data.seasons[s].episodes.length; ep++) {
                if(this.data.seasons[s].episodes[ep].watched) {
                    return false;
                }
            }
        }
        return true;
    }

    showPageList() {
        this.pageList.showElement();
    }

    renderPageList() {
        this.pageList.generateMap();
        this.pageList.renderList();
    }

    playButton() {
        const len = this.openTab.push(window.open(this.data.seasons[this.sIndex].episodes[this.epIndex].url));
        if(this.openTab[len-1] !== null) {
            return true;
        }
    }

    closeTabButton() {
        let success;
        for (let i = 0; i < this.openTab.length; i++) {
            if(this.openTab[i] !== null && this.openTab[i] !== undefined) {
                if(!this.openTab[i].closed) {
                    this.openTab[i].close();
                    success = true;
                }
            }
        }
        this.openTab = [];
        return success;
    }

    watchedButton() {
        return this.setWatchedTo(true);
    }

    notWatchedButton() {
        return this.setWatchedTo(false);
    }

    addButton() {
        let success;
        if (this.data.seasons[this.sIndex].episodes.length - 1 > this.epIndex) {
            this.epIndex++;
            this.epCount++;
            success = true;
        } else if (this.data.seasons.length - 1 > this.sIndex) {
            this.sIndex++;
            this.epIndex = 0;
            this.epCount++;
            success = true;
        }
        this.refresh();
        return success;
    }

    subtrButton() {
        let success;
        if (this.epIndex > 0) {
            this.epIndex--;
            this.epCount--;
            success = true;
        } else if (this.sIndex > 0) {
            this.sIndex--;
            this.epIndex = this.data.seasons[this.sIndex].episodes.length - 1;
            this.epCount--;
            success = true;
        }
        this.refresh();
        return success;
    }

    arrowLeftButton(relSpeed: number, callback: Function) {
        if(!navMap.flag) {
            return;
        }
        slideListElementLeft(this, relSpeed, callback);
        return this.data;
    }

    arrowRightButton(relSpeed: number, callback: Function) {
        if(!navMap.flag) {
            return;
        }
        slideListElementRight(this, relSpeed, callback);
        return this.data;
    }

    generateNewElement() {
        this.data = this.serverData.getListElement(this.dataIndex);
        const listElement = document.createElement('div');
        listElement.id = this.getId();
        listElement.classList.add('list-element');
        listElement.classList.add('shadow-bottom');
        const imgLabelContainer = document.createElement('div');
        imgLabelContainer.classList.add('list-img-label');
        this.thumbnail = this.generateThumbnail();
        imgLabelContainer.appendChild(this.thumbnail);
        const buttonContainer = this.generateButtonContainer();
        const labelContainer = this.generateLabelContainer();
        imgLabelContainer.appendChild(labelContainer);
        listElement.appendChild(imgLabelContainer);
        listElement.appendChild(buttonContainer);
        this.htmlListElement = listElement;
    }

    private generateThumbnail() {
        const instance = this;
        const thumbnail = ListElement.generateButton(
            this.data.seasons[this.sIndex].thumbnail, 'thumbnail', function () {
                window.open(instance.data.seasons[instance.sIndex].url);
            });
        thumbnail.classList.add('thumbnail');
        return thumbnail;
    }

    private generateButtonContainer() {
        const container = document.createElement('div');
        container.classList.add('list-button-container');
        switch (this.data.list) {
            case ListID.WATCHED:
                container.appendChild(this.createArrowRightButton());
                break;
            case ListID.PLAYLIST:
                container.appendChild(this.createArrowLeftButton());
                container.appendChild(this.createArrowRightButton());
                break;
            case ListID.NOT_WATCHED:
                container.appendChild(this.createArrowLeftButton());
                break;
        }
        container.appendChild(this.createPlayButton());
        container.appendChild(this.createWatchedButton());
        container.appendChild(this.createEditButton());
        container.appendChild(this.createDeleteButton());
        return container;
    }

    private createArrowLeftButton() {
        const instance = this;
        return ListElement.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            instance.arrowLeftButton(Settings.animationSpeedSingle, function () {
                const element = instance.serverData.getListElement(instance.dataIndex);
                element.list--;
                instance.serverData.put([element], function () {
                    instance.renderAfterArrowLeft(element.list);
                });
            });
        });
    }

    renderAfterArrowLeft(newListId: ListID) {
        this.serverData.splitInThreeLists();
        navMap[newListId].generateMap();
        navMap[newListId].renderList();
        navMap[newListId + 1].generateMap();
        navMap[newListId + 1].renderList();
    }

    private createArrowRightButton() {
        const instance = this;
        return ListElement.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            instance.arrowRightButton(Settings.animationSpeedSingle, function () {
                const element = instance.serverData.getListElement(instance.dataIndex);
                element.list++;
                instance.serverData.put([element], function () {
                    instance.renderAfterArrowRight(element.list);
                });
            });
        });
    }

    renderAfterArrowRight(newListId: ListID) {
        this.serverData.splitInThreeLists();
        navMap[newListId].generateMap();
        navMap[newListId].renderList();
        navMap[newListId - 1].generateMap();
        navMap[newListId - 1].renderList();
    }

    private createPlayButton() {
        const instance = this;
        return ListElement.generateButton('img/play.ico', 'play', function () {
            instance.playButton();
        });
    }

    private createWatchedButton() {
        this.watchedStatus = document.createElement('img');
        this.setAttributesWatched(this.data.seasons[this.sIndex].episodes[this.epIndex].watched);
        const instance = this;
        this.watchedStatus.addEventListener('click', function () {
            const oldBool = instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched;
            instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched = !oldBool;
            instance.setAttributesWatched(!oldBool);
            instance.serverData.put([instance.data]);
        });
        return this.watchedStatus;
    }

    private setWatchedTo(bool: boolean) {
        if(this.data.seasons[this.sIndex].episodes[this.epIndex].watched === bool) {
            return;
        }
        this.data.seasons[this.sIndex].episodes[this.epIndex].watched = bool;
        this.setAttributesWatched(bool);
        return this.data;
    }

    private setAttributesWatched(bool: boolean) {
        if (bool) {
            this.watchedStatus.src = 'img/watched.ico';
            this.watchedStatus.alt = 'watched';
        } else {
            this.watchedStatus.src = 'img/not-watched.ico';
            this.watchedStatus.alt = 'not-watched';
        }
    };

    private createEditButton() {
        const instance = this;
        return ListElement.generateButton('img/edit.ico', 'edit', function () {
            instance.editPage.renderPage(instance.data);
            slideToEdit();
            setTimeout(function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 120);
        });
    }

    private createDeleteButton() {
        const instance = this;
        return ListElement.generateButton('img/delete.ico', 'delete', function () {
            //TODO: delete
        });
    }

    static generateButton(src: string, alt: string, onClick: Function) {
        const button = document.createElement('img');
        button.src = src;
        button.alt = alt;
        button.addEventListener('click', function (ev) {
            onClick(ev);
        });
        return button;
    }

    private generateLabelContainer() {
        const container = document.createElement('div');
        container.classList.add('list-label');
        const labelContainer = document.createElement('div');
        labelContainer.classList.add('title-episode-container');
        labelContainer.appendChild(this.generateTitle());
        this.episode = this.generateEpisodeName();
        labelContainer.appendChild(this.episode);
        container.appendChild(labelContainer);
        container.appendChild(this.generateAddSubContainer());
        return container;
    }

    private generateTitle() {
        const title = document.createElement('h3');
        title.innerHTML = this.getName(Settings.titleLanguage);
        const instance = this;
        title.addEventListener('click', function () {
            instance.detailPage.renderPage(instance.data);
            slideToDetails();
            setTimeout(function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 120);
        });
        return title;
    }

    private generatePrefix() {
        return 's'+(this.sIndex+1)+'ep'+(this.epIndex+1)+': ';
    }

    private generateEpisodeName() {
        const episode = document.createElement('p');
        episode.classList.add('episode-name');
        episode.classList.add('list-label-p');
        const prefix = this.generatePrefix();
        episode.innerHTML = prefix+this.data.seasons[this.sIndex].episodes[this.epIndex].name;
        return episode;
    }

    private generateAddSubContainer() {
        const addSub = document.createElement('div');
        addSub.classList.add('add-sub-count-container');

        const count = document.createElement('p');
        count.classList.add('list-label-p');
        this.countEp = document.createElement('span');
        this.countEp.innerHTML = this.epCount.toString();
        const node = document.createTextNode('/');
        const countMax = document.createElement('span');
        countMax.innerHTML = this.maxCount.toString();
        count.appendChild(this.countEp);
        count.appendChild(node);
        count.appendChild(countMax);
        addSub.appendChild(count);
        const instance = this;
        addSub.appendChild(ListElement.generateButton('img/add-button.ico', 'add', function () {
            instance.addButton();
        }));
        addSub.appendChild(ListElement.generateButton('img/subtr-button.ico', 'subtr', function () {
            instance.subtrButton();
        }));
        return addSub;
    }

    refresh() {
        const prefix = this.generatePrefix();
        this.episode.innerHTML = prefix+this.data.seasons[this.sIndex].episodes[this.epIndex].name;
        this.countEp.innerHTML = this.epCount.toString();
        this.thumbnail.src = this.data.seasons[this.sIndex].thumbnail;
        this.setAttributesWatched(this.data.seasons[this.sIndex].episodes[this.epIndex].watched);
    }

    static getIndicesAndCountOfFirstNotWatched(data: DataListElement) {
        let sIndex, epIndex, epCount = 0, maxCount = 0, success = false;
        let flag = true;
        let s, ep;
        for (s = 0; s < data.seasons.length; s++) {
            for (ep = 0; ep < data.seasons[s].episodes.length; ep++) {
                if (flag) {
                    epCount++;
                }
                if (!data.seasons[s].episodes[ep].watched && flag) {
                    sIndex = s;
                    epIndex = ep;
                    flag = false;
                    success = true;
                }
                maxCount++;
            }
        }
        if (!success) {
            sIndex = s - 1;
            epIndex = ep - 1;
        }
        return [sIndex, epIndex, epCount, maxCount, success];
    }
}