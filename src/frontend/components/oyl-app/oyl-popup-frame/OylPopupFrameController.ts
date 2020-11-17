import ControllerInterface from "../../../interfaces/ControllerInterface";
import OylPopupFrame from "./oyl-popup-frame";

class OylPopupFrameController implements ControllerInterface {

    private readonly _component: OylPopupFrame;

    constructor(component: OylPopupFrame) {
        this._component = component;
    }
}

export default OylPopupFrameController;