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
    ],
    dependencies: [
        //TODO: option multi=true -> es werden immer neue instanzen angelegt
        // hier als allgemeine option, oder jeweils in @Inject()?
        {injectable: Notifier, alias: 'NotificationServiceInterface'},
        {injectable: ApiClient, alias: 'RestClientInterface'},
        {injectable: SettingsService, provider: RestServiceProvider, alias: 'SettingsServiceInterface'}
    ],
})
export class OylAppModule {}