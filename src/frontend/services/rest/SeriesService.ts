import { Inject, InjectionTarget } from "../../decorators/decorators";
import AbstractRestService from "./AbstractRestService";
import { SettingsServiceInterface } from "../../@types/types";
import { SettingKey } from "../../@types/enums";

@InjectionTarget()
class SeriesService extends AbstractRestService implements SeriesServiceInterface {

    private static LOAD_SERIES_ERROR = 'Serien konnten nicht geladen werden.';
    private static LOAD_SERIES_SUCCESS = 'Serien wurden erfolgreich geladen.';
    private static READ_BEFORE_INIT = 'SeriesService: Tried to read series before initialisation.';
    private static INIT_SUCCESSFUL = 'SeriesService: initialisation successful.';
    private static INIT_FAILED = 'SeriesService: initialisation failed.';
    private static SAVE_SERIES_SUCCESSFUL = 'SeriesService: save series successful.';
    private static SAVE_SERIES_FAILED = 'SeriesService: save series failed.';
    private static UPDATE_BEFORE_INIT = 'SeriesService: Tried to update series before initialisation.';
    private static CREATE_BEFORE_INIT = 'SeriesService: Tried to create series before initialisation.';
    private static DELETE_BEFORE_INIT = 'SeriesService: Tried to delete series before initialisation.';

    private static ROUTE_ALL_SERIES = '/series/all';
    private static ROUTE_UPDATE_SERIES = '/series/update';

