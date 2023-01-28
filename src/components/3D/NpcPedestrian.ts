import { IMapObject } from "../../services/streetplaner/IMapObject"
import { NpcAsset } from "./NpcAsset"

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
