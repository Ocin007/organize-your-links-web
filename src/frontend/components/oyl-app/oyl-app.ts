import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../decorators/decorators";
import Component from "../component";
import { Events, SettingKey } from "../../@types/enums";
import OylLabel from "../common/oyl-label/oyl-label";
import { SettingsServiceInterface } from "../../@types/types";
import ComponentConnectedEvent from "../../events/ComponentConnectedEvent";

@OylComponent({
    html: html,
    scss: scss
})
class OylApp extends Component {

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
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface,
        @Inject('NavigationServiceInterface') private navigator: NavigationServiceInterface
    ) {
        super();
        this.initGlobalDefaultErrorHandling();
        this.debugLoadedComponentsCount();
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.openStartPage();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    private openStartPage(): void {
        let startPage: PageID;
        this.settings.whenInitSuccessful()
            .then(err => startPage = (err.length === 0) ? this.settings.get<PageID>(SettingKey.START_PAGE) : '')
            .catch(_ => startPage = '')
            .finally(() => this.navigator.navigateTo(startPage));
    }

    private debugLoadedComponentsCount(): void {
        let label = new OylLabel('Loaded components: {{val1}}', '0');
        let obj = {};
        let componentCount = 0;
        let count = (ev: ComponentConnectedEvent) => {
            componentCount++;
            let element = ev.composedPath()[0];
            if (element instanceof Component) {
                if (obj[element.localName] === undefined) {
                    obj[element.localName] = 0;
                }
                obj[element.localName]++;
            }
            label.setAttribute('val1', componentCount.toString());
        };
        label.addEventListener(Events.Disconnected, () => {
            this.removeEventListener(Events.Connected, count);
        }, {once: true});
        this.addEventListener(Events.Connected, count);
        this.notifier.debug(label, obj);
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