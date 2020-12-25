declare type PageID = string;
declare type NotifyDetails = {
    html?: HTMLElement,
    raw?: Object
};
declare type NotifyConfig = {
    visible: boolean,
    autoClose: boolean,
    interval: number
};
declare type NotifyType = 'success' | 'debug' | 'info' | 'warn' | 'error';
declare type Injectable = {
    constructor: ConstructorFunction,
    multi: boolean,
    instance?: Object,
    provider?: ProviderInterface
};
declare type DependencyMap = Map<string, string[]>;
declare type InjectableMap = Map<string, Injectable>;
declare type Dependency = {
    injectable: ConstructorFunction,
    provider?: ConstructorFunction<ProviderInterface>,
    alias?: string,
    multi?: boolean,
};
declare type ObserverFunction<T> = (newValue: T) => void;
declare type WatchKey = any;



declare interface DescriptorFuncWithFirstArg<T> extends PropertyDescriptor {
    value?: (component: T, ...args: any[]) => void
}
declare interface ConstructorFunction<T = Object> extends Function {
    new (...args: any[]): T
}
declare interface ComponentConstructor extends ConstructorFunction<HTMLElement> {
    tagName: string;
}
declare interface RestServiceInterface {
    isInitialised: boolean;
    whenInitSuccessful(): Promise<string[]>;
    init(): Promise<string[]>;
    readonly successMessage: string;
    readonly errorMessage: string;
}
declare interface ObservableInterface {
    subscribe<K>(observer: ObserverFunction<K>, watch?: WatchKey[]): void;
    unsubscribe<K>(observer: ObserverFunction<K>, watch?: WatchKey[]): void;
    notifySubs<K>(getNewValue: (subWatch?: WatchKey[]) => K): void;
    hasSubs(): boolean;
}
declare interface IsObservable {
    subscribe(observer: ObserverFunction<any>, watch?: WatchKey[]): void;
    unsubscribe(observer: ObserverFunction<any>, watch?: WatchKey[]): void;
}
declare interface ProviderInterface {
    getInstance(constructor: ConstructorFunction): Object;
}
declare interface RestClientInterface {
    get(route: string): Promise<any>;
    put(route: string, data?: object): Promise<any>;
    post(route: string, data?: object): Promise<any>;
    delete(route: string, data?: object): Promise<any>;
}