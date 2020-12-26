import html from "./oyl-opacity-layer.html";
import scss from "./oyl-opacity-layer.scss";
import {ComponentConnected, ComponentDisconnected, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylOpacityLayer extends Component {

    private static DELAY: number = 200;

    protected opacityLayer: HTMLDivElement;
    private timeoutId: NodeJS.Timeout;

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
            clearTimeout(this.timeoutId);
            this.opacityLayer.classList.add('visible');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.opacityLayer.classList.add('fade-in');
                });
            });
        } else {
            this.opacityLayer.classList.remove('fade-in');
            this.timeoutId = setTimeout(() => {
                this.opacityLayer.classList.remove('visible');
            }, OylOpacityLayer.DELAY);
        }
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }
}

export default OylOpacityLayer;