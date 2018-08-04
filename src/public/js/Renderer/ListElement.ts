class ListElement {
    private sIndex: number;
    private epIndex: number;
    private epCount: number;
    private maxCount: number;
    private success: boolean;
    private htmlListElement: HTMLDivElement;

    constructor(private data: DataListElement, private listId: ListID) {
        [
            this.sIndex,
            this.epIndex,
            this.epCount,
            this.maxCount,
            this.success
        ] = this.getIndicesAndCountOfFirstNotWatched();
    }

    getId() {
        return this.data.id;
    }

    getName() {
        return this.data.name;
    }

    getElement() {
        return this.htmlListElement;
    }

    generateNewElement() {
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
        const thumbnail = this.generateButton(
            this.data.seasons[this.sIndex].thumbnail, 'thumbnail', function () {
            window.open(instance.data.seasons[instance.sIndex].url);
        });
        thumbnail.classList.add('thumbnail');
        return thumbnail;
        /*
        debugger;
        const thumbnail = document.createElement('img');
        thumbnail.classList.add('thumbnail');
        if(this.success) {
            thumbnail.src = this.data.seasons[this.sIndex].thumbnail;
        } else {
            thumbnail.src = this.data.seasons[this.sIndex-1].thumbnail;
        }
        thumbnail.alt = 'thumbnail';
        return thumbnail;
        */
    }

    private generateButtonContainer(): [HTMLDivElement, HTMLImageElement] {
        const container = document.createElement('div');
        container.classList.add('list-button-container');
        switch (this.listId) {
            case ListID.WATCHED: container.appendChild(this.arrowRightButton());
                                 break;
            case ListID.PLAYLIST: container.appendChild(this.arrowLeftButton());
                                  container.appendChild(this.arrowRightButton());
                                  break;
            case ListID.NOT_WATCHED: container.appendChild(this.arrowLeftButton());
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
        return this.generateButton('img/arrow-left.ico', 'arrow-left', function () {
            //TODO
        });
    }

    private arrowRightButton() {
        const instance = this;
        return this.generateButton('img/arrow-right.ico', 'arrow-right', function () {
            //TODO
        });
    }

    private playButton() {
        const instance = this;
        return this.generateButton('img/play.ico', 'play', function () {
            window.open(instance.data.seasons[instance.sIndex].episodes[instance.epIndex].url);
        });
    }

    private watchedButton() {
        const watchedStatus = document.createElement('img');
        if(this.data.seasons[this.sIndex].episodes[this.epIndex].watched) {
            watchedStatus.src = 'img/watched.ico';
            watchedStatus.alt = 'watched';
        } else {
            watchedStatus.src = 'img/not-watched.ico';
            watchedStatus.alt = 'not-watched';
        }
        const instance = this;
        watchedStatus.addEventListener('click', function () {
            //TODO
        });
        return watchedStatus;
    }

    private editButton() {
        const instance = this;
        return this.generateButton('img/edit.ico', 'edit', function () {
            //TODO
        });
    }

    private deleteButton() {
        const instance = this;
        return this.generateButton('img/delete.ico', 'delete', function () {
            //TODO
        });
    }

    private generateButton(src: string, alt: string, onClick: Function) {
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
        container.classList.add('list-label');
        container.appendChild(this.generateTitle());
        const episode = this.generateEpisodeName();
        container.appendChild(episode);
        container.appendChild(this.generateAddSubContainer(episode, thumbnail, watchedButton));
        return container;
    }

    private generateTitle() {
        const title = document.createElement('h3');
        title.innerHTML = this.getName();
        const instance = this;
        title.addEventListener('click', function () {
            //TODO
        });
        return title;
    }

    private generateEpisodeName() {
        const episode = document.createElement('p');
        episode.classList.add('episode-name');
        episode.classList.add('list-label-p');
        episode.innerHTML = this.data.seasons[this.sIndex].episodes[this.epIndex].name;
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
            episode.innerHTML = instance.data.seasons[instance.sIndex].episodes[instance.epIndex].name;
            countEp.innerHTML = instance.epCount.toString();
            thumbnail.src = instance.data.seasons[instance.sIndex].thumbnail;
            if(instance.data.seasons[instance.sIndex].episodes[instance.epIndex].watched) {
                watchedButton.src = 'img/watched.ico';
                watchedButton.alt = 'watched';
            } else {
                watchedButton.src = 'img/not-watched.ico';
                watchedButton.alt = 'not-watched';
            }
        };
        addSub.appendChild(this.generateButton('img/add-button.ico' ,'add' ,function () {
            if(instance.data.seasons[instance.sIndex].episodes.length-1 > instance.epIndex) {
                instance.epIndex++;
                instance.epCount++;
            } else if(instance.data.seasons.length-1 > instance.sIndex) {
                instance.sIndex++;
                instance.epIndex = 0;
                instance.epCount++;
            }
            refresh();
        }));
        addSub.appendChild(this.generateButton('img/subtr-button.ico', 'subtr', function () {
            if(instance.epIndex > 0) {
                instance.epIndex--;
                instance.epCount--;
            } else if(instance.sIndex > 0) {
                instance.sIndex--;
                instance.epIndex = instance.data.seasons[instance.sIndex].episodes.length-1;
                instance.epCount--;
            }
            refresh();
        }));
        return addSub;
    }

    private getIndicesAndCountOfFirstNotWatched() {
        let sIndex, epIndex, epCount = 0, maxCount = 0, success = false;
        let flag = true;
        let s, ep;
        for (s = 0; s < this.data.seasons.length; s++) {
            for (ep = 0; ep < this.data.seasons[s].episodes.length; ep++) {
                if(flag) {
                    epCount++;
                }
                if(!this.data.seasons[s].episodes[ep].watched && flag) {
                    sIndex = s;
                    epIndex = ep;
                    flag = false;
                    success = true;
                }
                maxCount++;
            }
        }
        if(!success) {
            sIndex = s - 1;
            epIndex = ep - 1;
        }
        return [sIndex, epIndex, epCount, maxCount, success];
    }
}