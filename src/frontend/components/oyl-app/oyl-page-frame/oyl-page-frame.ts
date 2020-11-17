import AbstractOylPageFrame from './AbstractOylPageFrame';

class OylPageFrame extends AbstractOylPageFrame {

    static readonly tagName = 'oyl-page-frame';

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

export default OylPageFrame;