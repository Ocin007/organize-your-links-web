import html from "./oyl-popup-frame.html";
import scss from "./oyl-popup-frame.scss";
import Component from "../../component";
import ControllerComponentInterface from "../../ControllerComponentInterface";
import OylPopupFrameController from "./OylPopupFrameController";

abstract class AbstractOylPopupFrame extends Component implements ControllerComponentInterface {

    private readonly _controller: OylPopupFrameController;

    get controller(): OylPopupFrameController {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylPopupFrameController(this);
    }
}

export default AbstractOylPopupFrame;