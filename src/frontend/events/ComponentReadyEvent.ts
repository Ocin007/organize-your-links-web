import {Events} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class ComponentReadyEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(Events.ComponentReady, eventInitDict);
    }
}

export default ComponentReadyEvent;