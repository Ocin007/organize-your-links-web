import html from "./oyl-notification.html";
import scss from "./oyl-notification.scss";
import {ComponentReady, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylNotification extends Component {

    static get tagName(): string {
        return 'oyl-notification';
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

export default OylNotification;