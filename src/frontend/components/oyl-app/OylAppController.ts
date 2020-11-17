import ControllerInterface from '../ControllerInterface';
import OylApp from './oyl-app';

class OylAppController implements ControllerInterface {

    private readonly _component: OylApp;

    constructor(component: OylApp) {
        this._component = component;
    }
}

export default OylAppController;