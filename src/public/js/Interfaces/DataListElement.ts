interface DataListElement {
    id: string,
    name_de: string,
    name_en: string,
    name_jpn: string,
    list: ListID,
    seasons: {
        thumbnail: string,
        url: string,
        episodes: {
            name: string,
            url: string,
            watched: boolean
        }[]
    }[]
}