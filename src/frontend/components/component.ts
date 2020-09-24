class Component extends HTMLElement {

    static get observedAttributes() {
        return [];
    }

    get customComponents(): Component[] {
        return [];
    }

    constructor(html: string = '', scss: string = '') {
        super();
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.appendChild(document.createTextNode(scss));
        let template = document.createElement('template');
        template.innerHTML = html;
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    disconnectedCallback(): void {
    }
}

export default Component;