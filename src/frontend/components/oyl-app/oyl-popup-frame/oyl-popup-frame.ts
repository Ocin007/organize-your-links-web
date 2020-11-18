import AbstractOylPopupFrame from "./AbstractOylPopupFrame";

class OylPopupFrame extends AbstractOylPopupFrame {

    static get tagName(): string {
        return 'oyl-popup-frame';
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

export default OylPopupFrame;