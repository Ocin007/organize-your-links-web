import html from "./oyl-page-frame.html";
import scss from "./oyl-page-frame.scss";
import { ComponentConnected, ComponentDisconnected, OylComponent } from "../../../decorators/decorators";
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
        return ['page-id'];
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

export default OylPageFrame;