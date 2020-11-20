import {Events} from "../@types/enums";

abstract class AbstractBubblingEvent<T = any> extends CustomEvent<T> {

    protected constructor(eventType: Events, eventInitDict?: CustomEventInit<T>) {
        if (eventInitDict === undefined) {
            eventInitDict = {bubbles: true, composed: true};
        } else {
            eventInitDict.bubbles = eventInitDict.bubbles === undefined ? true : eventInitDict.bubbles;
            eventInitDict.composed = eventInitDict.composed === undefined ? true : eventInitDict.composed;
        }
        super(eventType, eventInitDict);
    }
}

export default AbstractBubblingEvent;