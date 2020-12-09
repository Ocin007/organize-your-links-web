import {Events} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class NotifyCardClickedEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(Events.NotifyClick, eventInitDict);
    }

}

export default NotifyCardClickedEvent;