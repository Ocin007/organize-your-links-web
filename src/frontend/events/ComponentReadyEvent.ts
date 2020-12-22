import {Events} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

//TODO: rename to ComponentConnectedEvent
class ComponentReadyEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(Events.Ready, eventInitDict);
    }
}

export default ComponentReadyEvent;