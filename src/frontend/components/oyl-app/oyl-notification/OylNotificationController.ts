import AbstractController from "../../AbstractController";
import OylNotification from "./oyl-notification";

class OylNotificationController extends AbstractController {

    private readonly _component: OylNotification;

    constructor(component: OylNotification) {
        super();
        this._component = component;
    }
}

export default OylNotificationController;