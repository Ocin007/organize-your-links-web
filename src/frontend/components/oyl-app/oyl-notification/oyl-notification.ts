import AbstractOylNotification from "./AbstractOylNotification";

class OylNotification extends AbstractOylNotification {

    static readonly tagName = 'oyl-notification';

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

export default OylNotification;