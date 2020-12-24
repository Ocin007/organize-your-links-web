import { Status } from "../@types/enums";
import NotifyEvent from "../events/NotifyEvent";
import { NotificationServiceInterface } from "../@types/types";

class Notifier implements NotificationServiceInterface {

    private subs: { observer: Observer<any>, watch?: Status[] }[] = [];
    private buffer: NotifyEvent[] = [];
    private storeInBuffer: boolean = true;

    private fnColorMap = {
        error: '#ed4a4a',
        warn: '#ffd370',
        info: '#03a9f4',
        debug: '#ffffff',
        success: '#78d561',
    };

    subscribe<K>(observer: Observer<K>, watch?: Status[]): void {
        this.subs.push({observer: observer, watch: watch});
    }

    unsubscribe<K>(observer: Observer<K>, watch?: Status[]): void {
        let index = this.subs.findIndex((value => value.observer === observer && this.statusListsEqual(value.watch, watch)));
        if (index === -1) {
            return;
        }
        this.subs.splice(index, 1);
    }

    private statusListsEqual(arr1?: Status[], arr2?: Status[]): boolean {
        if (arr1 === undefined && arr2 === undefined) {
            return true;
        }
        if (arr1 === undefined || arr2 === undefined) {
            return false;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }
        let equal: boolean = true;
        arr1.forEach(key => equal &&= arr2.includes(key));
        return equal;
    }

    private notifySubs(ev: NotifyEvent): void {
        this.subs.forEach((sub) => {
            if (sub.watch === undefined) {
                sub.observer.update(ev);
                return;
            }
            let hasAnyKey = false;
            sub.watch.forEach(key => hasAnyKey ||= key === ev.status);
            if (hasAnyKey) {
                sub.observer.update(ev);
            }
        });
    }

    sendNotificationsToReceiver(): this {
        this.storeInBuffer = false;
        this.buffer.forEach(ev => {
            this.notifySubs(ev);
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
        if (this.subs.length === 0 || this.storeInBuffer) {
            this.buffer.push(ev);
        } else {
            this.notifySubs(ev);
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