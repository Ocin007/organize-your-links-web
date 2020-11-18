import AbstractOylApp from "./AbstractOylApp";

class OylApp extends AbstractOylApp {

    static get tagName(): string {
        return 'oyl-app';
    }

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