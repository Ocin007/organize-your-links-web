import html from "./oyl-app.html";
import scss from "./oyl-app.scss";
import Component from "../component";
import ControllerComponentInterface from "../ControllerComponentInterface";
import ControllerInterface from "../ControllerInterface";
import OylAppController from "./OylAppController";
import OylNavigation from "./oyl-navigation/oyl-navigation";
import OylPageFrame from "./oyl-page-frame/oyl-page-frame";
import OylSlidePage from "./oyl-slide-page/oyl-slide-page";
import OylPopupFrame from "./oyl-popup-frame/oyl-popup-frame";
import OylNotification from "./oyl-notification/oyl-notification";

abstract class AbstractOylApp extends Component implements ControllerComponentInterface {

    private readonly _controller: ControllerInterface;

    protected navigation: OylNavigation;
    protected pageFrame: OylPageFrame;
    protected slidePage: OylSlidePage;
    protected popupFrame: OylPopupFrame;
    protected notification: OylNotification;

    get controller(): ControllerInterface {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylAppController(this);
    }
}

export default AbstractOylApp;