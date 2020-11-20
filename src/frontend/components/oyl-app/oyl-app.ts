import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import {ComponentReady, OylComponent} from "../../decorators/decorators";
import Component from "../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylApp extends Component {

    static get tagName(): string {
        return 'oyl-app';
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

export default OylApp;