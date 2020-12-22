import { SettingKey } from "../@types/enums";
import { NotificationServiceInterface, Settings, SettingsServiceInterface } from "../@types/types";
import { Inject, InjectionTarget } from "../decorators/decorators";

@InjectionTarget()
class SettingsService implements SettingsServiceInterface {

    private static INIT_SUCCESSFUL = 'SettingsService: initialisation successful.';
    private static INIT_FAILED = 'SettingsService: initialisation failed.';
    private static SAVE_SETTINGS_SUCCESSFUL = 'SettingsService: save settings successful.';
    private static SAVE_SETTINGS_FAILED = 'SettingsService: save settings failed.';
    private static READ_BEFORE_INIT = 'SettingsService: Tried to read settings before initialisation.';
    private static WRITE_BEFORE_INIT = 'SettingsService: Tried to write settings before initialisation.';
    private static OBSERVER_NOT_FOUND = 'SettingsService: Given observer is not subscribed to the given list of items.';
    private static LOAD_SETTINGS_ERROR = 'Settings konnten nicht geladen werden.';
    private static LOAD_SETTINGS_SUCCESS = 'Settings wurden erfolgreich geladen.';

    //TODO: neue route anlegen
    private static ROUTE = "/settings-v2";

    private settings: Settings = new Map<SettingKey, any>();
    private subs: { observer: Observer<any>, watch?: SettingKey[] }[] = [];
    private _isInitialised: boolean = false;

    private readonly _initSuccessful: Promise<void>;
    private initResolve: () => void;
    private initReject: (reason: string) => void;

    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface,
        @Inject('RestClientInterface') private api: RestClientInterface
    ) {
        this._initSuccessful = new Promise<void>((resolve, reject) => {
            this.initResolve = resolve;
            this.initReject = reject;
        });
    }

    get isInitialised(): boolean {
        return this._isInitialised;
    }

    async init(): Promise<string[]> {
        let result = await this.api.get(SettingsService.ROUTE);
        if (result instanceof Error) {
            this.notifier.debug(SettingsService.INIT_FAILED, result);
            this.initReject(SettingsService.INIT_FAILED);
            throw result;
        }
        if (result.error !== undefined) {
            this.notifier.debug(SettingsService.INIT_FAILED, result);
            this.initReject(SettingsService.INIT_FAILED);
            return result.error;
        }
        this.settings = this.objectToSettings(result.response);
        this._isInitialised = true;
        this.notifier.debug(SettingsService.INIT_SUCCESSFUL, result);
        this.initResolve();
        this.notifySubs(this.settings);
        return [];
    }

    //TODO: selbe rückgabe wie in init()
    get ifInitSuccessful(): Promise<void> {
        return this._initSuccessful;
    }

    get successMessage(): string {
        return SettingsService.LOAD_SETTINGS_SUCCESS;
    }

    get errorMessage(): string {
        return SettingsService.LOAD_SETTINGS_ERROR;
    }

    subscribe<K>(observer: Observer<K>, watch?: SettingKey[]): void {
        this.subs.push({observer: observer, watch: watch});
    }

    unsubscribe<K>(observer: Observer<K>, watch?: SettingKey[]): void {
        let index = this.subs.findIndex((value => value.observer === observer && this.settingKeysEqual(value.watch, watch)));
        if (index === -1) {
            this.notifier.debug(SettingsService.OBSERVER_NOT_FOUND, {observer: observer, watch: watch});
            return;
        }
        this.subs.splice(index, 1);
    }

    getSettings(keyList?: SettingKey[]): Settings {
        if (!this.isInitialised) {
            throw new Error(SettingsService.READ_BEFORE_INIT);
        }
        if (keyList === undefined) {
            return new Map<SettingKey, any>([...this.settings]);
        }
        let subSettings = new Map<SettingKey, any>();
        keyList.forEach(key => subSettings.set(key, this.settings.get(key)));
        return subSettings;
    }

    get<T extends any>(key: SettingKey): T {
        if (!this.isInitialised) {
            throw new Error(SettingsService.READ_BEFORE_INIT);
        }
        return this.settings.get(key);
    }

    async setSettings(changed: Settings): Promise<string[]> {
        if (!this.isInitialised) {
            throw new Error(SettingsService.WRITE_BEFORE_INIT);
        }
        let newSettings = new Map<SettingKey, any>([...this.settings, ...changed]);
        let data = this.settingsToObject(newSettings);
        let result = await this.api.put(SettingsService.ROUTE, data);
        if (result instanceof Error) {
            this.notifier.debug(SettingsService.SAVE_SETTINGS_FAILED, result);
            throw result;
        }
        if (result.error !== undefined) {
            this.notifier.debug(SettingsService.SAVE_SETTINGS_FAILED, result);
            return result.error;
        }
        this.settings = newSettings;
        this.notifier.debug(SettingsService.SAVE_SETTINGS_SUCCESSFUL, result);
        this.notifySubs(changed);
        return [];
    }

    private settingKeysEqual(arr1?: SettingKey[], arr2?: SettingKey[]): boolean {
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

    private notifySubs(newSettings: Settings): void {
        this.subs.forEach((sub) => {
            if (sub.watch === undefined) {
                sub.observer.update(new Map<SettingKey, any>([...this.settings]));
                return;
            }
            let hasAnyKey = false;
            sub.watch.forEach(key => hasAnyKey ||= newSettings.has(key));
            if (hasAnyKey) {
                sub.observer.update(this.getSettings(sub.watch));
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
}

export default SettingsService;