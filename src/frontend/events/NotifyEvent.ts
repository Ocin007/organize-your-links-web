import {Events, Status} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";
import OylLabel from "../components/common/oyl-label/oyl-label";

class NotifyEvent<T = NotifyDetails> extends AbstractBubblingEvent<T> {

    readonly date: Date;
    readonly status: Status;
    readonly msg: string | OylLabel;

    constructor(status: Status, msg: string | OylLabel, eventInitDict?: CustomEventInit<T>) {
        super(Events.Notify, eventInitDict);
        this.date = new Date();
        this.status = status;
        this.msg = msg;
    }

}

export default NotifyEvent;