import { SettingKey, Status } from "./enums";

export type Settings = Map<SettingKey,any>;



export interface NotificationServiceInterface extends Observable<Status[]> {
    sendNotificationsToReceiver(): this;
    success(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    debug(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    info(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    warn(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    error(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
}
export interface SettingsServiceInterface extends RestServiceInterface, Observable<SettingKey[]> {
    getSettings(keyList?: SettingKey[]): Settings;
    get<T extends any>(key: SettingKey): T;
    setSettings(changed: Settings): Promise<string[]>;
}