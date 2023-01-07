import { IGameAsset2D } from "./IGameAsset2D"

export interface IGridElement {
    objectTypeId: number
    posX: number
    posY: number
    rotation: number
    texture: string
    game_assets: IGameAsset2D[]
}
