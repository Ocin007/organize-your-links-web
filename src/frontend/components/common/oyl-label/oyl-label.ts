import html from "./oyl-label.html";
import scss from "./oyl-label.scss";
import { ComponentConnected, ComponentDisconnected, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylLabel extends Component {

    protected span: HTMLSpanElement;

    static get tagName(): string {
        return 'oyl-label';
    }

    static get observedAttributes() {
        return ['label', 'val1', 'val2', 'val3', 'val4', 'val5'];
    }

    constructor(private label: string = '', private val1: string = '', private val2: string = '', private val3: string = '', private val4: string = '', private val5: string = '') {
        super();
        this.refreshContent();
    }

    @ComponentConnected()
    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        this[name] = newVal;
        this.refreshContent();
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }

    private refreshContent(): void {
        let newLabel = this.label;
        for (let i = 1; i < OylLabel.observedAttributes.length; i++) {
            let key = OylLabel.observedAttributes[i];
            newLabel = newLabel.replace('{{'+key+'}}', this[key]);
        }
        this.span.innerText = newLabel;
    }
}

export default OylLabel;