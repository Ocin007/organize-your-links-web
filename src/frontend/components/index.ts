import OylApp from "./oyl-app/oyl-app";
import OylPageFrame from "./oyl-app/oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-app/oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-app/oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-app/oyl-notification/oyl-notification";
import OylNavBar from "./oyl-app/oyl-nav-bar/oyl-nav-bar";
import OylHeader from "./oyl-app/oyl-header/oyl-header";
import OylNavBarTab from "./oyl-app/oyl-nav-bar/oyl-nav-bar-tab/oyl-nav-bar-tab";
import OylLabel from "./common/oyl-label/oyl-label";
import OylNotifyCard from "./oyl-app/oyl-notification/oyl-notify-card/oyl-notify-card";
import OylDate from "./common/oyl-date/oyl-date";

const Components = [
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
];

for (let component of Components) {
    window.customElements.define(component.tagName, component);
}