    private seriesList: SeriesList = {};
    private titleLang: Language;
    private langPrio: Language[] = ['de', 'en', 'jpn'];

    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface,
        @Inject('RestClientInterface') private api: RestClientInterface,
        @Inject('ObservableInterface') private observable: ObservableInterface,
        @Inject('SettingsServiceInterface') private settings: SettingsServiceInterface
    ) {
        super();
        this.settings.subscribe(setting => {
            this.titleLang = setting.get(SettingKey.TITLE_LANGUAGE);
        }, [SettingKey.TITLE_LANGUAGE]);
        if (this.settings.isInitialised) {
            this.titleLang = this.settings.get(SettingKey.TITLE_LANGUAGE);
        }
    }

    get successMessage(): string {
        return SeriesService.LOAD_SERIES_SUCCESS;
    }

    get errorMessage(): string {
        return SeriesService.LOAD_SERIES_ERROR;
    }

    subscribe(observer: ObserverFunction<SeriesList>, watch?: SeriesID[]): void {
        this.observable.subscribe(observer, watch);
    }

    unsubscribe(observer: ObserverFunction<SeriesList>, watch?: SeriesID[]): void {
        this.observable.unsubscribe(observer, watch);
    }

    async init(): Promise<string[]> {
        let result = await this.api.get(SeriesService.ROUTE_ALL_SERIES);
        if (result instanceof Error) {
            this.notifier.debug(SeriesService.INIT_FAILED, result);
            this.initReject(result);
            throw result;
        }
        if (result.error !== undefined) {
            this.notifier.debug(SeriesService.INIT_FAILED, result);
            this.initResolve(result.error);
            return result.error;
        }
        let idList: SeriesID[] = [];
        result.response.forEach((data: any) => {
            this.seriesList[data.id] = {
                series: data,
                firstChar: this.getFirstChar(data)
            };
            idList.push(data.id);
        });
        this._isInitialised = true;
        this.notifier.debug(SeriesService.INIT_SUCCESSFUL, result);
        this.initResolve([]);
        this.notifySubs(idList);
        return [];
    }

    get(seriesId: SeriesID): Series {
        if (!this.isInitialised) {
            throw new Error(SeriesService.READ_BEFORE_INIT);
        }
        return this.seriesList[seriesId].series;
    }

    getList(idList?: SeriesID[]): SeriesList {
        if (!this.isInitialised) {
            throw new Error(SeriesService.READ_BEFORE_INIT);
        }
        if (idList === undefined) {
            return this.deepCopy(this.seriesList);
        }
        let list: SeriesList = {};
        for (let seriesId in this.seriesList) {
            if (this.seriesList.hasOwnProperty(seriesId) && idList.includes(seriesId)) {
                list[seriesId] = this.deepCopy(this.seriesList[seriesId]);
            }
        }
        return list;
    }

    //TODO: decorator for RestServiceInterface classes: throw error if not isInitialised
    getGroupedList(idList?: SeriesID[]): GroupedSeriesList {
        if (!this.isInitialised) {
            throw new Error(SeriesService.READ_BEFORE_INIT);
        }
        let groupedList: GroupedSeriesList = {};
        let list = this.getList(idList);
        for (let seriesId in list) {
            if (list.hasOwnProperty(seriesId)) {
                if (groupedList[list[seriesId].firstChar] === undefined) {
                    groupedList[list[seriesId].firstChar] = [];
                }
                groupedList[list[seriesId].firstChar].push(list[seriesId].series);
            }
        }
        return groupedList;
    }

    //TODO: test
    //TODO: route anpassen + umbenennen
    async create(series: Series): Promise<string[]> {
        if (!this.isInitialised) {
            throw new Error(SeriesService.CREATE_BEFORE_INIT);
        }
        return ['SeriesService: method not implemented yet.'];
    }

    //TODO: test
    //TODO: route anpassen + umbenennen
    async update(changed: Series[]): Promise<string[]> {
        if (!this.isInitialised) {
            throw new Error(SeriesService.UPDATE_BEFORE_INIT);
        }
        let result = await this.api.put(SeriesService.ROUTE_UPDATE_SERIES, {seriesList: changed});
        if (result instanceof Error) {
            this.notifier.debug(SeriesService.SAVE_SERIES_FAILED, result);
            throw result;
        }
        if (result.error !== undefined) {
            this.notifier.debug(SeriesService.SAVE_SERIES_FAILED, result);
            return result.error;
        }
        let idList: SeriesID[] = [];
        changed.forEach(series => {
            this.seriesList[series.id].series = this.deepCopy(series);
            this.seriesList[series.id].firstChar = this.getFirstChar(series);
            idList.push(series.id);
        });
        this.notifier.debug(SeriesService.SAVE_SERIES_SUCCESSFUL, result);
        this.notifySubs(idList);
        return [];
    }

    //TODO: test
    //TODO: route anpassen + umbenennen
    async delete(seriesId: SeriesID): Promise<string[]> {
        if (!this.isInitialised) {
            throw new Error(SeriesService.DELETE_BEFORE_INIT);
        }
        return ['SeriesService: method not implemented yet.'];
    }

    private notifySubs(changedSeries: SeriesID[]): void {
        this.observable.notifySubs(subWatch => {
            if (subWatch === undefined) {
                return this.getList();
            }
            let hasAnyKey = false;
            subWatch.forEach(key => hasAnyKey ||= changedSeries.includes(key));
            if (hasAnyKey) {
                return this.getList(subWatch);
            }
        });
    }

    private deepCopy(object: any): any {
        let copy = {};
        for (let key in object) {
            //TODO: mit arrays testen
            if (object.hasOwnProperty(key) && typeof object[key] === 'object') {
                copy[key] = this.deepCopy(object[key]);
            } else {
                copy[key] = object[key];
            }
        }
        return copy;
    }

    private getFirstChar(series: Series): string {
        let name: string = '';
        if (this.titleLang !== undefined) {
            name = series.name[this.titleLang] !== '' ? series.name[this.titleLang] : series.api.name[this.titleLang];
        }
        if (name === '') {
            for (let i = 0; i < this.langPrio.length; i++) {
                name = series.name[this.langPrio[i]] !== '' ? series.name[this.langPrio[i]] : series.api.name[this.langPrio[i]];
                if (name !== '') {
                    break;
                }
            }
        }
        return name.charAt(0).toUpperCase();
    }
}

export default SeriesService;