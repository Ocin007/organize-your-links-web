import html from "./oyl-popup-frame.html";
import scss from "./oyl-popup-frame.scss";
import { ComponentConnected, ComponentDisconnected, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylPopupFrame extends Component {

    static get tagName(): string {
        return 'oyl-popup-frame';
    }

    static get observedAttributes() {
        return [];
    }

    //TODO: bekommt im event html element zum anzeigen + callbacks

    @ComponentConnected()
    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }
}

export default OylPopupFrame;