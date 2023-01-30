import { IGameAsset2D } from "./IGameAsset2D"
/**
 *
 * objectTypeId - id for identifying the type of the asset (used for displaying 2d texture and 3d model)
 * groupId - categoryId for the list like street or railway (useful Id system needs to be invented later)
 * posX - x position of the element in the grid
 * posY - y position of the element in the grid
 * rotation - rotation of the object (between 0 and 3)
 * texture - path to the texture which is displayed in the Editor
 * isValid - boolean to check if the element is valid, is set when running the validation of the streetgrid
 * game_assets - array with all game_assets which are placed on the element
 * */
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
