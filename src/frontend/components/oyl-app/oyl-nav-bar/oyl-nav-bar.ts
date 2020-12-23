import html from "./oyl-nav-bar.html";
import scss from "./oyl-nav-bar.scss";
import { ComponentReady, Inject, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";
import OylNavBarTab from "./oyl-nav-bar-tab/oyl-nav-bar-tab";
import Page from "../../pages/page";
import { NotificationServiceInterface } from "../../../@types/types";

@OylComponent({
    html: html,
    scss: scss
})
class OylNavBar extends Component {

    static PAGE_DOES_NOT_EXIST = 'Seite existiert nicht.';

    protected tabContainer: HTMLDivElement;

    static get tagName(): string {
        return 'oyl-nav-bar';
    }

    static get observedAttributes() {
        return ['page-id'];
    }

    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface
    ) {
        super();
    }

    @ComponentReady()
    connectedCallback(): void {
        this.pages.all.forEach((page: Page) => {
            let tab = document.createElement(OylNavBarTab.tagName);
            if (tab instanceof OylNavBarTab) {
                this.tabContainer.appendChild(tab);
                tab.setAttribute('page-id', page.pageId);
            }
        });
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        if (oldVal !== null) {
            this.setTabActive(oldVal, false);
        }
        this.setTabActive(newVal, true);
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }

    private setTabActive(pageId: PageID, active: boolean): void {
        let tab = this.tabContainer.querySelector<OylNavBarTab>('[page-id="' + pageId + '"]');
        if (tab === null) {
            this.notifier.error(OylNavBar.PAGE_DOES_NOT_EXIST, {pageId: pageId});
        } else {
            tab.setAttribute('active', '' + active);
        }
    }
}

export default OylNavBar;