import html from "./oyl-notification.html";
import scss from "./oyl-notification.scss";
import {ComponentReady, OylComponent} from "../../../decorators/decorators";
import Component from "../../component";
import NotifyEvent from "../../../events/NotifyEvent";
import OylNotifyCard from "./oyl-notify-card/oyl-notify-card";
import {Events} from "../../../@types/enums";
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
        let settings = this.services.settings.getNotify(ev.status);
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
}

export default OylNotification;