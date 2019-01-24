//TODO: favorite: true|false
interface DataListElement {
    id: string,
    tvdbId: number,
    name_de: string,
    name_en: string,
    name_jpn: string,
    list: ListID,
    rank: number,
    favorite: boolean,
    seasons: {
        thumbnail: string,
        url: string,
        favorite: boolean,
        episodes: {
            name: string,
            url: string,
            favorite: boolean,
            watched: boolean
        }[]
    }[]
}