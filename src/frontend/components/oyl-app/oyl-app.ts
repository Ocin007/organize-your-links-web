import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import {ComponentReady, ExecOnReady, OylComponent} from "../../decorators/decorators";
import Component from "../component";
import {Events, Status} from "../../@types/enums";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";
import NavEvent from "../../events/NavEvent";
import OylLabel from "../common/oyl-label/oyl-label";
import NotifyEvent from "../../events/NotifyEvent";
import ComponentReadyEvent from "../../events/ComponentReadyEvent";

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

    constructor() {
        super();
        this.initGlobalDefaultErrorHandling();
        this.catchAllNotificationsUntilReady();
        this.debugLoadedComponentsCount();
    }

    @ComponentReady()
    connectedCallback(): void {
        this.initNavigation();
        this.addEventCallback(this.popupFrame, Events.Popup);
        this.addEventCallback(this.notification, Events.Notify);
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
    private setPageId(component: Component, pageId: PageID): void {
        component.setAttribute('page-id', pageId);
    }

    @ExecOnReady(true)
    private addEventCallback(component: Component, eventType: Events): void {
        this.addEventListener(eventType, ev => component.eventCallback(ev));
    }

    private debugLoadedComponentsCount(): void {
        let label = new OylLabel('Loaded components: {{val1}}', '0');
        let componentCount = 0;
        this.addEventListener(Events.Ready, () => {
            componentCount++;
            label.setAttribute('val1', componentCount.toString());
        });
        this.dispatchEvent(new NotifyEvent(Status.DEBUG, label, {detail: {html: label}}));
    }

    private catchAllNotificationsUntilReady() {
        let notifyBuffer: NotifyEvent[] = [];
        let pushInBuffer = (ev: NotifyEvent) => {
            notifyBuffer.push(ev);
        };
        let onReady = (ev: ComponentReadyEvent) => {
            if (ev.composedPath()[0] !== this.notification) {
                return;
            }
            this.removeEventListener(Events.Notify, pushInBuffer);
            this.notification.removeEventListener(Events.Ready, onReady);
            notifyBuffer.forEach((notify) => {
                this.notification.eventCallback(notify);
            });
        };
        this.addEventListener(Events.Notify, pushInBuffer);
        this.notification.addEventListener(Events.Ready, onReady);
    }

    private initGlobalDefaultErrorHandling() {
        window.addEventListener("error", ev => {
            this.dispatchEvent(new NotifyEvent(Status.ERROR, ev.message, {detail: {raw: ev}}));
        });
    }
}

export default OylApp;