import { Inject, InjectionTarget } from "../decorators/decorators";
import { NotificationServiceInterface } from "../@types/types";

@InjectionTarget()
class RestServiceProvider implements ProviderInterface {

    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface
    ) {}

    public getInstance(constructor: ConstructorFunction<RestServiceInterface>): RestServiceInterface {
        let restService = new constructor();
        restService.init()
            .then(this.sendErrorOnFailure(restService.errorMessage))
            .catch(this.sendError(restService.errorMessage));
        return restService;
    }

    private sendErrorOnFailure(msg: string): (arr: string[]) => boolean {
        return (arr: string[]): boolean => {
            if (arr.length === 0) {
                return true;
            }
            return this.sendError(msg)(arr);
        };
    }

    private sendError(msg: string): (err: any) => boolean {
        return (err: any): boolean => {
            this.notifier.error(msg, err);
            return false;
        };
    }
}

export default RestServiceProvider;