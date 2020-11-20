import {EventType, Status} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class NotifyEvent<T = any> extends AbstractBubblingEvent<T> {

    private status: Status;
    private msg: string;

    constructor(status: Status, msg: string, eventInitDict?: CustomEventInit<T>) {
        super(EventType.Notify, eventInitDict);
        this.status = status;
        this.msg = msg;
    }

}

export default NotifyEvent;