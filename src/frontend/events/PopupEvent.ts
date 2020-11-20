import {Events} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class PopupEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(Events.Popup, eventInitDict);
    }

}

export default PopupEvent;