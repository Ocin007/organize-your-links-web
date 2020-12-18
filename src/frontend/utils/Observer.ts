interface Observer<T extends any> {
    update(newValue: T): void;
}

export default Observer;