import { IGameAsset2D } from "./IGameAsset2D"

export interface IMapObject {
    objectTypeId: number
    x: number
    y: number
    rotation: number
    game_assets: IGameAsset2D[]
}
