import html from "./oyl-nav-bar.html";
import scss from "./oyl-nav-bar.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";
import OylNavBarTab from "./oyl-nav-bar-tab/oyl-nav-bar-tab";

@OylComponent({
    html: html,
    scss: scss
})
class OylNavBar extends Component {

    protected tabContainer: HTMLDivElement;

    static get tagName(): string {
        return 'oyl-nav-bar';
    }

    static get observedAttributes() {
        return [];
    }

    constructor(
        @Inject('PageServiceInterface') private pages: PageServiceInterface,
        @Inject('NavigationServiceInterface') private navigator: NavigationServiceInterface
    ) {
        super();
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.pages.getAll().forEach((page: PageInterface) => {
            let tab = new OylNavBarTab();
            this.tabContainer.appendChild(tab);
            tab.setAttribute('label', page.label);
            this.navigator.subscribe((options: PageOptions) => {
                tab.setAttribute('active', options.active.toString());
            }, [page.pageId]);
            tab.addEventListener('click', _ => {
                this.navigator.navigateTo(page.pageId);
            });
        });
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }
}

export default OylNavBar;