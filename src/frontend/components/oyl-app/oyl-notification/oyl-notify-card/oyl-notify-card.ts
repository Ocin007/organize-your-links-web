import html from "./oyl-notify-card.html";
import scss from "./oyl-notify-card.scss";
import {ComponentReady, OylComponent} from "../../../../decorators/decorators";
import Component from "../../../component";
import successIcon from "./assets/icons/success.ico";
import infoIcon from "./assets/icons/info.ico";
import warnIcon from "./assets/icons/warn.ico";
import errorIcon from "./assets/icons/error.ico";
import debugIcon from "./assets/icons/debug.ico";
import NotifyEvent from "../../../../events/NotifyEvent";
import {Status} from "../../../../@types/enums";
import NotifyCardClickedEvent from "../../../../events/NotifyCardClickedEvent";
import OylDate from "../../../common/oyl-date/oyl-date";

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
    private milliSeconds: number;

    private isRemoved: boolean;

    private readonly iconPath = {
        success: successIcon,
        info: infoIcon,
        warn: warnIcon,
        error: errorIcon,
        debug: debugIcon
    };

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
        this.milliSeconds = milliSeconds;
        setTimeout(() => {
            this.startLifeTimeBar();
        }, delay);
        let timeout = setTimeout(() => {
            this.closeCard();
        }, milliSeconds + delay);
        this.addEventListener('mouseenter', () => {
            this.resetLifeTimeBar();
            clearTimeout(timeout);
        });
        this.addEventListener('mouseleave', () => {
            this.startLifeTimeBar();
            timeout = setTimeout(() => {
                this.closeCard();
            }, milliSeconds);
        });
    }

    @ComponentReady()
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

    private renderStatusSpecificElements(appendix: 'success' | 'info' | 'warn' | 'error' | 'debug' ): void {
        this.heading.innerText = this.headLine[appendix];
        this.heading.classList.add(appendix);
        this.icon.src = this.iconPath[appendix];
        this.lifetimeBar.classList.add('lifetime-bar-' + appendix);
    }

    private startLifeTimeBar(): void {
        this.lifetimeBar.style.transition = `height ${this.milliSeconds}ms linear`;
        this.lifetimeBar.style.height = '0';
    }

    private resetLifeTimeBar(): void {
        this.lifetimeBar.style.transition = 'none';
        this.lifetimeBar.style.height = '100%';
    }

    private renderSlideInAnimation(): void {
        this.card.classList.add('notify-card-not-visible');
        requestAnimationFrame(() => {
            this.card.classList.add('notify-card-slide-in');
        });
    }
}

export default OylNotifyCard;