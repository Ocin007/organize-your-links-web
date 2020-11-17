import AbstractOylSlidePage from "./AbstractOylSlidePage";

class OylSlidePage extends AbstractOylSlidePage {

    static readonly tagName = 'oyl-slide-page';

    static get observedAttributes() {
        return [];
    }

    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    disconnectedCallback(): void {
    }
}

export default OylSlidePage;