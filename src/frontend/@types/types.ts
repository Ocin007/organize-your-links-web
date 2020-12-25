import { SettingKey, Status } from "./enums";

export type Settings = Map<SettingKey,any>;
export type NotifyObject = {
    date: Date;
    status: Status;
    msg: string | HTMLElement;
    detail: NotifyDetails | null;
};


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