import { Events } from "../@types/enums";
import AbstractBubblingEvent from "./AbstractBubblingEvent";

class ComponentDisconnectedEvent<T = any> extends AbstractBubblingEvent<T> {

    constructor(eventInitDict?: CustomEventInit<T>) {
        super(Events.Disconnected, eventInitDict);
    }
}

export default ComponentDisconnectedEvent;