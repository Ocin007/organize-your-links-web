declare type PageID = string;
declare interface DescriptorFuncWithFirstArg<T> extends PropertyDescriptor {
    value?: (component: T, ...args: any[]) => void
}
declare type NotifyDetails = {
    html?: HTMLElement,
    raw?: Object
};
declare type NotifySettings = {
    visible: boolean,
    autoClose: boolean,
    interval: number
};
declare type NotifyType = 'success' | 'debug' | 'info' | 'warn' | 'error';
declare type SettingKey =
    'startPage' |
    'initialDataId' |
    'animationSpeedSingle' |
    'animationSpeedMulti' |
    'minSizeOfPlaylist' |
    'colorBrightness' |
    'titleLanguage' |
    'episodeCount' |
    'notification_success_visible' |
    'notification_success_autoClose' |
    'notification_success_interval' |
    'notification_debug_visible' |
    'notification_debug_autoClose' |
    'notification_debug_interval' |
    'notification_info_visible' |
    'notification_info_autoClose' |
    'notification_info_interval' |
    'notification_warn_visible' |
    'notification_warn_autoClose' |
    'notification_warn_interval' |
    'notification_error_visible' |
    'notification_error_autoClose' |
    'notification_error_interval';
declare type Settings = Map<SettingKey,any>;