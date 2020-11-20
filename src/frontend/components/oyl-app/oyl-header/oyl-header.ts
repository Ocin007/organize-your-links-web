import html from "./oyl-header.html";
import scss from "./oyl-header.scss";
import {ComponentReady, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylHeader extends Component {

    static get tagName(): string {
        return 'oyl-header';
    }

    static get observedAttributes() {
        return [];
    }

    @ComponentReady()
    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }
}

export default OylHeader;