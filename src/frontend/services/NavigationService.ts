import { Inject, InjectionTarget } from "../decorators/decorators";

@InjectionTarget()
class NavigationService implements NavigationServiceInterface {

    //TODO: anzahl serien in playlist über pageoptions

    private currentPageId: PageID;
    private currentPageOptions: PageOptions;

    constructor(
        @Inject('NotificationServiceInterface') private notifier: NotificationServiceInterface,
        @Inject('ObservableInterface') private observable: ObservableInterface
    ) {}

    subscribe(observer: ObserverFunction<PageOptions>, watch?: PageID[]): void {
        if (this.currentPageId !== undefined && (watch === undefined || watch.includes(this.currentPageId))) {
            observer(this.currentPageOptions);
        }
        this.observable.subscribe(observer, watch);
    }

    unsubscribe(observer: ObserverFunction<PageOptions>, watch?: PageID[]): void {
        this.observable.unsubscribe(observer, watch);
    }

    navigateTo(pageId: PageID, options?: {}): void {
        if (this.currentPageId !== pageId && this.currentPageId !== undefined) {
            this.closeCurrent();
        }
        this.openPage(pageId, options);
    }

    private closeCurrent() {
        this.currentPageOptions.active = false;
        this.notifier.debug(`NavigationService: close current active page (${this.currentPageId}).`, this.currentPageOptions);
        this.notifySubs(this.currentPageOptions);
    }

    private openPage(pageId: PageID, options: {} = {}) {
        let pageOptions: PageOptions = {
            ...options,
            pageId: pageId,
            active: true
        };
        this.notifier.debug(`NavigationService: open page ${pageId}.`, pageOptions);
        this.notifySubs(pageOptions);
        this.currentPageId = pageId;
        this.currentPageOptions = pageOptions;
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