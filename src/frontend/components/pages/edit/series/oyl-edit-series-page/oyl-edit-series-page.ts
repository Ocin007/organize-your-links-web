import html from "./oyl-edit-series-page.html";
import scss from "./oyl-edit-series-page.scss";
import {ComponentConnected, ComponentDisconnected, OylComponent} from "../../../../../decorators/decorators";
import Component from "../../../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylEditSeriesPage extends Component {

    static get tagName(): string {
        return 'oyl-edit-series-page';
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

export default OylEditSeriesPage;