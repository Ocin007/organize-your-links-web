import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import { ComponentConnected, ComponentDisconnected, ExecOnReady, Inject, OylComponent } from "../../decorators/decorators";
import Component from "../component";
import { Events, SettingKey } from "../../@types/enums";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import NavEvent from "../../events/NavEvent";
import OylLabel from "../common/oyl-label/oyl-label";
import { NotificationServiceInterface, SettingsServiceInterface } from "../../@types/types";

@OylComponent({
    html: html,
    scss: scss
})
class OylApp extends Component {

    protected navBar: OylNavBar;
    protected pageFrame: OylPageFrame;
    protected slidePage: OylSlidePage;
    protected popupFrame: OylPopupFrame;

    static get tagName(): string {
        return 'oyl-app';
    }

    static get observedAttributes() {
        return [];
    }

    //TODO: FormController + FormElementsInterface allgemeines System (in Popups, Serie bearbeiten, Settings...)
    //TODO: opacity Layer als eigenes modul (component + service)
    // dieses modul jeweils für slidePage und Popup importieren oder einmal allgemein?

    //TODO: <ng-content> mechanik für routing hilfreich
    // <oyl-notification>
    //     <oyl-notify-card></oyl-notify-card>
    // </oyl-notification>
    constructor(
        @Inject('SettingsServiceInterface') private settings: SettingsServiceInterface,
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface
    ) {
        super();
        this.initGlobalDefaultErrorHandling();
        this.debugLoadedComponentsCount();
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.initNavigation();
        this.initPopups(this.popupFrame);
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }

    //TODO: NavigationService (als observable!)
    //TODO: advanced: NavigationModule mit routing service und komponente, die entsprechende
    // komponente einbindet, zu der navigiert wird (ersetzt wahrscheinlich <oyl-page-frame>)
    private initNavigation(): void {
        this.addEventListener(Events.Nav, (ev: NavEvent) => {
            this.navBar.setAttribute('page-id', ev.pageId);
            this.pageFrame.setAttribute('page-id', ev.pageId);
            this.slidePage.setAttribute('page-id', ev.pageId);
            this.notifier.debug(`OylApp: navigate to pageId '${ev.pageId}'.`);
        });
        let startPage: PageID;
        this.settings.whenInitSuccessful()
            .then(err => startPage = (err.length === 0) ? this.settings.get<PageID>(SettingKey.START_PAGE) : 'playlist_all')
            .catch(_ => startPage = 'playlist_all')//TODO: feste id oder garnix, weil eh keine settings
            .finally(() => {
                this.navBar.setAttribute('page-id', startPage);
                this.pageFrame.setAttribute('page-id', startPage);
                this.slidePage.setAttribute('page-id', startPage);
            });
    }

    //TODO: PopupService (als observable?)
    @ExecOnReady()
    private initPopups(component: Component): void {
        this.addEventListener(Events.Popup, ev => component.eventCallback(ev));
    }

    private debugLoadedComponentsCount(): void {
        let label = new OylLabel('Loaded components: {{val1}}', '0');
        let componentCount = 0;
        let count = () => {
            componentCount++;
            label.setAttribute('val1', componentCount.toString());
        };
        label.addEventListener(Events.Disconnected, () => {
            this.removeEventListener(Events.Connected, count);
        }, {once: true});
        this.addEventListener(Events.Connected, count);
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