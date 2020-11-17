import ControllerInterface from "../../../interfaces/ControllerInterface";
import OylNotification from "./oyl-notification";

class OylNotificationController implements ControllerInterface {

    private readonly _component: OylNotification;

    constructor(component: OylNotification) {
        this._component = component;
    }
}

export default OylNotificationController;