import html from "./oyl-slide-page.html";
import scss from "./oyl-slide-page.scss";
import { ComponentConnected, ComponentDisconnected, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylSlidePage extends Component {

    static get tagName(): string {
        return 'oyl-slide-page';
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

    eventCallback(ev: Event): void {
    }
}

export default OylSlidePage;