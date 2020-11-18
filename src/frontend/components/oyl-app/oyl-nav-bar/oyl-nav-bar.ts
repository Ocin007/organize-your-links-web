import AbstractOylNavBar from "./AbstractOylNavBar";

class OylNavBar extends AbstractOylNavBar {

    static readonly tagName = 'oyl-nav-bar';

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

export default OylNavBar;