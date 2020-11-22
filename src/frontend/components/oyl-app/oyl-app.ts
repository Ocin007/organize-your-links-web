import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import {ComponentReady, ExecOnReady, OylComponent} from "../../decorators/decorators";
import Component from "../component";
import {Events} from "../../@types/enums";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";
import NavEvent from "../../events/NavEvent";

@OylComponent({
    html: html,
    scss: scss
})
class OylApp extends Component {

    protected navBar: OylNavBar;
    protected pageFrame: OylPageFrame;
    protected slidePage: OylSlidePage;
    protected popupFrame: OylPopupFrame;
    protected notification: OylNotification;

    static get tagName(): string {
        return 'oyl-app';
    }

    static get observedAttributes() {
        return [];
    }

    @ComponentReady()
    connectedCallback(): void {
        this.initNavigation();
        this.addPopupEventCallbacks();
        this.addNotifyEventCallbacks();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }

    private initNavigation(): void {
        this.addEventListener(Events.Nav, (ev: NavEvent) => {
            this.navBar.setAttribute('page-id', ev.pageId);
            this.pageFrame.setAttribute('page-id', ev.pageId);
            this.slidePage.setAttribute('page-id', ev.pageId);
        });
        let startPage = this.services.settings.startPage;
        this.setPageId(this.navBar, startPage);
        this.setPageId(this.pageFrame, startPage);
        this.setPageId(this.slidePage, startPage);
    }

    @ExecOnReady(true)
    private setPageId(component: Component, pageId: PageID) {
        component.setAttribute('page-id', pageId);
    }

    private addPopupEventCallbacks(): void {
        this.addEventCallback(this.popupFrame, Events.Popup);
    }

    private addNotifyEventCallbacks(): void {
        this.addEventCallback(this.notification, Events.Notify);
    }

    @ExecOnReady()
    private addEventCallback(component: Component, eventType: Events): void {
        this.addEventListener(eventType, ev => component.eventCallback(ev));
    }
}

export default OylApp;