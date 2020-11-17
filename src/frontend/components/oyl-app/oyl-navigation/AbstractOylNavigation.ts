import html from './oyl-navigation.html';
import scss from './oyl-navigation.scss';
import Component from '../../component';
import ControllerComponentInterface from "../../../interfaces/ControllerComponentInterface";
import ControllerInterface from "../../../interfaces/ControllerInterface";
import OylNavigationController from "./OylNavigationController";

class AbstractOylNavigation extends Component implements ControllerComponentInterface {

    private readonly _controller: ControllerInterface;

    get controller(): ControllerInterface {
        return this._controller;
    }

    constructor() {
        super(html, scss);
        this._controller = new OylNavigationController(this);
    }
}

export default AbstractOylNavigation;