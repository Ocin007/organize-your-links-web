class Observable implements ObservableInterface {

    private subs: { observer: ObserverFunction<any>, watch?: WatchKey[] }[] = [];

    subscribe<K>(observer: ObserverFunction<K>, watch?: WatchKey[]): void {
        this.subs.push({observer: observer, watch: watch});
    }

    unsubscribe<K>(observer: ObserverFunction<K>, watch?: WatchKey[]): void {
        let index = this.subs.findIndex((value => value.observer === observer && this.arraysEqual(value.watch, watch)));
        if (index === -1) {
            return;
        }
        this.subs.splice(index, 1);
    }

    notifySubs<K>(getNewValue: (subWatch?: WatchKey[]) => K): void {
        this.subs.forEach((sub) => {
            let newValue: K = getNewValue(sub.watch);
            if (newValue !== undefined) {
                sub.observer(newValue);
            }
        });
    }

    hasSubs(): boolean {
        return this.subs.length !== 0;
    }

    private arraysEqual(arr1?: WatchKey[], arr2?: WatchKey[]): boolean {
        if (arr1 === undefined && arr2 === undefined) {
            return true;
        }
        if (arr1 === undefined || arr2 === undefined) {
            return false;
        }
        if (arr1.length !== arr2.length) {
            return false;
        }
        let equal: boolean = true;
        arr1.forEach(key => equal &&= arr2.includes(key));
        return equal;
    }
}

export default Observable;