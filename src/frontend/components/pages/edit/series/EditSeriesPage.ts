import OylEditSeriesPage from "./oyl-edit-series-page/oyl-edit-series-page";

class EditSeriesPage implements PageInterface {

    private _component: OylEditSeriesPage;

    get pageId(): PageID {
        return 'edit-series-page';
    }

    get label(): string {
        return 'Serie bearbeiten';
    }

    get component(): HTMLElement {
        if (this._component === undefined) {
            this._component = new OylEditSeriesPage();
        }
        return this._component;
    }

    update(options: SeriesPageOptions): void {
        this.component.setAttribute('series-id', options.seriesId);
    }
}

export default EditSeriesPage;