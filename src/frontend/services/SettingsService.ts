import AbstractService from "./AbstractService";
import Observable from "../utils/Observable";
import Observer from "../utils/Observer";
import ServiceInterface from "./ServiceInterface";
import { SettingKey } from "../@types/enums";
import { Settings } from "../@types/types";

class SettingsService extends AbstractService implements ServiceInterface, Observable<SettingKey[]> {

    static CANNOT_LOAD_SETTINGS = 'Settings konnten nicht geladen werden.';

    //TODO: neue route anlegen
    private static ROUTE = "/settings-v2";

    private static _instance: SettingsService;

    private settings: Settings = new Map<SettingKey, any>();
    private subs: { observer: Observer, watch?: SettingKey[] }[] = [];
    private _isInitialised: boolean = false;

    private constructor() {
        super();
    }

    static get instance(): SettingsService {
        if (!this._instance) {
            this._instance = new SettingsService();
        }
        return this._instance;
    }

    get isInitialised(): boolean {
        return this._isInitialised;
    }

    async init(): Promise<boolean> {
        let result = await this.api.get(SettingsService.ROUTE);
        if (result.error !== undefined || result.response === undefined) {
            this.notifier.error(SettingsService.CANNOT_LOAD_SETTINGS);
            return false;
        }
        this.settings = this.objectToSettings(result.response);
        this._isInitialised = true;
        this.notifier.debug('SettingsService: initialisation successful.', result);
        this.notifySubs(this.settings);
        return true;
    }

    subscribe(observer: Observer, watch?: SettingKey[]): void {
        let newEntity: { observer: Observer, watch?: SettingKey[] } = {observer: observer};

        //TODO: braucht man das?
        if (watch !== undefined) {
            newEntity.watch = watch;
        }
        if (this.isInitialised) {
            observer.update(this.getSettings(watch));
        }
        this.subs.push(newEntity);
    }

    unsubscribe(observer: Observer, watch?: SettingKey[]): void {
        let index = this.subs.findIndex((value => value.observer === observer && value.watch === watch));
        if (index === -1) {
            this.sendDebugCannotFindObserver(observer, watch);
            return;
        }
        this.subs.splice(index);
    }

    getSettings(keyList?: SettingKey[]): Settings {
        if (!this.isInitialised) {
            throw new Error('SettingsService: Tried to read settings before initialisation.');
        }
        if (keyList === undefined) {
            //TODO: testen, ob ich setSettings umgehen kann mit der referenz
            return this.settings;
        }
        let subSettings = new Map<SettingKey, any>();
        keyList.forEach((key => {
            //TODO: this.settings.get(key) = undefined für array keys
            subSettings.set(key, this.settings.get(key));
        }));
        return subSettings;
    }

    private notifySubs(newSettings: Settings): void {
        this.subs.forEach((sub) => {
            if (sub.watch === undefined) {
                sub.observer.update<Settings>(this.settings);
                return;
            }
            let hasAnyKey = false;
            sub.watch.forEach(key => hasAnyKey = hasAnyKey || newSettings.has(key));
            if (hasAnyKey) {
                sub.observer.update<Settings>(this.getSettings(sub.watch));
            }
        });
    }

    private settingsToObject(settings: Settings): object {
        let object = {};
        settings.forEach((value, key) => {
            let keyFragments = key.split('_');
            if (keyFragments.length > 1) {
                object = this.setNestedValue(keyFragments, value, object);
            } else {
                object[key] = value;
            }
        });
        return object;
    }

    private objectToSettings(object: object, previousKeys: string[] = [], settings: Settings = new Map<SettingKey, any>()): Settings {
        for (let key in object) {
            if (!object.hasOwnProperty(key)) {
                continue;
            }
            if (typeof object[key] === "object") {
                settings = this.objectToSettings(object[key], previousKeys.concat(key), settings);
            } else {
                let settingKey: SettingKey;
                if (previousKeys.length === 0) {
                    settingKey = SettingsService.strToSettingKey(key);
                } else {
                    settingKey = SettingsService.strToSettingKey(previousKeys.concat(key).join('_'));
                }
                settings.set(settingKey, object[key]);
            }
        }
        return settings;
    }

    private static strToSettingKey(key: any): SettingKey {
        return key;
    }

    private setNestedValue(keyList: string[], value: any, object: object = {}): object {
        let key = keyList.shift();
        if (keyList.length === 0) {
            object[key] = value;
            return object;
        }
        object[key] = this.setNestedValue(keyList, value, object[key]);
        return object;
    }

    async setSettings(changed: Settings): Promise<boolean> {
        //TODO: async mit Promise? welcher typ
        // check isInitialised?
        debugger;
        let newSettings = new Map<SettingKey, any>([...this.settings, ...changed]);
        let data = this.settingsToObject(newSettings);
        // let response = await this.api.put(SettingsService.ROUTE, data);
        return true;
    }

    //TODO: implement SettingsService
    // observable pattern
    get startPage(): PageID {
        return 's'
    }

    set startPage(pageId: PageID) {

    }

    private sendDebugCannotFindObserver(observer: Observer, watch?: SettingKey[]) {
        //TODO: alle messages in konstanten
        this.notifier.debug('SettingsService: Given observer is not subscribed to the given list of items.', {
            observer: observer, watch: watch
        });
    }
}

export default SettingsService;