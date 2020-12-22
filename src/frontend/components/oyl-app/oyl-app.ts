import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import { ComponentReady, ExecOnReady, Inject, InjectionTarget, OylComponent } from "../../decorators/decorators";
import Component from "../component";
import { Events, SettingKey } from "../../@types/enums";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";
import NavEvent from "../../events/NavEvent";
import OylLabel from "../common/oyl-label/oyl-label";
import { NotificationServiceInterface, SettingsServiceInterface } from "../../@types/types";

@InjectionTarget()
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

    constructor(
        @Inject('SettingsServiceInterface') private settings: SettingsServiceInterface,
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface
    ) {
        super();
        this.initGlobalDefaultErrorHandling();
        this.debugLoadedComponentsCount();
        //TODO: ladescreen
        //TODO: elemente sollen selbst bestimmen, ob sie gerendert werden wollen,
        // wenn entsprechender service nicht initialisiert ist
    }

    @ComponentReady()
    connectedCallback(): void {
        this.initNavigation();
        this.initPopups(this.popupFrame, Events.Popup);
        this.initNotifications(this.notification);
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
            this.notifier.debug(`OylApp: navigate to pageId '${ev.pageId}'.`);
        });
        let startPage: PageID;
        this.settings.ifInitSuccessful
            .then(_ => startPage = this.settings.get<PageID>(SettingKey.START_PAGE))
            .catch(_ => startPage = 'playlist_all')//TODO: feste id oder garnix, weil eh keine settings
            .finally(() => {
                this.navBar.setAttribute('page-id', startPage);
                this.pageFrame.setAttribute('page-id', startPage);
                this.slidePage.setAttribute('page-id', startPage);
            });
    }

    @ExecOnReady()
    private initPopups(component: Component, eventType: Events): void {
        this.addEventListener(eventType, ev => component.eventCallback(ev));
    }

    @ExecOnReady()
    private initNotifications(component: Component): void {
        this.addEventListener(Events.Notify, ev => component.eventCallback(ev));
        this.notifier.setReceiver(this).sendNotificationsToReceiver();
    }

    private debugLoadedComponentsCount(): void {
        let label = new OylLabel('Loaded components: {{val1}}', '0');
        let componentCount = 0;
        this.addEventListener(Events.Ready, () => {
            componentCount++;
            label.setAttribute('val1', componentCount.toString());
        });
        this.notifier.debug(label, undefined, label);
    }

    private initGlobalDefaultErrorHandling() {
        window.addEventListener("error", ev => {
            this.notifier.error(ev.message, ev);
        });
        window.addEventListener('unhandledrejection', ev => {
            this.notifier.error('Uncaught Promise: ' + ev.reason, ev);
        });
    }
}

export default OylApp;