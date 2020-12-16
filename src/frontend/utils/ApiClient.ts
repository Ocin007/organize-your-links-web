import Notifier from "./Notifier";

class ApiClient {

    private static _instance: ApiClient;
    private static readonly baseApiUrl = '../api';
    private totalRequestCount: number = 0;
    private debugRequestCountLabel: HTMLElement;
    private notifier: Notifier;

    private constructor() {
        this.notifier = new Notifier();
    }

    //TODO: evtl kein singleton, ist eigentlich nicht nötig
    static get instance(): ApiClient {
        if (!this._instance) {
            this._instance = new ApiClient();
        }
        return this._instance;
    }

    get(route: string): Promise<any> {
        return this.request('GET', route);
    }

    put(route: string, data?: object): Promise<any> {
        return this.request('PUT', route, data);
    }

    post(route: string, data?: object): Promise<any> {
        return this.request('POST', route, data);
    }

    delete(route: string, data?: object): Promise<any> {
        return this.request('DELETE', route, data);
    }

    private request(method: 'GET' | 'PUT' | 'POST' | 'DELETE', route: string, data?: object): Promise<any> {

        //TODO: notifications wieder buggy (wieder normal, wenn alle geschlossen mit button)
        this.debugInitTotalRequestCount();
        this.debugIncRequestCount();
        this.notifier.debug(`ApiClient: Request ${method} ${route}`, data);

        return fetch(ApiClient.baseApiUrl + route, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data === undefined ? undefined : JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
                return res;
            }
            throw new Error(res.status + ' ' + res.statusText);
        }).then(res => {
            return res.json();
        }).then(res => {
            if (res.error !== undefined && Array.isArray(res.error)) {
                res.error.forEach((error: string) => {
                    this.notifier.debug('ApiClient Server: ' + error, res);
                });
            }
            this.notifier.debug(`ApiClient: Response for ${method} ${route} received.`, res);
            return res;
        }).catch(error => {
            this.notifier.debug('ApiClient ' + error.toString(), error);
            return error;
        });
    }

    private debugInitTotalRequestCount(): void {
        if (this.totalRequestCount !== 0) {
            return;
        }
        let label = document.createElement('oyl-label');
        label.setAttribute('label', 'Total amount of requests: {{val1}}');
        label.setAttribute('val1', '0');
        this.debugRequestCountLabel = label;
        this.notifier.debug(this.debugRequestCountLabel);
    }

    private debugIncRequestCount() {
        this.totalRequestCount++;
        this.debugRequestCountLabel.setAttribute('val1', this.totalRequestCount.toString());
    }
}

export default ApiClient;