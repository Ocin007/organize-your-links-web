import ControllerInterface from '../../ControllerInterface';
import OylSlidePage from './oyl-slide-page';

class OylSlidePageController implements ControllerInterface {

    private readonly _component: OylSlidePage;

    constructor(component: OylSlidePage) {
        this._component = component;
    }
}

export default OylSlidePageController;