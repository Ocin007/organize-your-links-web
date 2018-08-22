interface DataListElement {
    id: string,
    tvdbId: number,
    name_de: string,
    name_en: string,
    name_jpn: string,
    list: ListID,
    rank: number,
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