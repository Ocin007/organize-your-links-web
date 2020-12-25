export enum Events {
    Nav = 'navEvent',
    Popup = 'popupEvent',
    Connected = 'connectedEvent',
    Disconnected = 'disconnectedEvent',
    NotifyClick = 'notifyClickEvent'
}
export enum Status {
    SUCCESS = 'success',
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}
export enum SettingKey {
    START_PAGE = 'startPage',
    DETAILS_DEFAULT_SERIES_ID = 'initialDataId',
    animationSpeedSingle = 'animationSpeedSingle',
    animationSpeedMulti = 'animationSpeedMulti',
    minSizeOfPlaylist = 'minSizeOfPlaylist',
    colorBrightness = 'colorBrightness',
    TITLE_LANGUAGE = 'titleLanguage',
    episodeCount = 'episodeCount',
    NOTIFY_SUCCESS_VISIBLE = 'notification_success_visible',
    NOTIFY_SUCCESS_AUTO_CLOSE = 'notification_success_autoClose',
    NOTIFY_SUCCESS_INTERVAL = 'notification_success_interval',
    NOTIFY_DEBUG_VISIBLE = 'notification_debug_visible',
    NOTIFY_DEBUG_AUTO_CLOSE = 'notification_debug_autoClose',
    NOTIFY_DEBUG_INTERVAL = 'notification_debug_interval',
    NOTIFY_INFO_VISIBLE = 'notification_info_visible',
    NOTIFY_INFO_AUTO_CLOSE = 'notification_info_autoClose',
    NOTIFY_INFO_INTERVAL = 'notification_info_interval',
    NOTIFY_WARN_VISIBLE = 'notification_warn_visible',
    NOTIFY_WARN_AUTO_CLOSE = 'notification_warn_autoClose',
    NOTIFY_WARN_INTERVAL = 'notification_warn_interval',
    NOTIFY_ERROR_VISIBLE = 'notification_error_visible',
    NOTIFY_ERROR_AUTO_CLOSE = 'notification_error_autoClose',
    NOTIFY_ERROR_INTERVAL = 'notification_error_interval',
}