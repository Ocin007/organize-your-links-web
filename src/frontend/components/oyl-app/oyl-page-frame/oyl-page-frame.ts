import html from "./oyl-page-frame.html";
import scss from "./oyl-page-frame.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylPageFrame extends Component {

    protected pageContainer: HTMLDivElement;

    private currentPage: PageInterface;

    static get tagName(): string {
        return 'oyl-page-frame';
    }

    static get observedAttributes() {
        return ['page-id'];
    }

    constructor(
        @Inject('PageServiceInterface') private pages: PageServiceInterface,
        @Inject('NavigationServiceInterface') private navigator: NavigationServiceInterface
    ) {
        super();
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.navigator.subscribe((options: PageOptions) => {
            if (this.currentPage !== undefined && options.pageId === this.currentPage.pageId) {
                if (options.active) {
                    this.currentPage.update(options);
                } else {
                    this.pageContainer.removeChild(this.pageContainer.firstElementChild);
                }
            } else {
                this.currentPage = this.pages.get(options.pageId);
                this.pageContainer.appendChild(this.currentPage.component);
                this.currentPage.update(options);
            }
        });
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }
}

export default OylPageFrame;