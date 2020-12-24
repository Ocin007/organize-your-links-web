import PageProvider from "./pages/PageProvider";
import { ComponentConnected, ComponentDisconnected } from "../decorators/decorators";

abstract class Component extends HTMLElement {

    static tagName: string;

    private html: string;
    private scss: string;

    //TODO: remove this
    protected get pages(): PageProvider {
        return PageProvider.instance;
    }

    constructor() {
        super();
        let style = this.createStyleElement();
        let template = this.createTemplateElement();
        this.initShadowRoot(style, template);
        this.bindElementsToProperties();
    }

    private createStyleElement(): HTMLStyleElement {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.appendChild(document.createTextNode(this.scss));
        return style;
    }

    private createTemplateElement(): HTMLTemplateElement {
        let template = document.createElement('template');
        template.innerHTML = this.html;
        return template;
    }

    private initShadowRoot(style: HTMLStyleElement, template: HTMLTemplateElement): void {
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    private bindElementsToProperties(): void {
        this.shadowRoot
            .querySelectorAll<HTMLElement>('[data-property]')
            .forEach(element => this[element.dataset.property] = element);
    }

    static get observedAttributes() {
        return [];
    }

    @ComponentConnected()
    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    //TODO: remove these
    eventCallback(ev: Event): void {
    }
}

export default Component;