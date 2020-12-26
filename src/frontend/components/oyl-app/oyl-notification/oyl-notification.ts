import html from "./oyl-notification.html";
import scss from "./oyl-notification.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";
import OylNotifyCard from "./oyl-notify-card/oyl-notify-card";
import { Events, SettingKey, Status } from "../../../@types/enums";
import NotifyCardClickedEvent from "../../../events/NotifyCardClickedEvent";
import { NotifyObject, SettingsServiceInterface } from "../../../@types/types";

@OylComponent({
    html: html,
    scss: scss
})
class OylNotification extends Component {

    static ELEMENT_INCORRECT_TYPE = 'Created Element <oyl-notify-card> not instance of OylNotifyCard';
    static DELAY = 100;

    protected container: HTMLDivElement;
    protected closeAll: HTMLDivElement;

    constructor(
        @Inject('SettingsServiceInterface') private settings: SettingsServiceInterface,
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface
    ) {
        super();
    }

    static get tagName(): string {
        return 'oyl-notification';
    }

    static get observedAttributes() {
        return [];
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.settings.whenInitSuccessful()
            .then(() => undefined)
            .catch(() => undefined)
            .finally(() => {
                this.notifier.subscribe(notify => this.showNotification(notify));
                this.notifier.sendNotificationsToReceiver();
            });
        this.initCloseButtonRendering();
        this.initEventListeners();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    private showNotification(notify: NotifyObject): void {
        let config = this.getNotifyConfig(notify.status);
        if (!config.visible) {
            return;
        }
        let element = OylNotification.createNotificationElement(notify, config);
        this.subscribeElementToSettingsService(element, notify.status);
        if (this.container.children.length === 0) {
            this.container.appendChild(element);
        } else {
            element.classList.add("no-height");
            this.container.appendChild(element);
            element.classList.remove("no-height");
        }
    }

    private static createNotificationElement(notify: NotifyObject, settings: NotifyConfig): OylNotifyCard {
        let element = document.createElement(OylNotifyCard.tagName);
        if (element instanceof OylNotifyCard) {
            element.setAttributesFromEvent(notify);
            if (settings.autoClose) {
                element.closeAfter(settings.interval, OylNotification.DELAY);
            }
            return element;
        }
        throw new Error(OylNotification.ELEMENT_INCORRECT_TYPE);
    }

    private subscribeElementToSettingsService(element: OylNotifyCard, status: Status): void {
        let settingKeys = OylNotification.getSettingKeys(status);
        element.setSettingKeys(...settingKeys);
        this.settings.subscribe(element.update, settingKeys);
    }

    private getNotifyConfig(status: Status): NotifyConfig {
        if (!this.settings.isInitialised) {
            return OylNotification.defaultNotifyConfig;
        }
        let settingKeys: SettingKey[] = OylNotification.getSettingKeys(status);
        let settings = this.settings.getSettings(settingKeys);
        return {
            visible: settings.get(settingKeys[0]),
            autoClose: settings.get(settingKeys[1]),
            interval: settings.get(settingKeys[2])
        };
    }

    private static getSettingKeys(type: Status): [SettingKey, SettingKey, SettingKey] {
        switch (type) {
            case Status.SUCCESS:
                return [
                    SettingKey.NOTIFY_SUCCESS_VISIBLE,
                    SettingKey.NOTIFY_SUCCESS_AUTO_CLOSE,
                    SettingKey.NOTIFY_SUCCESS_INTERVAL
                ];
            case Status.DEBUG:
                return [
                    SettingKey.NOTIFY_DEBUG_VISIBLE,
                    SettingKey.NOTIFY_DEBUG_AUTO_CLOSE,
                    SettingKey.NOTIFY_DEBUG_INTERVAL
                ];
            case Status.INFO:
                return [
                    SettingKey.NOTIFY_INFO_VISIBLE,
                    SettingKey.NOTIFY_INFO_AUTO_CLOSE,
                    SettingKey.NOTIFY_INFO_INTERVAL
                ];
            case Status.WARN:
                return [
                    SettingKey.NOTIFY_WARN_VISIBLE,
                    SettingKey.NOTIFY_WARN_AUTO_CLOSE,
                    SettingKey.NOTIFY_WARN_INTERVAL
                ];
            case Status.ERROR:
                return [
                    SettingKey.NOTIFY_ERROR_VISIBLE,
                    SettingKey.NOTIFY_ERROR_AUTO_CLOSE,
                    SettingKey.NOTIFY_ERROR_INTERVAL
                ];
        }
    }

    private renderCloseAllButton(): void {
        if (this.container.children.length < 2) {
            this.closeAll.style.display = 'none';
        } else {
            this.closeAll.style.display = '';
        }
    }

    private removeNotification(element: OylNotifyCard): void {
        this.settings.unsubscribe(element.update, element.getSettingKeys());
        setTimeout(() => {
            if (this.container.firstElementChild === element) {
                this.container.removeChild(element);
                return;
            }
            element.classList.add('no-height');
            setTimeout(() => {
                this.container.removeChild(element);
            }, OylNotification.DELAY);
        }, OylNotification.DELAY);
    }

    private removeAllNotifications(): void {
        this.container.childNodes.forEach((element: OylNotifyCard) => {
            element.closeCard();
        });
    }

    private initCloseButtonRendering(): void {
        let append = this.container.appendChild;
        this.container.appendChild = <T extends Node>(newChild): T => {
            let node = append.call(this.container, newChild);
            this.renderCloseAllButton();
            return node;
        };

        let remove = this.container.removeChild;
        this.container.removeChild = <T extends Node>(oldChild): T => {
            let node = remove.call(this.container, oldChild);
            this.renderCloseAllButton();
            return node;
        };
    }

    private initEventListeners(): void {
        this.addEventListener(Events.NotifyClick, (ev: NotifyCardClickedEvent) => {
            let element = ev.composedPath()[0];
            if (element instanceof OylNotifyCard) {
                this.removeNotification(element);
            }
        });
        this.closeAll.addEventListener('click', () => {
            this.removeAllNotifications();
        });
    }

    private static get defaultNotifyConfig(): NotifyConfig {
        return {visible: true, autoClose: false, interval: 5000};
    }
}

export default OylNotification;