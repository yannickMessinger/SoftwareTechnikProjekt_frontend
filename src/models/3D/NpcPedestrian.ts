import { IMapObject } from "../Editor/IMapObject"
import { NpcAsset } from "./NpcAsset"

/**
 * child class of NpcAsset for pedestrians
 */
export class NpcPedestrian extends NpcAsset {
    constructor(
        npcId: number,
        objectTypeId: number,
        gameAssetX: number,
        gameAssetZ: number,
        npcRotation: number,
        fieldSize: number,
        curMapObj: IMapObject
    ) {
        super(npcId, objectTypeId, gameAssetX, gameAssetZ, npcRotation, fieldSize, curMapObj)
        this.velocity = 0.025
        this.calcNpcMapLimit()
    }
}
