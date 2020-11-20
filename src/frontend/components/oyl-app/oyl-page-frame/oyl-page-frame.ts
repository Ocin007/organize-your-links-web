import html from "./oyl-page-frame.html";
import scss from "./oyl-page-frame.scss";
import {ComponentReady, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylPageFrame extends Component {

    static get tagName(): string {
        return 'oyl-page-frame';
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

export default OylPageFrame;