import html from "./oyl-notification.html";
import scss from "./oyl-notification.scss";
import { ComponentReady, Inject, InjectionTarget, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";
import NotifyEvent from "../../../events/NotifyEvent";
import OylNotifyCard from "./oyl-notify-card/oyl-notify-card";
import { Events, SettingKey, Status } from "../../../@types/enums";
import NotifyCardClickedEvent from "../../../events/NotifyCardClickedEvent";
import { SettingsServiceInterface } from "../../../@types/types";

@InjectionTarget()
@OylComponent({
    html: html,
    scss: scss
})
class OylNotification extends Component {

    static ELEMENT_INCORRECT_TYPE = 'Created Element <oyl-notify-card> not instance of OylNotifyCard';
    static DELAY = 100;

    protected container: HTMLDivElement;
    protected closeAll: HTMLDivElement;

    private storeInBuffer: boolean = true;
    private buffer: NotifyEvent[] = [];

    constructor(
        @Inject('SettingsServiceInterface') private settings: SettingsServiceInterface
    ) {
        super();
    }

    static get tagName(): string {
        return 'oyl-notification';
    }

    static get observedAttributes() {
        return [];
    }

    @ComponentReady()
    connectedCallback(): void {
        this.settings.ifInitSuccessful
            .then(() => this.showNotificationsInBuffer())
            .catch(() => this.showNotificationsInBuffer());
        this.initCloseButtonRendering();
        this.initEventListeners();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: NotifyEvent): void {
        if (this.storeInBuffer) {
            this.buffer.push(ev);
            return;
        }
        this.showNotification(ev);
    }

    private showNotification(ev: NotifyEvent): void {
        let config = this.getNotifyConfig(ev.status);
        if (!config.visible) {
            return;
        }
        let notify = OylNotification.createNotificationElement(ev, config);
        this.subscribeElementToSettingsService(notify, ev.status);
        if (this.container.children.length === 0) {
            this.container.appendChild(notify);
        } else {
            notify.classList.add("no-height");
            this.container.appendChild(notify);
            notify.classList.remove("no-height");
        }
    }

    private static createNotificationElement(ev: NotifyEvent, settings: NotifyConfig): OylNotifyCard {
        let notify = document.createElement(OylNotifyCard.tagName);
        if (notify instanceof OylNotifyCard) {
            notify.setAttributesFromEvent(ev);
            if (settings.autoClose) {
                notify.closeAfter(settings.interval, OylNotification.DELAY);
            }
            return notify;
        }
        throw new Error(OylNotification.ELEMENT_INCORRECT_TYPE);
    }

    private subscribeElementToSettingsService(notify: OylNotifyCard, status: Status): void {
        let settingKeys = OylNotification.getSettingKeys(status);
        notify.setSettingKeys(...settingKeys);
        this.settings.subscribe(notify, settingKeys);
    }

    private showNotificationsInBuffer(): void {
        this.storeInBuffer = false;
        this.buffer.forEach(ev => this.showNotification(ev));
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

    private removeNotification(card: OylNotifyCard): void {
        this.settings.unsubscribe(card, card.getSettingKeys());
        setTimeout(() => {
            if (this.container.firstElementChild === card) {
                this.container.removeChild(card);
                return;
            }
            card.classList.add('no-height');
            setTimeout(() => {
                this.container.removeChild(card);
            }, OylNotification.DELAY);
        }, OylNotification.DELAY);
    }

    private removeAllNotifications(): void {
        this.container.childNodes.forEach((card: OylNotifyCard) => {
            card.closeCard();
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
            let card = ev.composedPath()[0];
            if (card instanceof OylNotifyCard) {
                this.removeNotification(card);
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