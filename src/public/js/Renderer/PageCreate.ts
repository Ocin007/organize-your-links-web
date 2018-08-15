class PageCreate implements Slideable, ForeachElement {

    constructor(
        private pageElement: HTMLElement,
        private tabElement: HTMLElement,
        private serverData: ServerData) {}

    activateTab() {
        if (!this.tabElement.classList.contains('tab-active')) {
            this.tabElement.classList.add('tab-active');
        }
    }

    deactivateTab() {
        this.tabElement.classList.remove('tab-active');
    }

    getPageElement() {
        return this.pageElement;
    }

    hidePage() {
        this.pageElement.style.display = 'none';
    }

    showPage() {
        this.pageElement.style.display = 'block';
    }

    foreachListElement(callback: Function, opt?: any) {

    }

    getDataIndexList() {

    }

    getElementWithDataIndex(dataIndex: number) {

    }

    getListId() {

    }

    hideElement() {
        this.hidePage();
        this.deactivateTab();
    }

    showElement() {
        this.showPage();
        this.activateTab();
    }

    renderPage() {

    }
}