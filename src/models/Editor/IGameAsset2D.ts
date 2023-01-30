/**
 * assetId - id for the asset form backend
 * objectTypeId - id for identifying the type of the asset (used for displaying 2d texture and 3d model)
 * x - x coordinate of the asset inside its parent IMapObject
 * y - y coordinate of the asset inside its parent IMapObject
 * x3d - x coordinate of the asset in 3d
 * z3d - z coordinate of the asset in 3d
 * rotation - rotation of the asset inside its parent IMapObject (between 0 and 3)
 * texture - path to the texture which is displayed in the Editor
 * isValid - boolean to check if the GameAsset is valid, is set when running the validation of the streetgrid
 * userId - is 0 when the GameAsset is a npc, otherwise its the userId of the corresponding user
 */
export interface IGameAsset2D {
    assetId?: number
    objectTypeId: number
    x: number
    y: number
    x3d?: number
    z3d?: number
    rotation: number
    texture: string
    isValid: boolean
    userId?: number
}
