import AbstractController from "../../AbstractController";
import ControllerInterface from "../../ControllerInterface";
import OylPageFrame from "./oyl-page-frame";

class OylPageFrameController extends AbstractController implements ControllerInterface {

    private readonly _component: OylPageFrame;

    constructor(component: OylPageFrame) {
        super();
        this._component = component;
    }
}

export default OylPageFrameController;