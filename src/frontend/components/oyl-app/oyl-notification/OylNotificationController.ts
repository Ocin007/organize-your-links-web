import AbstractController from "../../AbstractController";
import ControllerInterface from "../../ControllerInterface";
import OylNotification from "./oyl-notification";

class OylNotificationController extends AbstractController implements ControllerInterface {

    private readonly _component: OylNotification;

    constructor(component: OylNotification) {
        super();
        this._component = component;
    }
}

export default OylNotificationController;