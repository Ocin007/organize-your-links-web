import { OylModule } from "../../decorators/decorators";
import OylApp from "./oyl-app";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylHeader from "./oyl-header/oyl-header";
import OylNavBarTab from "./oyl-nav-bar/oyl-nav-bar-tab/oyl-nav-bar-tab";
import OylLabel from "../common/oyl-label/oyl-label";
import OylNotifyCard from "./oyl-notification/oyl-notify-card/oyl-notify-card";
import OylDate from "../common/oyl-date/oyl-date";
import Notifier from "../../services/Notifier";
import ApiClient from "../../utils/ApiClient";
import SettingsService from "../../services/rest/SettingsService";
import RestServiceProvider from "../../providers/RestServiceProvider";
import Observable from "../../utils/Observable";
import OylOpacityLayer from "../common/oyl-opacity-layer/oyl-opacity-layer";
import PopupService from "../../services/PopupService";
import OylNotifyDetails from "./oyl-notification/oyl-notify-card/oyl-notify-details/oyl-notify-details";
import OylJson from "../common/oyl-json/oyl-json";
import NavigationService from "../../services/NavigationService";
import EditSeriesPage from "../pages/edit/series/EditSeriesPage";
import PageService from "../../services/PageService";
import OylEditSeriesPage from "../pages/edit/series/oyl-edit-series-page/oyl-edit-series-page";
import SeriesService from "../../services/rest/SeriesService";

@OylModule({
    declarations: [
        OylApp,
        OylPageFrame,
        OylSlidePage,
        OylPopupFrame,
        OylNotification,
        OylNavBar,
        OylHeader,
        OylNavBarTab,
        OylLabel,
        OylNotifyCard,
        OylDate,
        OylOpacityLayer,
        OylNotifyDetails,
        OylJson,
        OylEditSeriesPage,
    ],
    dependencies: [
        {injectable: Observable, alias: 'ObservableInterface', multi: true},
        {injectable: Notifier, alias: 'NotificationServiceInterface'},
        {injectable: ApiClient, alias: 'RestClientInterface'},
        {injectable: PopupService, alias: 'PopupServiceInterface'},
        {injectable: NavigationService, alias: 'NavigationServiceInterface'},
        {injectable: SettingsService, provider: RestServiceProvider, alias: 'SettingsServiceInterface'},
        {injectable: SeriesService, provider: RestServiceProvider, alias: 'SeriesServiceInterface'},

        {injectable: EditSeriesPage},
        {injectable: PageService, alias: 'PageServiceInterface'}
    ],
})
export class OylAppModule {}