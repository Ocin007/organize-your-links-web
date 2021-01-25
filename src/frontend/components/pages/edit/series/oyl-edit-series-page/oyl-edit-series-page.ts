import html from "./oyl-edit-series-page.html";
import scss from "./oyl-edit-series-page.scss";
import {ComponentConnected, ComponentDisconnected, OylComponent} from "../../../../../decorators/decorators";
import Component from "../../../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylEditSeriesPage extends Component {

    private seriesId: SeriesID;

    static get tagName(): string {
        return 'oyl-edit-series-page';
    }

    static get observedAttributes() {
        return ['series-id'];
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        this.seriesId = newVal;
        this.render();
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
        this.resetPage();
    }

    private render(): void {
        //TODO: build actual page
    }

    private resetPage() {
        //TODO: reset page?
    }
}

export default OylEditSeriesPage;