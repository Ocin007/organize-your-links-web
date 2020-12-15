interface Observer {
    update<T extends any>(newValue: T): void;
    complete(): void;
    error(): void;
}

export default Observer;