interface DataListElement {
    id: string,
    name: string,
    list: ListID,
    seasons: {
        thumbnail: string,
        episodes: {
            name: string,
            url: string,
            watched: boolean
        }[]
    }[]
}