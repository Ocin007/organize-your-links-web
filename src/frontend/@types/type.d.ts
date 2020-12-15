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
declare type NotifySetting = 'visible' | 'autoClose' | 'interval';
declare type SettingKey =
    'startPage' |
    'initialDataId' |
    'animationSpeedSingle' |
    'animationSpeedMulti' |
    'minSizeOfPlaylist' |
    'colorBrightness' |
    'titleLanguage' |
    'episodeCount' |
    ['notification', NotifyType, NotifySetting];
declare type Settings = Map<SettingKey,any>;