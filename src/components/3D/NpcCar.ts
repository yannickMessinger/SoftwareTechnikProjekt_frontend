import { reactive, ref } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"
import { NpcAsset } from "./NpcAsset"

export class NpcCar extends NpcAsset{
    constructor(
        npcId: number,
        objectTypeId: number,
        gameAssetX: number,
        posY: number,
        gameAssetZ: number,
        npcRotation: number,
        gridSizeX: number,
        gridSizeY: number,
        fieldSize: number,
        curMapObj: IMapObject
    ) {
        super(
            npcId,
            objectTypeId,
            gameAssetX,
            posY,
            gameAssetZ,
            npcRotation,
            gridSizeX,
            gridSizeY,
            fieldSize,
            curMapObj
        )

        this.calcMapEleCenter()
        this.calcPixelPosNpc()
        this.calcNpcMapLimit()
    }
}
