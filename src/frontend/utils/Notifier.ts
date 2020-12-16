import { Status } from "../@types/enums";
import NotifyEvent from "../events/NotifyEvent";

class Notifier {

    //TODO: interface Messanger?

    private static get appRoot(): HTMLElement {
        return document.querySelector("oyl-app") ?? document.createElement('div');
    }

    success(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        Notifier.send(Status.SUCCESS, msg, raw, html);
    }

    debug(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        Notifier.send(Status.DEBUG, msg, raw, html);
    }

    info(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        Notifier.send(Status.INFO, msg, raw, html);
    }

    warn(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        Notifier.send(Status.WARN, msg, raw, html);
    }

    error(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        Notifier.send(Status.ERROR, msg, raw, html);
    }

    private static send(status: Status, msg: string | HTMLElement, raw?: Object, html?: HTMLElement): void {
        let eventInitDict: CustomEventInit<NotifyDetails> = undefined;
        if (raw !== undefined || html !== undefined) {
            eventInitDict = {detail: {raw: raw, html: html}};
        }
        Notifier.appRoot.dispatchEvent(new NotifyEvent(status, msg, eventInitDict));
    }
}

export default Notifier;