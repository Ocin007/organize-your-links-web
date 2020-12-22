import { Status } from "../@types/enums";
import NotifyEvent from "../events/NotifyEvent";
import { NotificationServiceInterface } from "../@types/types";
import Component from "../components/component";

class Notifier implements NotificationServiceInterface {

    private notifyReceiver: Component;
    private buffer: NotifyEvent[] = [];
    private storeInBuffer: boolean = true;

    private fnColorMap = {
        error: '#ed4a4a',
        warn: '#ffd370',
        info: '#03a9f4',
        debug: '#ffffff',
        success: '#78d561',
    };

    setReceiver(element: Component): this {
        this.notifyReceiver = element;
        return this;
    }

    sendNotificationsToReceiver(): this {
        this.storeInBuffer = false;
        this.buffer.forEach(ev => {
            this.notifyReceiver.dispatchEvent(ev);
        });
        this.buffer = [];
        return this;
    }

    success(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.SUCCESS, msg, raw, html);
        return this;
    }

    debug(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.DEBUG, msg, raw, html);
        return this;
    }

    info(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.INFO, msg, raw, html);
        return this;
    }

    warn(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.WARN, msg, raw, html);
        return this;
    }

    error(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.ERROR, msg, raw, html);
        return this;
    }

    private send(status: Status, msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        this.printToConsole(status, msg, raw, html);
        let eventInitDict: CustomEventInit<NotifyDetails>;
        if (raw !== undefined || html !== undefined) {
            eventInitDict = {detail: {raw: raw, html: html}};
        }
        let ev = new NotifyEvent(status, msg, eventInitDict);
        if (this.notifyReceiver === undefined || this.storeInBuffer) {
            this.buffer.push(ev);
        } else {
            this.notifyReceiver.dispatchEvent(ev);
        }
    }

    private printToConsole(status: Status, msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        console.log('%c--------------------------------------------------------------------------', 'color: #ff00ff');
        if (typeof msg === 'string') {
            console.log('%c' + msg, `color: ${this.fnColorMap[status]}; font-weight: bold;`);
        } else {
            Notifier.printHtmlToConsole(status, msg);
        }
        if (raw !== undefined) {
            console.log(raw);
        }
        if (html !== undefined) {
            console.log(html);
        }
    }

    private static printHtmlToConsole(status: Status, element: HTMLElement): void {
        switch (status) {
            case Status.WARN:
                console.warn(element);
                break;
            case Status.ERROR:
                console.error(element);
                break;
            default:
                console.log(element);
        }
    }
}

export default Notifier;