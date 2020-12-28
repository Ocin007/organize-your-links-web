import html from "./oyl-date.html";
import scss from "./oyl-date.scss";
import { ComponentConnected, ComponentDisconnected, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylDate extends Component {

    private static SECOND: number = 1000;
    private static MINUTE: number = OylDate.SECOND * 60;
    private static HOUR: number = OylDate.MINUTE * 60;
    private static DAY: number = OylDate.HOUR * 24;
    private static WEEK: number = OylDate.DAY * 7;
    private static MONTH: number = OylDate.DAY * 30;
    private static YEAR: number = OylDate.DAY * 365;

    protected span: HTMLSpanElement;

    private date: Date;
    private format: string;
    private prefixes: string;

    static get formats(): string[] {
        return ['time', 'timeMs', 'timeDiff'];
    }

    static get tagName(): string {
        return 'oyl-date';
    }

    static get observedAttributes() {
        return ['timestamp', 'format', 'prefixes'];
    }

    constructor() {
        super();
        this.date = new Date();
        this.format = 'timeMs';
        this.prefixes = 'vor-in';
    }

    @ComponentConnected()
    connectedCallback(): void {
    }

    attributeChangedCallback(name: string, oldVal: string, newVal: string): void {
        let valueCorrect: boolean;
        switch (name) {
            case 'timestamp':
                valueCorrect = this.setTimestamp(newVal);
                break;
            case 'format':
                valueCorrect = this.setFormat(newVal);
                break;
            case 'prefixes':
                valueCorrect = this.setPrefix(newVal);
                break;
        }
        if (valueCorrect) {
            this.render();
        }
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    private setTimestamp(newVal: string): boolean {
        let timestamp = parseInt(newVal);
        if (isNaN(timestamp)) {
            this.span.innerText = 'Invalid date';
            return false;
        }
        this.date = new Date(timestamp);
        return true;
    }

    private setFormat(newVal: string): boolean {
        if (!OylDate.formats.includes(newVal)) {
            this.span.innerText = 'Invalid format';
            return false;
        }
        this.format = newVal;
        return true;
    }

    private setPrefix(newVal: string): boolean {
        let prefixes = newVal.split('-');
        if (prefixes.length !== 2) {
            this.span.innerText = 'Invalid prefixes';
            return false;
        }
        this.prefixes = newVal;
        return true;
    }

    private render(): void {
        switch (this.format) {
            case 'time':
                this.span.innerText = this.getTime();
                break;
            case 'timeMs':
                this.span.innerText = this.getTimeMs();
                break;
            case 'timeDiff':
                this.span.innerText = this.getTimeDiff();
                break;
        }
    }

    private getTime(): string {
        return OylDate.toDigit(this.date.getHours(), 2) + ':' +
            OylDate.toDigit(this.date.getMinutes(), 2) + ':' +
            OylDate.toDigit(this.date.getSeconds(), 2);
    }

    private getTimeMs(): string {
        return OylDate.toDigit(this.date.getHours(), 2) + ':' +
            OylDate.toDigit(this.date.getMinutes(), 2) + ':' +
            OylDate.toDigit(this.date.getSeconds(), 2) + ':' +
            OylDate.toDigit(this.date.getMilliseconds(), 3);
    }

    private getTimeDiff(): string {
        let timeDiff = this.date.getTime() - new Date().getTime();
        let prefix: string;
        if (timeDiff < 0) {
            prefix = this.prefixes.split('-')[0];
            timeDiff *= -1;
        } else {
            prefix = this.prefixes.split('-')[1];
        }
        if (timeDiff < OylDate.SECOND) {
            return 'jetzt';
        }

        let years = Math.floor(timeDiff / OylDate.YEAR);
        if (years > 1) {
            return `${prefix} ${years} Jahren`;
        }
        let months = Math.floor(timeDiff / OylDate.MONTH);
        if (years === 1 || months > 11) {
            return `${prefix} 1 Jahr`;
        }

        if (months > 1) {
            return `${prefix} ${months} Monaten`;
        }
        let weeks = Math.floor(timeDiff / OylDate.WEEK);
        if (months === 1 || weeks > 4) {
            return `${prefix} 1 Monat`;
        }

        if (weeks > 1) {
            return `${prefix} ${weeks} Wochen`;
        }
        if (weeks === 1) {
            return `${prefix} 1 Woche`;
        }

        let days = Math.floor(timeDiff / OylDate.DAY);
        if (days > 1) {
            return `${prefix} ${days} Tagen`;
        }
        if (days === 1) {
            return `${prefix} 1 Tag`;
        }

        let hours = Math.floor(timeDiff / OylDate.HOUR);
        if (hours > 1) {
            return `${prefix} ${hours} Stunden`;
        }
        if (hours === 1) {
            return `${prefix} 1 Stunde`;
        }

        let minutes = Math.floor(timeDiff / OylDate.MINUTE);
        if (minutes > 1) {
            return `${prefix} ${minutes} Minuten`;
        }
        if (minutes === 1) {
            return `${prefix} 1 Minute`;
        }

        let seconds = Math.floor(timeDiff / OylDate.SECOND);
        if (seconds > 1) {
            return `${prefix} ${seconds} Sekunden`;
        }
        if (seconds === 1) {
            return `${prefix} 1 Sekunde`;
        }
    }

    private static toDigit(number: number, digits: number): string {
        let numStr = number.toString();
        let zerosCount = digits - numStr.length < 0 ? 0 : digits - numStr.length;
        let digitStr = '0'.repeat(zerosCount);
        return digitStr + numStr;
    }
}

export default OylDate;