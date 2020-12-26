import { Status } from "../@types/enums";
import { NotifyObject } from "../@types/types";
import { Inject, InjectionTarget } from "../decorators/decorators";

@InjectionTarget()
class Notifier implements NotificationServiceInterface {

    private buffer: NotifyObject[] = [];
    private storeInBuffer: boolean = true;

    private fnColorMap = {
        error: '#ed4a4a',
        warn: '#ffd370',
        info: '#03a9f4',
        debug: '#ffffff',
        success: '#78d561',
    };

    constructor(
        @Inject('ObservableInterface') private observable: ObservableInterface
    ) {}

    subscribe(observer: ObserverFunction<NotifyObject>, watch?: Status[]): void {
        this.observable.subscribe(observer, watch);
    }

    unsubscribe(observer: ObserverFunction<NotifyObject>, watch?: Status[]): void {
        this.observable.unsubscribe(observer, watch);
    }

    private notifySubs(notify: NotifyObject): void {
        this.observable.notifySubs(subWatch => {
            if (subWatch === undefined || subWatch.includes(notify.status)) {
                return notify;
            }
        });
    }

    sendNotificationsToReceiver(): this {
        this.storeInBuffer = false;
        this.buffer.forEach(notify => {
            this.notifySubs(notify);
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
        let detail: NotifyDetails = null;
        if (raw !== undefined || html !== undefined) {
            detail = {raw: raw, html: html};
        }
        let notify: NotifyObject = {
            status: status,
            msg: msg,
            date: new Date(),
            detail: detail
        };
        if (!this.observable.hasSubs() || this.storeInBuffer) {
            this.buffer.push(notify);
        } else {
            this.notifySubs(notify);
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