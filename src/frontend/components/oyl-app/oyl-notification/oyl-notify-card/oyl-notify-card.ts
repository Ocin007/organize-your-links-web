import html from "./oyl-notify-card.html";
import scss from "./oyl-notify-card.scss";
import { ComponentConnected, ComponentDisconnected, Inject, OylComponent } from "../../../../decorators/decorators";
import Component from "../../../component";
import successIcon from "./assets/icons/success.ico";
import infoIcon from "./assets/icons/info.ico";
import warnIcon from "./assets/icons/warn.ico";
import errorIcon from "./assets/icons/error.ico";
import debugIcon from "./assets/icons/debug.ico";
import NotifyEvent from "../../../../events/NotifyEvent";
import { SettingKey, Status } from "../../../../@types/enums";
import NotifyCardClickedEvent from "../../../../events/NotifyCardClickedEvent";
import OylDate from "../../../common/oyl-date/oyl-date";
import { Settings, SettingsServiceInterface } from "../../../../@types/types";

@OylComponent({
    html: html,
    scss: scss
})
class OylNotifyCard extends Component {

    private readonly headLine = {
        success: 'SUCCESS',
        info: 'INFO',
        warn: 'WARNING',
        error: 'ERROR',
        debug: 'DEBUG'
    };

    protected card: HTMLDivElement;
    protected lifetimeBar: HTMLDivElement;
    protected icon: HTMLImageElement;
    protected heading: HTMLHeadingElement;
    protected msgElement: HTMLParagraphElement;
    protected showDetailsLink: HTMLHeadingElement;
    protected oylDate: OylDate;

    private status: Status;
    private msgString: string = '';
    private msgLabel: HTMLElement;
    private date: Date;
    private details: NotifyDetails;
    private interval: number;

    private timeoutId: NodeJS.Timeout;
    private autoClose: boolean = false;
    private isRemoved: boolean;

    private readonly iconPath = {
        success: successIcon,
        info: infoIcon,
        warn: warnIcon,
        error: errorIcon,
        debug: debugIcon
    };

    private keyVisible: SettingKey;
    private keyAutoClose: SettingKey;
    private keyInterval: SettingKey;

    constructor(
        //TODO: remove this, setSettings test
        @Inject('SettingsServiceInterface') private settings: SettingsServiceInterface
    ) {
        super();
    }

    static get tagName(): string {
        return 'oyl-notify-card';
    }

    static get observedAttributes() {
        return [];
    }

    setAttributesFromEvent(ev: NotifyEvent): void {
        this.status = ev.status;
        if (ev.msg instanceof HTMLElement) {
            this.msgLabel = ev.msg;
        } else {
            this.msgString = ev.msg;
        }
        this.date = ev.date;
        this.details = ev.detail;
    }

    closeAfter(milliSeconds: number, delay: number): void {
        this.interval = milliSeconds;
        this.autoClose = true;
        this.timeoutId = setTimeout(() => {
            this.timeoutId = undefined;
            this.startTimer();
        }, delay);
        this.addEventListener('mouseenter', this.stopTimer);
        this.addEventListener('mouseleave', this.startTimer);
    }

    disableAutoClose(): void {
        this.autoClose = false;
        this.stopTimer();
        this.removeEventListener('mouseenter', this.stopTimer);
        this.removeEventListener('mouseleave', this.startTimer);
    }

    setSettingKeys(visible: SettingKey, autoClose: SettingKey, interval: SettingKey): void {
        this.keyVisible = visible;
        this.keyAutoClose = autoClose;
        this.keyInterval = interval;
    }

    getSettingKeys(): SettingKey[] {
        return [
            this.keyVisible,
            this.keyAutoClose,
            this.keyInterval,
        ];
    }

    update: (settings: Settings) => void  = (settings: Settings) => {
        let visible: boolean = settings.get(this.keyVisible);
        if (!visible) {
            this.closeCard();
            return;
        }
        let autoClose: boolean = settings.get(this.keyAutoClose);
        let interval: number = settings.get(this.keyInterval);
        if (autoClose !== this.autoClose) {
            if (autoClose) {
                this.closeAfter(interval, 0);
            } else {
                this.disableAutoClose();
            }
        } else if (interval !== this.interval && this.autoClose) {
            this.disableAutoClose();
            this.closeAfter(interval, 0);
        }
    }

    @ComponentConnected()
    connectedCallback(): void {
        this.isRemoved = false;
        this.render();
        this.addEventListener('click', (ev) => {
            if (ev.composedPath()[0] === this.showDetailsLink) {
                this.openPopup();
            } else {
                this.closeCard();
            }
        });
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
    }

    private render(): void {
        this.renderDescription();
        this.renderDate();
        switch (this.status) {
            case Status.SUCCESS:
                this.renderStatusSpecificElements('success');
                break;
            case Status.INFO:
                this.renderStatusSpecificElements('info');
                break;
            case Status.WARN:
                this.renderStatusSpecificElements('warn');
                break;
            case Status.ERROR:
                this.renderStatusSpecificElements('error');
                break;
            case Status.DEBUG:
                this.renderStatusSpecificElements('debug');
                break;
        }
        this.renderSlideInAnimation();
    }

    private openPopup(): void {
        //TODO: PopupEvent

        //TODO: remove this, setSettings test
        let settings = this.settings.getSettings(this.getSettingKeys());
        settings.delete(this.keyInterval);
        settings.delete(this.keyVisible);
        settings.set(this.keyAutoClose, !settings.get(this.keyAutoClose));
        this.settings.setSettings(settings)
            .then((bool) => console.log('set settings: ' + bool))
            .catch(error => console.log(error));
    }

    closeCard(): void {
        if(this.isRemoved) {
            return;
        }
        this.isRemoved = true;
        this.card.classList.add('notify-card-slide-out');
        this.dispatchEvent(new NotifyCardClickedEvent());
    }

    private renderDescription(): void {
        if (this.msgLabel !== undefined) {
            this.msgElement.appendChild(this.msgLabel);
        } else {
            this.msgElement.innerText = this.msgString;
        }
        this.msgElement.classList.add('fade-last-line');
        if (this.msgElement.scrollHeight <= this.msgElement.clientHeight) {
            this.msgElement.classList.remove('fade-last-line');
        }
    }

    private renderDate(): void {
        this.oylDate.setAttribute('timestamp', this.date.getTime().toString());
    }

    private renderStatusSpecificElements(appendix: NotifyType): void {
        this.heading.innerText = this.headLine[appendix];
        this.heading.classList.add(appendix);
        this.icon.src = this.iconPath[appendix];
        this.lifetimeBar.classList.add('lifetime-bar-' + appendix);
    }

    private startTimer = () => {
        if (this.timeoutId !== undefined) {
            return;
        }
        this.startLifeTimeBar();
        this.timeoutId = setTimeout(() => {
            this.closeCard();
        }, this.interval);
    }

    private stopTimer = () => {
        this.resetLifeTimeBar();
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
    }

    private startLifeTimeBar(): void {
        this.lifetimeBar.style.transition = `height ${this.interval}ms linear`;
        this.lifetimeBar.style.height = '0';
    }

    private resetLifeTimeBar(): void {
        this.lifetimeBar.style.transition = 'none';
        this.lifetimeBar.style.height = '100%';
    }

    private renderSlideInAnimation(): void {
        this.card.classList.add('notify-card-not-visible');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.card.classList.add('notify-card-slide-in');
            });
        });
    }
}

export default OylNotifyCard;