class Component extends HTMLElement {

    protected constructor(html: string = '', css: string = '') {
        super();
        let style = Component.createStyleElement(css)
        let template = Component.createTemplateElement(html);
        this.initShadowRoot(style, template);
        this.bindElementsToProperties();
    }

    private static createStyleElement(css: string): HTMLStyleElement {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.appendChild(document.createTextNode(css));
        return style;
    }

    private static createTemplateElement(html: string): HTMLTemplateElement {
        let template = document.createElement('template');
        template.innerHTML = html;
        return template;
    }

    private initShadowRoot(style: HTMLStyleElement, template: HTMLTemplateElement) {
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    private bindElementsToProperties() {
        this.shadowRoot
            .querySelectorAll<HTMLElement>('[data-property]')
            .forEach(element => this[element.dataset.property] = element);
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

export default Component;