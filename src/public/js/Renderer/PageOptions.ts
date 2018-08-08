class PageOptions {

    private activePage: any;

    constructor(private opacityLayer: HTMLElement, private optionContainer: HTMLElement) {
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

    renderPage() {
        this.optionContainer.innerHTML = '';
        this.activePage = navMap[navMap.active];
        if(navMap.active === 1 || navMap.active === 2 || navMap.active === 3) {
            this.renderForPageList();
        } else {
            this.renderNoContent();
        }
    }

    private renderForPageList() {
        //TODO: render options
    }

    private renderNoContent() {
        const p = document.createElement('p');
        p.classList.add('opt-label');
        p.innerHTML = 'Für diese Seite sind keine Optionen verfügbar.';
        this.optionContainer.appendChild(p);
    }
}