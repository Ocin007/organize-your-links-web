import { Inject, InjectionTarget } from "../decorators/decorators";

@InjectionTarget()
class NavigationService implements NavigationServiceInterface {

    private currentActive: PageID;

    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface,
        @Inject('ObservableInterface') private observable: ObservableInterface
    ) {}

    subscribe(observer: ObserverFunction<PageOptions>, watch?: PageID[]): void {
        this.observable.subscribe(observer, watch);
    }

    unsubscribe(observer: ObserverFunction<PageOptions>, watch?: PageID[]): void {
        this.observable.unsubscribe(observer, watch);
    }

    navigateTo(pageId: PageID, options?: {}): void {
        if (this.currentActive !== pageId && this.currentActive !== undefined) {
            this.closeCurrent();
        }
        this.openPage(pageId, options);
    }

    private closeCurrent() {
        let pageOptions: PageOptions = {
            pageId: this.currentActive,
            active: false
        };
        this.notifier.debug(`NavigationService: close current active page (${this.currentActive}).`, pageOptions);
        this.notifySubs(pageOptions);
    }

    private openPage(pageId: PageID, options: {} = {}) {
        let pageOptions: PageOptions = {
            ...options,
            pageId: pageId,
            active: true
        };
        this.notifier.debug(`NavigationService: open page ${pageId}.`, pageOptions);
        this.notifySubs(pageOptions);
        this.currentActive = pageId;
    }

    private notifySubs(options: PageOptions): void {
        this.observable.notifySubs(subWatch => {
            if (subWatch === undefined || subWatch.includes(options.pageId)) {
                return options;
            }
        });
    }
}

export default NavigationService;