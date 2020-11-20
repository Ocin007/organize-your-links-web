import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import {ComponentReady, ExecOn, OylComponent} from "../../decorators/decorators";
import Component from "../component";
import {EventType} from "../../@types/enums";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";

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
        this.addNavEventCallbacks();
        this.addPopupEventCallbacks();
        this.addNotifyEventCallbacks();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }

    private addNavEventCallbacks(): void {
        this.addEventCallback(this.navBar, EventType.Nav);
        this.addEventCallback(this.pageFrame, EventType.Nav);
        this.addEventCallback(this.slidePage, EventType.Nav);
    }

    private addPopupEventCallbacks(): void {
        this.addEventCallback(this.popupFrame, EventType.Popup);
    }

    private addNotifyEventCallbacks(): void {
        this.addEventCallback(this.notification, EventType.Notify);
    }

    @ExecOn(EventType.ComponentReady)
    private addEventCallback(component: Component, eventType: EventType): void {
        this.addEventListener(eventType, ev => component.eventCallback(ev));
    }
}

export default OylApp;