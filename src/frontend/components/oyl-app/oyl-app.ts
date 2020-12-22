import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import { ComponentReady, ExecOnReady, OylComponent } from "../../decorators/decorators";
import Component from "../component";
import { Events, SettingKey, Status } from "../../@types/enums";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";
import NavEvent from "../../events/NavEvent";
import OylLabel from "../common/oyl-label/oyl-label";
import SettingsService from "../../services/SettingsService";
import NotifyEvent from "../../events/NotifyEvent";
import ComponentReadyEvent from "../../events/ComponentReadyEvent";

@OylComponent({
    html: html,
    scss: scss
})
class OylApp extends Component {

    static CANNOT_LOAD_SETTINGS = 'Settings konnten nicht geladen werden.';

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

    //TODO: oyl-app per js in <body> einfügen, selbe instanz für den Notifier (dependency system)
    constructor() {
        super();
        this.catchAllNotificationsUntilReady();
        this.initGlobalDefaultErrorHandling();
        this.debugLoadedComponentsCount();
        this.initServices().then(success => {
            console.log('initServices success: ' + success);
            //TODO: ladescreen
            //TODO: elemente sollen selbst bestimmen, ob sie gerendert werden wollen,
            // wenn entsprechender service nicht initialisiert ist
        });
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

    //TODO: init in dependency system?
    async initServices(): Promise<boolean> {
        try {
            //TODO: vlt mit service provider ServiceInterface[]
            let promises: Promise<boolean>[] = [
                //TODO: testen, ob das so noch parallel ausführt
                SettingsService.instance.init()
                    .then(this.sendErrorOnFailure(OylApp.CANNOT_LOAD_SETTINGS))
                    .catch(this.sendError(OylApp.CANNOT_LOAD_SETTINGS))
            ];
            let results = await Promise.all(promises);
            let success = results.reduce<boolean>((a, b) => a && b, true);
            console.log(results);
            return success;
        } catch (e) {
            this.dispatchEvent(new NotifyEvent(Status.ERROR, e, {detail: {raw: e}}));
            return false;
        }
    }

    private sendErrorOnFailure(msg: string): (arr: string[]) => boolean {
        return (arr: string[]): boolean => {
            if (arr.length === 0) {
                return true;
            }
            return this.sendError(msg)(arr);
        };
    }

    private sendError(msg: string): (err: any) => boolean {
        return (err: any): boolean => {
            this.dispatchEvent(new NotifyEvent(Status.ERROR, msg, {detail: {raw: err}}));
            return false;
        };
    }

    eventCallback(ev: Event): void {
    }

    private initNavigation(): void {
        this.addEventListener(Events.Nav, (ev: NavEvent) => {
            this.navBar.setAttribute('page-id', ev.pageId);
            this.pageFrame.setAttribute('page-id', ev.pageId);
            this.slidePage.setAttribute('page-id', ev.pageId);
        });
        let startPage: PageID;
        this.services.settings.ifInitSuccessful
            .then(_ => startPage = this.services.settings.get<PageID>(SettingKey.START_PAGE))
            .catch(_ => startPage = 'playlist_all')//TODO: feste id oder garnix, weil eh keine settings
            .finally(() => {
                this.navBar.setAttribute('page-id', startPage);
                this.pageFrame.setAttribute('page-id', startPage);
                this.slidePage.setAttribute('page-id', startPage);
            });
    }

    @ExecOnReady()
    private setPageId(component: Component, pageId: PageID): void {
        component.setAttribute('page-id', pageId);
    }

    @ExecOnReady()
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
        window.addEventListener('unhandledrejection', ev => {
            this.dispatchEvent(new NotifyEvent(Status.ERROR, 'Uncaught Promise: ' + ev.reason, {detail: {raw: ev}}));
        });
    }
}

export default OylApp;