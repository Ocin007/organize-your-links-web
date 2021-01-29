import html from "./oyl-edit-series-page.html";
import scss from "./oyl-edit-series-page.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../../../../decorators/decorators";
import Component from "../../../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylEditSeriesPage extends Component {

    private seriesId: SeriesID;
    private series: Series;

    private isActive: boolean;

    static get tagName(): string {
        return 'oyl-edit-series-page';
    }

    static get observedAttributes() {
        return ['series-id'];
    }

    constructor(
        @Inject('SeriesServiceInterface') private seriesService?: SeriesServiceInterface
    ) {
        super();
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.isActive = true;
        this.render();//TODO: brauch ich rendern an dieser stelle
    }

    //TODO: check if attributeChangedCallback is called for 2 same values
    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        this.seriesId = newVal;
        if (this.seriesService.isInitialised) {
            this.series = this.seriesService.get(this.seriesId);
            this.render();
        } else {
            this.seriesService.whenInitSuccessful()
                .then(errors => {
                    if (errors.length === 0) {
                        this.series = this.seriesService.get(this.seriesId);
                        this.render();
                    } else {
                        this.renderError();
                    }
                }).catch(() => this.renderError());
        }
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
        this.isActive = false;
        this.resetPage();
    }

    private render(): void {
        //TODO: build actual page
        if (!this.isActive) {
            return;
        }
    }

    private renderError() {
        if (!this.isActive) {
            return;
        }
    }

    private resetPage() {
        //TODO: reset page?
    }
}

export default OylEditSeriesPage;