interface ForeachElement {
    foreachListElement(callback: Function, opt?: any);
    getDataIndexList();
    getListId();
    getElementWithDataIndex(dataIndex: number);
}