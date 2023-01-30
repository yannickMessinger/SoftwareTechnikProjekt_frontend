import { IGameAsset2D } from "./IGameAsset2D"

export interface IGridElement {
    objectTypeId: number
    groupId: number
    posX: number
    posY: number
    rotation: number
    texture: string
    isValid: boolean
    game_assets: IGameAsset2D[]
}
