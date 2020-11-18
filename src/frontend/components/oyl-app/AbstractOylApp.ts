import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import Component from "../component";
import ControllerComponentInterface from "../ControllerComponentInterface";
import OylAppController from "./OylAppController";
import OylNavBar from "./oyl-nav-bar/oyl-nav-bar";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";

abstract class AbstractOylApp extends Component implements ControllerComponentInterface {

    private readonly _controller: OylAppController;

    protected navBar: OylNavBar;
    protected pageFrame: OylPageFrame;
    protected slidePage: OylSlidePage;
    protected popupFrame: OylPopupFrame;
    protected notification: OylNotification;

    get controller(): OylAppController {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylAppController(this);

        // this._controller.registerToEvent(EventType.Nav, this.navBar.controller);
        // this._controller.registerToEvent(EventType.Nav, this.pageFrame.controller);
        // this._controller.registerToEvent(EventType.Nav, this.slidePage.controller);
        //
        // this._controller.registerToEvent(EventType.Popup, this.popupFrame.controller);
        //
        // this._controller.registerToEvent(EventType.Notify, this.notification.controller);
    }
}

export default AbstractOylApp;