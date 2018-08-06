class PageList implements Slideable {
    private dataList: Object;

    constructor(
        private readonly listID: ListID,
        private pageElement: HTMLElement,
        private tabElement: HTMLElement,
        private serverData: ServerData,
        private detailPage: PageDetail
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
        this.pageElement.style.display = 'block';
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

    generateMap() {
        this.dataList = {};
        const indexList = this.serverData.getIndexList(this.listID);
        for (let i = 0; i < indexList.length; i++) {
            let element = this.serverData.getListElement(indexList[i]);
            let firstChar = element.name.charAt(0).toUpperCase();
            let listElement = new ListElement(indexList[i], this.serverData, this.detailPage, this);
            if (this.dataList[firstChar] === undefined) {
                this.dataList[firstChar] = [listElement];
            } else {
                this.dataList[firstChar].push(listElement);
            }
            this.detailPage.registerListElement(element.id, listElement);
        }
    }

    renderList() {
        this.pageElement.innerHTML = '';
        for (let key in this.dataList) {
            this.pageElement.appendChild(this.generateSegment(key));
        }
    }

    private generateSegment(key: string) {
        const segment = document.createElement('div');
        segment.classList.add('list-segment');
        const segmentLabel = document.createElement('h2');
        segmentLabel.classList.add('font-white');
        segmentLabel.innerHTML = key;
        segment.appendChild(segmentLabel);
        const listContainer = document.createElement('div');
        listContainer.classList.add('list-container');
        for (let i = 0; i < this.dataList[key].length; i++) {
            this.dataList[key][i].generateNewElement();
            listContainer.appendChild(this.dataList[key][i].getElement());
        }
        segment.appendChild(listContainer);
        return segment;
    }
}