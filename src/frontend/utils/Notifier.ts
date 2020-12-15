import { Status } from "../@types/enums";
import NotifyEvent from "../events/NotifyEvent";

class Notifier {

    //TODO: interface Messanger?

    private appRoot: HTMLElement;

    constructor() {
        this.appRoot = document.querySelector("oyl-app");
    }

    success(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        this.send(Status.SUCCESS, msg, raw, html);
    }

    debug(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        this.send(Status.DEBUG, msg, raw, html);
    }

    info(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        this.send(Status.INFO, msg, raw, html);
    }

    warn(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        this.send(Status.WARN, msg, raw, html);
    }

    error(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        this.send(Status.ERROR, msg, raw, html);
    }

    private send(status: Status, msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        let eventInitDict: CustomEventInit<NotifyDetails> = undefined;
        if (raw !== undefined || html !== undefined) {
            eventInitDict = {detail: {raw: raw, html: html}};
        }
        this.appRoot.dispatchEvent(new NotifyEvent(status, msg, eventInitDict));
    }
}

export default Notifier;