import AbstractOylNavigation from "./AbstractOylNavigation";

class OylNavigation extends AbstractOylNavigation {

    static readonly tagName = 'oyl-navigation';

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

export default OylNavigation;