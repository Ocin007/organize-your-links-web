import { SettingKey } from "./enums";

export type Settings = Map<SettingKey,any>;



export interface NotificationServiceInterface extends IsObservable {
    sendNotificationsToReceiver(): this;
    success(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    debug(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    info(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    warn(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
    error(msg: string | HTMLElement, raw?: Object, html?: HTMLElement): this;
}
export interface SettingsServiceInterface extends RestServiceInterface, IsObservable {
    getSettings(keyList?: SettingKey[]): Settings;
    get<T extends any>(key: SettingKey): T;
    setSettings(changed: Settings): Promise<string[]>;
}