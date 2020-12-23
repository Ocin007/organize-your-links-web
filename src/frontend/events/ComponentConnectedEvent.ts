import {Events} from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class ComponentConnectedEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(Events.Connected, eventInitDict);
    }
}

export default ComponentConnectedEvent;