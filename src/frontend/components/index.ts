import OylApp from "./oyl-app/oyl-app";
import OylNavigation from "./oyl-app/oyl-navigation/oyl-navigation";
import OylPageFrame from "./oyl-app/oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-app/oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-app/oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-app/oyl-notification/oyl-notification";

const Components = [
    OylApp,
    OylNavigation,
    OylPageFrame,
    OylSlidePage,
    OylPopupFrame,
    OylNotification,
];

for (let component of Components) {
    window.customElements.define(component.tagName, component);
}