import html from './oyl-notification.html';
import scss from './oyl-notification.scss';
import Component from '../../component';
import ControllerComponentInterface from "../../../interfaces/ControllerComponentInterface";
import ControllerInterface from "../../../interfaces/ControllerInterface";
import OylNotificationController from "./OylNotificationController";

class AbstractOylNotification extends Component implements ControllerComponentInterface {

    private readonly _controller: ControllerInterface;

    get controller(): ControllerInterface {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylNotificationController(this);
    }
}

export default AbstractOylNotification;