import Observer from "./Observer";

interface Observable<T extends any[]> {
    subscribe<K>(observer: Observer<K>, watch?: T): void;
    unsubscribe<K>(observer: Observer<K>, watch?: T): void;
}

export default Observable;