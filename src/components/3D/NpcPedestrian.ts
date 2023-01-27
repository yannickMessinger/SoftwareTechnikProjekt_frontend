import { IMapObject } from "../../services/streetplaner/IMapObject"
import { NpcAsset } from "./NpcAsset"

export class NpcPedestrian extends NpcAsset{
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
        )
        this.velocity = 0.025
        this.calcNpcMapLimit()
    }
    /*
    move(): void {
        if (this.curMapObj.objectTypeId === 0 || this.curMapObj.objectTypeId === 12 || this.curMapObj.objectTypeId === 9 || this.curMapObj.objectTypeId === 11) {
            this.moveStraight()
        } else if (this.curMapObj.objectTypeId === 1 || this.curMapObj.objectTypeId === 10) {
            this.moveCurve()
        } else if (this.curMapObj.objectTypeId === 2) {
            if (this.lastCarRotation === this.positions.npcRotation) {
                this.moveStraight()
            } else {
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                if (this.curveRadius === 0) {
                    this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                }
                this.moveCurveInIntersection()
            }
        }
    }
    */
}
