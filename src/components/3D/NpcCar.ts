import { reactive, ref } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"
import { NpcAsset } from "./NpcAsset"
import { IMapObjCenterCoordinates } from "../../typings/IMapObjCenterCoordinates"
import { INpcPosition } from "../../typings/INpcPosition"

export class NpcCar extends NpcAsset{
    constructor(
        npcId: number,
        objectTypeId: number,
        gameAssetX: number,
        gameAssetZ: number,
        npcRotation: number,
        fieldSize: number,
        curMapObj: IMapObject
    ) {
        super(
            npcId,
            objectTypeId,
            gameAssetX,
            gameAssetZ,
            npcRotation,
            fieldSize,
            curMapObj
        );
        this.calcNpcMapLimit()
    }
}
