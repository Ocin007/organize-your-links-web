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
    ],
})
export class OylAppModule {}