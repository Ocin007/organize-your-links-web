import { SettingKey, Status } from "./enums";

export type Settings = Map<SettingKey,any>;
export type NotifyObject = {
    date: Date;
    status: Status;
    msg: string | HTMLElement;
    detail: NotifyDetails | null;
};


export interface SettingsServiceInterface extends RestServiceInterface, IsObservable {
    getSettings(keyList?: SettingKey[]): Settings;
    get<T extends any>(key: SettingKey): T;
    setSettings(changed: Settings): Promise<string[]>;
}