import { Inject, InjectionTarget } from "../decorators/decorators";
import EditSeriesPage from "../components/pages/edit/series/EditSeriesPage";

@InjectionTarget()
class PageService implements PageServiceInterface {

    private pageMap: {[key: string]: PageInterface} = {};

    constructor(
        @Inject('EditSeriesPage') editSeries: EditSeriesPage
    ) {
        this.pageMap[editSeries.pageId] = editSeries;
    }

    getAll(): PageInterface[] {
        return Object.values(this.pageMap);
    }

    get(pageId: PageID): PageInterface {
        return this.pageMap[pageId];
    }
}

export default PageService;