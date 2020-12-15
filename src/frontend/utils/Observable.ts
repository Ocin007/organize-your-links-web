import Observer from "./Observer";

interface Observable<T extends any[]> {
    subscribe(observer: Observer, watch?: T): void;
    unsubscribe(observer: Observer, watch?: T): void;
}

export default Observable;