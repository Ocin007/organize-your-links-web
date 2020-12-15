import {Events, Status} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class NotifyEvent<T = NotifyDetails> extends AbstractBubblingEvent<T> {

    readonly date: Date;
    readonly status: Status;
    readonly msg: string | HTMLElement;

    constructor(status: Status, msg: string | HTMLElement, eventInitDict?: CustomEventInit<T>) {
        super(Events.Notify, eventInitDict);
        this.date = new Date();
        this.status = status;
        this.msg = msg;
    }

}

export default NotifyEvent;