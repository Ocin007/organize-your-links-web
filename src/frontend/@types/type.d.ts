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
declare type PopupConfig = {
    width?: PopupSize,
    height?: PopupSize,
    title?: {text: string, style?: string},
    description?: {text: string, style?: string} | HTMLElement,
    buttons?: {
        text: string,
        id: ButtonName,
        type: ButtonType
    }[]
};
declare type ButtonName = string;
declare type ButtonType = 'info' | 'abort' | 'confirm' | 'neutral';
declare type PopupSize = 'small' | 'big';
declare type PopupObject = {
    config: PopupConfig,
    buttonClicked: (id: ButtonName) => void,
    aborted: () => void
};
declare type Series = {
    id: SeriesID,
    api: {
        name: Translation,
        overview: Translation,
        seriesId: string,
        lastUpdated: number,
        firstAired: string,
        poster: string,//als fallback, wenn sonst kein thumbnail da ist
        tags: string[],//tag ids, mapping von id auf name
        status: SeriesStatus,
        aliases: string[],
    },
    apiHasChanges: boolean,//ist auch true wenn eine episode changes hat
    customTags: string[],
    created: number,
    lastUpdated: number,
    name: Translation,
    playlists: PlaylistID[],
    rank: Rank,
    favorite: boolean,
    seasons: Season[],
    movies: EpisodeGroup[],
    others: EpisodeGroup[]
};
declare type Season = {
    favorite: boolean,
    lastUpdated: number,
    api: {
        airedSeasonID: string,//wird wohl nicht benutzt, brauch ich das? lieber bei episode speichern?
    },
    groups: EpisodeGroup[]
};
declare type EpisodeGroup = {
    thumbnail: string,
    api: {
        thumbnail: string,
    },
    url: string,
    name: Translation,//alternativer name (season 4 teil 1 / teil 2)
    lastUpdated: number,
    episodes: Episode[]
}
declare type Episode = {
    api: {
        name: Translation,
        overview: Translation,
        episodeId: string,
        lastUpdated: number,
        firstAired: string,
        thumbnail: string,
        season: number,
        episode: number,
        isMovie: boolean,
    },
    apiHasChanges: boolean,
    lastChecked: number,
    name: Translation,
    lastUpdated: number,
    url: string,
    favorite: boolean,
    watched: boolean,
    firstWatched: number,
};
declare type Translation = {
    de: string,
    en: string,
    jpn: string
}
declare type Language = 'de' | 'en' | 'jpn';
declare type Rank = 's' | 'a' | 'b' | 'c' | 'd' | '?';
declare type SeriesStatus = 'tba' | 'ongoing' | 'ended';
declare type SeriesID = string;
declare type PlaylistID = string;
declare type GroupedSeriesList = {
    [firstChar: string]: Series[];
};
declare type SeriesList = {
    [seriesId: string]: {
        firstChar: string,
        series: Series
    }
};



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
    readonly successMessage: string;
    readonly errorMessage: string;
    readonly isInitialised: boolean;
    whenInitSuccessful(): Promise<string[]>;
    init(): Promise<string[]>;
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
declare interface PopupServiceInterface {
    push(config: PopupConfig): Promise<ButtonName>;
    pop(): Promise<PopupObject>;
    hasPopups(): boolean;
}
declare interface NotificationServiceInterface extends IsObservable {
    sendNotificationsToReceiver(): this;
    success(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    debug(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    info(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    warn(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    error(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
}
declare interface NavigationServiceInterface extends IsObservable {
    navigateTo(pageId: PageID, options?: {}): void;
}
declare interface PageInterface {
    readonly pageId: PageID;
    readonly label: string;
    readonly component: HTMLElement;
    update(options: PageOptions): void;
}
declare interface PageServiceInterface {
    getAll(): PageInterface[];
    get(pageId: PageID): PageInterface;
}
declare interface PageOptions {
    pageId: PageID;
    active: boolean;
    [key: string]: any;
}
declare interface SeriesPageOptions extends PageOptions {
    seriesId: SeriesID;
}
declare interface SeriesServiceInterface extends RestServiceInterface, IsObservable {
    get(seriesId: SeriesID): Series;
    getList(idList?: SeriesID[]): SeriesList;
    getGroupedList(idList?: SeriesID[]): GroupedSeriesList;
    create(series: Series): Promise<string[]>;
    update(changed: Series[]): Promise<string[]>;
    delete(seriesId: SeriesID): Promise<string[]>;
}