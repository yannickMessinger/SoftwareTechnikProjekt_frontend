import { IGameAsset2D } from "./IGameAsset2D"

/**
 * objectId - id for the object form backend
 * objectTypeId - id to identifying the type of the object (used for displaying 2d texture and 3d model)
 * groupId - categoryId for the list like street or railway (useful Id system needs to be invented later)
 * x - x position of the object on the map
 * y - y position of the object on the map
 * centerX3d - x position of the object in 3d
 * centerZ3d - z position of the object in 3d
 * rotation - rotation of the object (between 0 and 3)
 * game_assets - array with all game_assets which are placed on the object
 */
export interface IMapObject {
    objectId?: number
    objectTypeId: number
    x: number
    y: number
    centerX3d?: number
    centerZ3d?: number
    rotation: number
    game_assets: IGameAsset2D[]
}
