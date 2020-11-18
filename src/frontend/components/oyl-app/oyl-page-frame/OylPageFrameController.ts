import AbstractController from "../../AbstractController";
import OylPageFrame from "./oyl-page-frame";

class OylPageFrameController extends AbstractController {

    private readonly _component: OylPageFrame;

    constructor(component: OylPageFrame) {
        super();
        this._component = component;
    }
}

export default OylPageFrameController;