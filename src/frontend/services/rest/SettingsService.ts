import { SettingKey } from "../../@types/enums";
import { Settings, SettingsServiceInterface } from "../../@types/types";
import { Inject, InjectionTarget } from "../../decorators/decorators";

@InjectionTarget()
class SettingsService implements SettingsServiceInterface {

    private static INIT_SUCCESSFUL = 'SettingsService: initialisation successful.';
    private static INIT_FAILED = 'SettingsService: initialisation failed.';
    private static SAVE_SETTINGS_SUCCESSFUL = 'SettingsService: save settings successful.';
    private static SAVE_SETTINGS_FAILED = 'SettingsService: save settings failed.';
    private static READ_BEFORE_INIT = 'SettingsService: Tried to read settings before initialisation.';
    private static WRITE_BEFORE_INIT = 'SettingsService: Tried to write settings before initialisation.';
    private static LOAD_SETTINGS_ERROR = 'Settings konnten nicht geladen werden.';
    private static LOAD_SETTINGS_SUCCESS = 'Settings wurden erfolgreich geladen.';

    //TODO: neue route anlegen
    private static ROUTE = "/settings-v2";

    private settings: Settings = new Map<SettingKey, any>();
    private _isInitialised: boolean = false;

    private readonly _initSuccessful: Promise<string[]>;
    private initResolve: (errors: string[]) => void;
    private initReject: (error: Error) => void;

    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface,
        @Inject('RestClientInterface') private api: RestClientInterface,
        @Inject('ObservableInterface') private observable: ObservableInterface
    ) {
        this._initSuccessful = new Promise<string[]>((resolve, reject) => {
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
            this.initReject(result);
            throw result;
        }
        if (result.error !== undefined) {
            this.notifier.debug(SettingsService.INIT_FAILED, result);
            this.initResolve(result.error);
            return result.error;
        }
        this.settings = this.objectToSettings(result.response);
        this._isInitialised = true;
        this.notifier.debug(SettingsService.INIT_SUCCESSFUL, result);
        this.initResolve([]);
        this.notifySubs(this.settings);
        return [];
    }

    whenInitSuccessful(): Promise<string[]> {
        return this._initSuccessful;
    }

    get successMessage(): string {
        return SettingsService.LOAD_SETTINGS_SUCCESS;
    }

    get errorMessage(): string {
        return SettingsService.LOAD_SETTINGS_ERROR;
    }

    subscribe(observer: ObserverFunction<Settings>, watch?: SettingKey[]): void {
        this.observable.subscribe(observer, watch);
    }

    unsubscribe(observer: ObserverFunction<Settings>, watch?: SettingKey[]): void {
        this.observable.unsubscribe(observer, watch);
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

    private notifySubs(newSettings: Settings): void {
        this.observable.notifySubs(subWatch => {
            if (subWatch === undefined) {
                return new Map<SettingKey, any>([...this.settings]);
            }
            let hasAnyKey = false;
            subWatch.forEach(key => hasAnyKey ||= newSettings.has(key));
            if (hasAnyKey) {
                return this.getSettings(subWatch);
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