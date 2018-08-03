class PageList {
    private dataList: Object;

    constructor(private readonly listID: ListID, private pageElement: HTMLElement, private serverData: ServerData) {

    }

    showElement() {
        this.pageElement.style.display = 'block';
    }

    hideElement() {
        this.pageElement.style.display = 'none';
    }

    generateMap() {
        this.dataList = {};
        const dataList = this.serverData.getList(this.listID);
        for (let i = 0; i < dataList.length; i++) {
            let firstChar = dataList[i].name.charAt(0).toUpperCase();
            if(this.dataList[firstChar] === undefined) {
                this.dataList[firstChar] = [ new ListElement(dataList[i], this.listID) ];
            } else {
                this.dataList[firstChar].push(new ListElement(dataList[i], this.listID));
            }
        }
    }

    renderList() {
        this.pageElement.innerHTML = '';
        for(let key in this.dataList) {
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