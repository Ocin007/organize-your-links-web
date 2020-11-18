import html from "./oyl-nav-bar.html";
import scss from "./oyl-nav-bar.scss";
import Component from "../../component";
import ControllerComponentInterface from "../../ControllerComponentInterface";
import OylNavBarController from "./OylNavBarController";

abstract class AbstractOylNavBar extends Component implements ControllerComponentInterface {

    private readonly _controller: OylNavBarController;

    get controller(): OylNavBarController {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylNavBarController(this);
    }
}

export default AbstractOylNavBar;