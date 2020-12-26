import html from "./oyl-opacity-layer.html";
import scss from "./oyl-opacity-layer.scss";
import {ComponentConnected, ComponentDisconnected, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylOpacityLayer extends Component {

    protected opacityLayer: HTMLDivElement;

    static get tagName(): string {
        return 'oyl-opacity-layer';
    }

    static get observedAttributes() {
        return ['visible'];
    }

    @ComponentConnected()
    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        if (newVal === 'true') {
            this.opacityLayer.classList.add('visible');
        } else {
            this.opacityLayer.classList.remove('visible');
        }
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }
}

export default OylOpacityLayer;