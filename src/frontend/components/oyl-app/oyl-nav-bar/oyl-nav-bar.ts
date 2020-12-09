import html from "./oyl-nav-bar.html";
import scss from "./oyl-nav-bar.scss";
import {ComponentReady, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";
import NotifyEvent from "../../../events/NotifyEvent";
import {Status} from "../../../@types/enums";
import OylNavBarTab from "./oyl-nav-bar-tab/oyl-nav-bar-tab";
import Page from "../../pages/page";

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
            this.sendError(pageId);
        } else {
            tab.setAttribute('active', '' + active);
        }
    }

    private sendError(pageId: PageID): void {
        this.dispatchEvent(new NotifyEvent(
            Status.ERROR,
            OylNavBar.PAGE_DOES_NOT_EXIST,
            {detail: {raw: {pageId: pageId}}}
        ));
    }
}

export default OylNavBar;