import {EventType} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class PopupEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(EventType.Popup, eventInitDict);
    }

}

export default PopupEvent;