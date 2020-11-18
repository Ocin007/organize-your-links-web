import html from "./oyl-notification.html";
import scss from "./oyl-notification.scss";
import Component from "../../component";
import ControllerComponentInterface from "../../ControllerComponentInterface";
import OylNotificationController from "./OylNotificationController";

abstract class AbstractOylNotification extends Component implements ControllerComponentInterface {

    private readonly _controller: OylNotificationController;

    get controller(): OylNotificationController {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylNotificationController(this);
    }
}

export default AbstractOylNotification;