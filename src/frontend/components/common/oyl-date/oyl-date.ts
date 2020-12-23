import html from "./oyl-date.html";
import scss from "./oyl-date.scss";
import { ComponentConnected, ComponentDisconnected, OylComponent } from "../../../decorators/decorators";
import Component from "../../component";

@OylComponent({
    html: html,
    scss: scss
})
class OylDate extends Component {

    protected span: HTMLSpanElement;

    private date: Date;
    private format: string;

    static get formats(): string[] {
        return ['time', 'timeMs'];
    }

    static get tagName(): string {
        return 'oyl-date';
    }

    static get observedAttributes() {
        return ['timestamp', 'format'];
    }

    constructor() {
        super();
        this.date = new Date();
        this.format = 'timeMs';
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
        }
        if (valueCorrect) {
            this.render();
        }
    }

    @ComponentDisconnected()
    disconnectedCallback(): void {
    }

    eventCallback(ev: Event): void {
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

    private render(): void {
        switch (this.format) {
            case 'time':
                this.span.innerText = this.getTime();
                break;
            case 'timeMs':
                this.span.innerText = this.getTimeMs();
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

    private static toDigit(number: number, digits: number): string {
        let numStr = number.toString();
        let zerosCount = digits - numStr.length < 0 ? 0 : digits - numStr.length;
        let digitStr = '0'.repeat(zerosCount);
        return digitStr + numStr;
    }
}

export default OylDate;