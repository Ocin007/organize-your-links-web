import html from "./oyl-popup-frame.html";
import scss from "./oyl-popup-frame.scss";
import Component from "../../component";
import ControllerComponentInterface from "../../ControllerComponentInterface";
import ControllerInterface from "../../ControllerInterface";
import OylPopupFrameController from "./OylPopupFrameController";

class AbstractOylPopupFrame extends Component implements ControllerComponentInterface {

    private readonly _controller: ControllerInterface;

    get controller(): ControllerInterface {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylPopupFrameController(this);
    }
}

export default AbstractOylPopupFrame;