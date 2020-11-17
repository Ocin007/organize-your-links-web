import ControllerInterface from "../../../interfaces/ControllerInterface";
import OylPageFrame from "./oyl-page-frame";

class OylPageFrameController implements ControllerInterface {

    private readonly _component: OylPageFrame;

    constructor(component: OylPageFrame) {
        this._component = component;
    }
}

export default OylPageFrameController;