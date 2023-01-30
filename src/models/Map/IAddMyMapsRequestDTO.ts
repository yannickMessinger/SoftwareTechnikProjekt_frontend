//interface for DTO's to receive messages from backend

export interface IAddMyMapsRequestDTO {
    mapName: string
    creationDate: Date
    sizeX: number
    sizeY: number
    mapOwnerId: number
}
