import { IMapObject } from "../../services/streetplaner/IMapObject"
import { NpcAsset } from "./NpcAsset"
/**
 * subclass for Npc Vehicle like car and train
 */
export class NpcCar extends NpcAsset {
    /**
     *
     * @param npcId id of gameasset from backend
     * @param objectTypeId objectTypeId of asset to differ between car, train and pedestrian
     * @param gameAssetX x pixelposition, calculated in backend
     * @param gameAssetZ z pixelposition, calculated in backend
     * @param npcRotation rotation of the npc asset between 0 and 3
     * @param fieldSize size of a single mapObject tile, necessary for mapOvject border calculation
     * @param curMapObj current map Object that npc was initially placed on
     */
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
        this.calcNpcMapLimit()
    }
}
