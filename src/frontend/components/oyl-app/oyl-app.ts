import AbstractOylApp from "./AbstractOylApp";

class OylApp extends AbstractOylApp {

    static readonly tagName = 'oyl-app';

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

export default OylApp;