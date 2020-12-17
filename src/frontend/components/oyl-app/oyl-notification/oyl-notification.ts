import html from "./oyl-notification.html";
import scss from "./oyl-notification.scss";
import {ComponentReady, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";
import NotifyEvent from "../../../events/NotifyEvent";
import OylNotifyCard from "./oyl-notify-card/oyl-notify-card";
import { Events, Status } from "../../../@types/enums";
import NotifyCardClickedEvent from "../../../events/NotifyCardClickedEvent";

@OylComponent({
    html: html,
    scss: scss
})
class OylNotification extends Component {

    public static DELAY = 100;

    protected container: HTMLDivElement;
    protected closeAll: HTMLDivElement;

    static get tagName(): string {
        return 'oyl-notification';
    }

    static get observedAttributes() {
        return [];
    }

    @ComponentReady()
    connectedCallback(): void {
        this.initCloseButtonRendering();
        this.initEventListeners();
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    disconnectedCallback(): void {
    }

    eventCallback(ev: NotifyEvent): void {
        let settings = this.getNotifySettings(ev.status);
        if (!settings.visible) {
            return;
        }
        let notify = document.createElement(OylNotifyCard.tagName);
        if (notify instanceof OylNotifyCard) {
            notify.setAttributesFromEvent(ev);
            if (settings.autoClose) {
                notify.closeAfter(settings.interval, OylNotification.DELAY);
            }
            if (this.container.children.length === 0) {
                this.container.appendChild(notify);
            } else {
                notify.classList.add('no-height');
                this.container.appendChild(notify);
                notify.classList.remove('no-height');
            }
        }
    }

    private getNotifySettings(status: Status): NotifySettings {
        if (!this.services.settings.isInitialised) {
            return OylNotification.defaultNotifySettings;
        }
        let settingKeys: SettingKey[] = OylNotification.getSettingKeys(status);
        let settings = this.services.settings.getSettings(settingKeys);
        return {
            visible: settings.get(settingKeys[0]),
            autoClose: settings.get(settingKeys[1]),
            interval: settings.get(settingKeys[2])
        };
    }

    private static getSettingKeys(type: Status): SettingKey[] {
        switch (type) {
            case Status.SUCCESS:
                return [
                    'notification_success_visible', 'notification_success_autoClose', 'notification_success_interval'
                ];
            case Status.DEBUG:
                return [
                    'notification_debug_visible', 'notification_debug_autoClose', 'notification_debug_interval'
                ];
            case Status.INFO:
                return [
                    'notification_info_visible', 'notification_info_autoClose', 'notification_info_interval'
                ];
            case Status.WARN:
                return [
                    'notification_warn_visible', 'notification_warn_autoClose', 'notification_warn_interval'
                ];
            case Status.ERROR:
                return [
                    'notification_error_visible', 'notification_error_autoClose', 'notification_error_interval'
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

    private initEventListeners() {
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

    private static get defaultNotifySettings(): NotifySettings {
        return {visible: true, autoClose: false, interval: 5000};
    }
}

export default OylNotification;