import AbstractOylHeader from "./AbstractOylHeader";

class OylHeader extends AbstractOylHeader {

    static readonly tagName = 'oyl-header';

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