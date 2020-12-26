import html from "./oyl-notify-details.html";
import scss from "./oyl-notify-details.scss";
import {ComponentConnected, ComponentDisconnected, OylComponent} from "../../../../../decorators/decorators";
import Component from "../../../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylNotifyDetails extends Component {

    static get tagName(): string {
        return 'oyl-notify-details';
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
}

export default OylNotifyDetails;