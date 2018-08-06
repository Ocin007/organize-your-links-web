class ListElement {
    private sIndex: number;
    private epIndex: number;
    private epCount: number;
    private maxCount: number;
    private success: boolean;
    private htmlListElement: HTMLDivElement;
    private data: DataListElement;

    constructor(
        private dataIndex: number,
        private serverData: ServerData,
        private detailPage: PageDetail,
        private pageList: PageList
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

    getId() {
        return this.serverData.getListElement(this.dataIndex).id;
    }

    getName() {
        return this.serverData.getListElement(this.dataIndex).name;
    }

    getElement() {
        return this.htmlListElement;
    }

    showPageList() {
        this.pageList.showElement();
    }

    generateNewElement() {
        this.data = this.serverData.getListElement(this.dataIndex);
        const listElement = document.createElement('div');
        listElement.id = this.getId();
        listElement.classList.add('list-element');
        listElement.classList.add('shadow-bottom');
        const imgLabelContainer = document.createElement('div');
        imgLabelContainer.classList.add('list-img-label');
        const thumbnail = this.generateThumbnail();
        imgLabelContainer.appendChild(thumbnail);
        const [buttonContainer, watchedButton] = this.generateButtonContainer();
        const labelContainer = this.generateLabelContainer(thumbnail, watchedButton);
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

    private generateButtonContainer(): [HTMLDivElement, HTMLImageElement] {
        const container = document.createElement('div');
        container.classList.add('list-button-container');
        switch (this.data.list) {
            case ListID.WATCHED:
                container.appendChild(this.arrowRightButton());
                break;
            case ListID.PLAYLIST:
                container.appendChild(this.arrowLeftButton());
                container.appendChild(this.arrowRightButton());
                break;
            case ListID.NOT_WATCHED:
                container.appendChild(this.arrowLeftButton());
                break;
        }
        container.appendChild(this.playButton());
        const watchedButton = this.watchedButton();
        container.appendChild(watchedButton);
        container.appendChild(this.editButton());
        container.appendChild(this.deleteButton());
        return [container, watchedButton];
    }

    private arrowLeftButton() {
        const instance = this;
        return ListElement.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            //TODO: arrow left
        });
    }

    private arrowRightButton() {
        const instance = this;
        return ListElement.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            //TODO: arrow right
        });
    }

    private playButton() {
        const instance = this;
        return ListElement.generateButton('img/play.ico', 'play', function () {
            window.open(instance.data.seasons[instance.sIndex].episodes[instance.epIndex].url);
        });
    }

    private watchedButton() {
        const watchedStatus = document.createElement('img');
        const setAttributes = function (bool: boolean) {
            if (bool) {
                watchedStatus.src = 'img/watched.ico';
                watchedStatus.alt = 'watched';
            } else {
                watchedStatus.src = 'img/not-watched.ico';
                watchedStatus.alt = 'not-watched';
            }
        };
        setAttributes(this.data.seasons[this.sIndex].episodes[this.epIndex].watched);
        const instance = this;
        watchedStatus.addEventListener('click', function () {
            const oldBool = instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched;
            instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched = !oldBool;
            setAttributes(!oldBool);
            instance.serverData.put([instance.data]);
        });
        return watchedStatus;
    }

    private editButton() {
        const instance = this;
        return ListElement.generateButton('img/edit.ico', 'edit', function () {
            //TODO: edit
        });
    }

    private deleteButton() {
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

    private generateLabelContainer(thumbnail: HTMLImageElement, watchedButton: HTMLImageElement) {
        const container = document.createElement('div');
        const labelContainer = document.createElement('div');
        container.classList.add('list-label');
        labelContainer.appendChild(this.generateTitle());
        const episode = this.generateEpisodeName();
        labelContainer.appendChild(episode);
        container.appendChild(labelContainer);
        container.appendChild(this.generateAddSubContainer(episode, thumbnail, watchedButton));
        return container;
    }

    private generateTitle() {
        const title = document.createElement('h3');
        title.innerHTML = this.getName();
        const instance = this;
        title.addEventListener('click', function () {
            instance.detailPage.renderPage(instance.data);
            instance.pageList.hideElement();
            instance.detailPage.showElement();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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

    private generateAddSubContainer(episode: HTMLElement, thumbnail: HTMLImageElement, watchedButton: HTMLImageElement) {
        const addSub = document.createElement('div');
        addSub.classList.add('add-sub-count-container');

        const count = document.createElement('p');
        count.classList.add('list-label-p');
        const countEp = document.createElement('span');
        countEp.innerHTML = this.epCount.toString();
        const node = document.createTextNode('/');
        const countMax = document.createElement('span');
        countMax.innerHTML = this.maxCount.toString();
        count.appendChild(countEp);
        count.appendChild(node);
        count.appendChild(countMax);
        addSub.appendChild(count);

        const instance = this;
        const refresh = function () {
            const prefix = instance.generatePrefix();
            episode.innerHTML = prefix+instance.data.seasons[instance.sIndex].episodes[instance.epIndex].name;
            countEp.innerHTML = instance.epCount.toString();
            thumbnail.src = instance.data.seasons[instance.sIndex].thumbnail;
            if (instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched) {
                watchedButton.src = 'img/watched.ico';
                watchedButton.alt = 'watched';
            } else {
                watchedButton.src = 'img/not-watched.ico';
                watchedButton.alt = 'not-watched';
            }
        };
        addSub.appendChild(ListElement.generateButton('img/add-button.ico', 'add', function () {
            if (instance.data.seasons[instance.sIndex].episodes.length - 1 > instance.epIndex) {
                instance.epIndex++;
                instance.epCount++;
            } else if (instance.data.seasons.length - 1 > instance.sIndex) {
                instance.sIndex++;
                instance.epIndex = 0;
                instance.epCount++;
            }
            refresh();
        }));
        addSub.appendChild(ListElement.generateButton('img/subtr-button.ico', 'subtr', function () {
            if (instance.epIndex > 0) {
                instance.epIndex--;
                instance.epCount--;
            } else if (instance.sIndex > 0) {
                instance.sIndex--;
                instance.epIndex = instance.data.seasons[instance.sIndex].episodes.length - 1;
                instance.epCount--;
            }
            refresh();
        }));
        return addSub;
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