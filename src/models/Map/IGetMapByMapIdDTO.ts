//interface for DTO's to receive messages from backend
export interface IGetMapByMapIdDTO {
    mapId: number
    mapName: string
    creationDate: Date
    sizeX: number
    sizeY: number
}
