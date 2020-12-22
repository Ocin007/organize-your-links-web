import { Status } from "../@types/enums";
import NotifyEvent from "../events/NotifyEvent";
import { NotificationServiceInterface } from "../@types/types";
import Component from "../components/component";

class Notifier implements NotificationServiceInterface {

    private notifyReceiver: Component;
    private buffer: NotifyEvent[] = [];
    private storeInBuffer: boolean = true;

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
        Notifier.console(console.log, msg, raw, html);
        return this;
    }

    debug(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.DEBUG, msg, raw, html);
        Notifier.console(console.log, msg, raw, html);
        return this;
    }

    info(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.INFO, msg, raw, html);
        Notifier.console(console.log, msg, raw, html);
        return this;
    }

    warn(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.WARN, msg, raw, html);
        Notifier.console(console.warn, msg, raw, html);
        return this;
    }

    error(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this {
        this.send(Status.ERROR, msg, raw, html);
        Notifier.console(console.error, msg, raw, html);
        return this;
    }

    private send(status: Status, msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
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

    private static console(logFn: (...args: any[]) => void, msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        logFn(msg);
        if (raw !== undefined) {
            logFn(raw);
        }
        if (html !== undefined) {
            logFn(html);
        }
    }
}

export default Notifier;