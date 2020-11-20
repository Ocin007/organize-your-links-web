import {EventType} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class ComponentReadyEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(EventType.ComponentReady, eventInitDict);
    }
}

export default ComponentReadyEvent;