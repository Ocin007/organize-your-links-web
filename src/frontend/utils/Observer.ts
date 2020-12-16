interface Observer {
    update<T extends any>(newValue: T): void;
}

export default Observer;