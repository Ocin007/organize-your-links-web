class PageDelete {

    constructor(
        private opacityLayer: HTMLElement,
        private deleteContainer: HTMLElement,
        private serverData: ServerData
    ) {
        const instance = this;
        this.opacityLayer.addEventListener('click', function () {
            instance.hideElement();
        });
    }

    showElement() {
        this.opacityLayer.style.visibility = 'visible';
        this.deleteContainer.style.display = 'flex';
        blockKeyboardNav = true;
    }

    hideElement() {
        this.opacityLayer.style.visibility = 'hidden';
        this.deleteContainer.style.display = 'none';
        this.deleteContainer.innerHTML = '';
        blockKeyboardNav = false;
    }

    renderPage(data: DataListElement) {
        this.deleteContainer.innerHTML = '';
        const instance = this;
        let idLabel = '';
        if(data.tvdbId !== -1) {
            idLabel = '#'+data.tvdbId;
        }
        const deleteQuestion = PageEdit.generateText('h3', 'Serie wirklich löschen?');
        deleteQuestion.classList.add('font-green');
        this.deleteContainer.appendChild(PageCreate.createDiv(['delete-title-container'], [
            PageEdit.generateText('h1', data[PageDetail.calcTitleLang(data)]),
            PageEdit.generateText('p', idLabel)
        ]));
        this.deleteContainer.appendChild(PageCreate.createDiv(['delete-buttons-question'], [
            deleteQuestion,
            PageCreate.createDiv(['delete-button-container'], [
                PageEdit.createButton('button-green', 'Löschen', function () {
                    instance.delete(data);
                }),
                PageEdit.createButton('button-red', 'Abbrechen', function () {
                    instance.hideElement();
                })
            ])
        ]));
    }

    private delete(data: DataListElement) {
        const instance = this;
        this.serverData.delete(data.id, function () {
            instance.hideElement();
            reloadAllData();
        });
    }
}