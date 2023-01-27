import { IMapObject } from "../../services/streetplaner/IMapObject"
import { NpcAsset } from "./NpcAsset"

export class NpcPedestrian extends NpcAsset{
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
        this.velocity = 0.025
        this.calcMapEleCenter()
        this.calcPixelPosNpc()
        this.calcNpcMapLimit()
    }

    //driving
    drive() {
        if (this.curMapObj.objectTypeId === 0 || this.curMapObj.objectTypeId === 12 || this.curMapObj.objectTypeId === 9 || this.curMapObj.objectTypeId === 11) {
            this.walkStraight(this.velocity)
        } else if (this.curMapObj.objectTypeId === 1 || this.curMapObj.objectTypeId === 10) {
            this.walkCurve(0.025)
        } else if (this.curMapObj.objectTypeId === 2) {
            if (this.lastCarRotation === this.positions.npcRotation) {
                this.walkStraight(this.velocity)
            } else {
                this.walkCurve(this.velocity)
            }
        }
    }

    walkStraight(velocity: number) {
        if (this.positions.npcRotation === 0) {
            this.positions.npcPosZ -= velocity
        } else if (this.positions.npcRotation === 1) {
            this.positions.npcPosX += velocity
        } else if (this.positions.npcRotation === 2) {
            this.positions.npcPosZ += velocity
        } else if (this.positions.npcRotation === 3) {
            this.positions.npcPosX -= velocity
        }
    }

    walkCurve(velocity: number) {
        if (
            !(
                this.currCurveAngle === 0 ||
                this.currCurveAngle === 90 ||
                this.currCurveAngle === 180 ||
                this.currCurveAngle === 270 ||
                this.currCurveAngle === 360
            )
        ) {
            this.calculateCurvePoints()
        } else {
            this.walkStraight(velocity)
        }
    }

    calculateCurvePoints(): void {
        this.positions.npcPosX = this.curveCenterX + Math.cos((this.currCurveAngle * Math.PI) / 180) * this.curveRadius
        this.positions.npcPosZ = this.curveCenterZ - Math.sin((this.currCurveAngle * Math.PI) / 180) * this.curveRadius
        this.currCurveAngle += this.curveAngleInc

        if (this.driveCurveRight) {
            this.viewRotation -= 0.25 * (Math.PI / 180)
        } else {
            this.viewRotation += 0.25 * (Math.PI / 180)
        }
    }

    calcMapEleCenter(): void {
        this.curMapObjCenterCoords.centerX =
            this.gridSizeX * -0.5 + this.curMapObj.y * this.fieldSize + this.fieldSize / 2
        this.curMapObjCenterCoords.centerZ =
            this.gridSizeY * -0.5 + this.curMapObj.x * this.fieldSize + this.fieldSize / 2
    }

    calcPixelPosNpc(): void {
        let originX = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
        this.positions.npcPosX = originX + this.gameAssetX * this.fieldSize

        let originZ = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2
        this.positions.npcPosZ = originZ + this.gameAssetZ * this.fieldSize
    }

    calcNpcMapLimit(): void {
        if (this.positions.npcRotation === 0) {
            this.mapLimit = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2
        } else if (this.positions.npcRotation === 1) {
            this.mapLimit = this.curMapObjCenterCoords.centerX + this.fieldSize / 2
        } else if (this.positions.npcRotation === 2) {
            this.mapLimit = this.curMapObjCenterCoords.centerZ + this.fieldSize / 2
        } else if (this.positions.npcRotation === 3) {
            this.mapLimit = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
        }
    }

    reachedMapEleLimit(): boolean | undefined {
        if (this.positions.npcRotation === 0) {
            if (this.positions.npcPosZ > this.mapLimit) {
                return false
            } else {
                //this.driving = false
                this.needsMapEleUpdate = true
                //console.log("fahre nicht 0")
                return true
            }
        } else if (this.positions.npcRotation === 1) {
            if (this.positions.npcPosX < this.mapLimit) {
                return false
            } else {
                //this.driving = false
                this.needsMapEleUpdate = true
                //console.log("fahre nicht 1")
                return true
            }
        } else if (this.positions.npcRotation === 2) {
            if (this.positions.npcPosZ < this.mapLimit) {
                return false
            } else {
                //this.driving = false
                this.needsMapEleUpdate = true
                //console.log("fahre nicht 2")
                return true
            }
        } else if (this.positions.npcRotation === 3) {
            if (this.positions.npcPosX > this.mapLimit) {
                return false
            } else {
                //this.driving = false
                this.needsMapEleUpdate = true
                //console.log("fahre nicht 3")
                return true
            }
        } else {
            console.log("fehler reachedMapEle limit")
        }
    }

    calculateIntersection(): void {
        if (
            (this.lastCarRotation === 0 && this.positions.npcRotation === 1) ||
            (this.lastCarRotation === 3 && this.positions.npcRotation === 2)
        ) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX + this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ + this.fieldSize / 2

            if (this.lastCarRotation === 0) {
                this.driveCurveRight = true
                this.curveRadius = this.curveCenterX - this.positions.npcPosX
                this.currCurveAngle = 179.5
                this.curveAngleInc = -0.25
            } else {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 90.5
                this.curveAngleInc = 0.25
            }
        } else if (
            (this.lastCarRotation === 0 && this.positions.npcRotation === 3) ||
            (this.lastCarRotation === 1 && this.positions.npcRotation === 2)
        ) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ + this.fieldSize / 2

            if (this.lastCarRotation === 0) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 0.5
                this.curveAngleInc = 0.25
            } else {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 89.5
                this.curveAngleInc = -0.25
            }
        } else if (
            (this.lastCarRotation === 1 && this.positions.npcRotation === 0) ||
            (this.lastCarRotation === 2 && this.positions.npcRotation === 3)
        ) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2

            if (this.lastCarRotation === 2) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 359.5
                this.curveAngleInc = -0.25
            } else {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 270.5
                this.curveAngleInc = 0.25
            }
        } else if (
            (this.lastCarRotation === 2 && this.positions.npcRotation === 1) ||
            (this.lastCarRotation === 3 && this.positions.npcRotation === 0)
        ) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX + this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2

            if (this.lastCarRotation === 3) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 269.5
                this.curveAngleInc = -0.25
            } else {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 180.5
                this.curveAngleInc = 0.25
            }
        } else if (this.lastCarRotation === this.positions.npcRotation) {
            this.walkStraight(this.velocity)
        }
    }

    calculateCurve(): void {
        this.calcMapEleCenter()
        if (this.curMapObj.rotation === 0) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX + this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ + this.fieldSize / 2

            if (this.lastCarRotation === 0) {
                this.driveCurveRight = true
                this.curveRadius = this.curveCenterX - this.positions.npcPosX
                this.currCurveAngle = 179.5
                this.curveAngleInc = -0.25
            } else if (this.lastCarRotation === 3) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 90.5
                this.curveAngleInc = 0.25
            } else {
                console.log("Fehler bei driveCurve 0")
            }
        } else if (this.curMapObj.rotation === 1) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ + this.fieldSize / 2
            if (this.lastCarRotation === 1) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 89.5
                this.curveAngleInc = -0.25
            } else if (this.lastCarRotation === 0) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 0.5
                this.curveAngleInc = 0.25
            } else {
                console.log("Fehler bei driveCurve 1")
            }
        } else if (this.curMapObj.rotation === 2) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2
            if (this.lastCarRotation === 2) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 359.5
                this.curveAngleInc = -0.25
            } else if (this.lastCarRotation === 1) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 270.5
                this.curveAngleInc = 0.25
            } else {
                console.log("Fehler bei driveCurve 2")
            }
        } else if (this.curMapObj.rotation === 3) {
            this.curveCenterX = this.curMapObjCenterCoords.centerX + this.fieldSize / 2
            this.curveCenterZ = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2
            if (this.lastCarRotation === 3) {
                this.driveCurveRight = true
                this.curveRadius = Math.abs(this.curveCenterZ - this.positions.npcPosZ)
                this.currCurveAngle = 269.5
                this.curveAngleInc = -0.25
            } else if (this.lastCarRotation === 2) {
                this.driveCurveRight = false
                this.curveRadius = Math.abs(this.curveCenterX - this.positions.npcPosX)
                this.currCurveAngle = 180.5
                this.curveAngleInc = 0.25
            } else {
                console.log("Fehler bei driveCurve 3")
            }
        }
    }
}
