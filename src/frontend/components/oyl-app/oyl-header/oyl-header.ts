import AbstractOylHeader from "./AbstractOylHeader";

class OylHeader extends AbstractOylHeader {

    static get tagName(): string {
        return 'oyl-header';
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

export default OylHeader;