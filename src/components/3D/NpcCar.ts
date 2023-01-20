import { reactive, ref } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"

//maybe MapId is necessary to identify current map for backend purposes

interface NpcInfo {
    npcId: number
    npcPosX: number
    npcPosZ: number
    npcRotation: number
}

interface NpcInfoResponseDTO {
    nextMapEleobjectTypeId: number
    nextMapEleX: number
    nextMapEleY: number
    nextMapElerotation: number
    newGameAssetRotation: number
}

interface IStompMessage {
    npcContent: NpcInfo
    type: string
}

export class NpcCar {
    public npcId: number
    public npc: any
    public positions: any
    public curMapObjCenterCoords: any
    public curMapObj: IMapObject
    public nextMapObj: IMapObject
    public gridSizeX: number
    public gridSizeY: number
    public fieldSize: number
    public mapLimit: number
    public gameAssetX: number
    public gameAssetZ: number
    public driving: boolean
    public needsMapEleUpdate: boolean
    public lastCarRotation: number
    public curveStepSize: number

    public curveRadius: number
    public curveCenterX: number
    public curveCenterZ: number
    public driveCurveRight: boolean
    public currCurveAngle: number
    public curveAngleInc: number

    constructor(
        npcId: number,
        gameAssetX: number,
        posY: number,
        gameAssetZ: number,
        npcRotation: number,
        gridSizeX: number,
        gridSizeY: number,
        fieldSize: number,
        curMapObj: IMapObject
    ) {
        this.npcId = npcId
        this.npc = ref()
        this.positions = reactive({ npcPosX: 0, npcPosY: posY, npcPosZ: 0, npcRotation: npcRotation })
        this.curMapObjCenterCoords = reactive({ centerX: 0, centerZ: 0 })
        this.curMapObj = reactive({
            objectTypeId: curMapObj.objectTypeId,
            x: curMapObj.x,
            y: curMapObj.y,
            rotation: curMapObj.rotation,
            game_assets: curMapObj.game_assets,
        })
        this.nextMapObj = reactive({
            objectTypeId: -1,
            x: -1,
            y: -1,
            rotation: -1,
            game_assets: [],
        })
        this.gridSizeX = gridSizeX
        this.gridSizeY = gridSizeY
        this.fieldSize = fieldSize
        this.mapLimit = 0
        this.gameAssetX = gameAssetX
        this.gameAssetZ = gameAssetZ
        this.driving = true
        this.needsMapEleUpdate = false
        this.lastCarRotation = this.positions.npcRotation

        this.curveStepSize = 1.5

        this.curveRadius = 0
        this.curveCenterX = 0
        this.curveCenterZ = 0
        this.driveCurveRight = false
        this.currCurveAngle = 0.5
        this.curveAngleInc = 0.5

        this.calcMapEleCenter()
        this.calcPixelPosNpc()
        this.calcNpcMapLimit()

        if (this.curMapObj.objectTypeId === 1) {
            console.log("Kurve, muss Paramter berechnen")
            //this.driveCurveCalc()
            this.calculateCurve()
        }
    }

    update() {
        if (this.driving) {
            this.drive()
        }
    }

    //driving
    drive() {
        const velocity = 0.05

        if (this.curMapObj.objectTypeId === 0) {
            //Straight
            if (this.positions.npcRotation === 0) {
                this.positions.npcPosZ -= velocity
            } else if (this.positions.npcRotation === 1) {
                this.positions.npcPosX += velocity
            } else if (this.positions.npcRotation === 2) {
                this.positions.npcPosZ += velocity
            } else if (this.positions.npcRotation === 3) {
                this.positions.npcPosX -= velocity
            }
        } else if (this.curMapObj.objectTypeId === 1) {
            //Curve
            //driving right curve but the way is intended for curve rotation === 2
            if (this.driveCurveRight && this.currCurveAngle > 90) {
                this.positions.npcPosX = this.curveCenterX + Math.cos(this.currCurveAngle * Math.PI/180) * this.curveRadius
                this.positions.npcPosZ = this.curveCenterZ - Math.sin(this.currCurveAngle * Math.PI/180) * this.curveRadius
                this.currCurveAngle += this.curveAngleInc
                // console.log(`angle: ${this.currCurveAngle}`)
            } else if (!this.driveCurveRight && this.currCurveAngle < 90) {
                this.positions.npcPosX = this.curveCenterX - Math.cos(this.currCurveAngle * Math.PI/180) * this.curveRadius
                this.positions.npcPosZ = this.curveCenterZ - Math.sin(this.currCurveAngle * Math.PI/180) * this.curveRadius
                this.currCurveAngle += this.curveAngleInc
                console.log(`angle: ${this.currCurveAngle}`)
            }
        } else if (this.curMapObj.objectTypeId === 2) {
            //Intersection
        }
    }

    calcMapEleCenter() {
        let mapEleCenterX = this.gridSizeX * -0.5 + this.curMapObj.y * this.fieldSize + this.fieldSize / 2
        let mapEleCenterZ = this.gridSizeY * -0.5 + this.curMapObj.x * this.fieldSize + this.fieldSize / 2

        this.curMapObjCenterCoords.centerX = mapEleCenterX
        this.curMapObjCenterCoords.centerZ = mapEleCenterZ

        console.log(`map ele center Npc: x:${mapEleCenterX}, z: ${mapEleCenterZ}`)
    }

    calcPixelPosNpc() {
        let originX = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
        let x = originX + this.gameAssetX * this.fieldSize

        let originZ = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2
        let z = originZ + this.gameAssetZ * this.fieldSize

        this.positions.npcPosX = x
        this.positions.npcPosZ = z

        console.log(`pixelpos npc: x:${this.positions.npcPosX} z:${this.positions.npcPosZ}`)
    }

    calcNpcMapLimit() {
        let limit = 0

        if (this.positions.npcRotation === 0) {
            limit = this.curMapObjCenterCoords.centerZ - this.fieldSize / 2
        } else if (this.positions.npcRotation === 1) {
            limit = this.curMapObjCenterCoords.centerX + this.fieldSize / 2
        } else if (this.positions.npcRotation === 2) {
            limit = this.curMapObjCenterCoords.centerZ + this.fieldSize / 2
        } else if (this.positions.npcRotation === 3) {
            limit = this.curMapObjCenterCoords.centerX - this.fieldSize / 2
        }

        this.mapLimit = limit + 1.5
        console.log(this.mapLimit)
    }

    reachedMapEleLimit() {
        if (this.positions.npcRotation === 0) {
            if (this.positions.npcPosZ > this.mapLimit) {
                return false
            } else {
                this.driving = false
                this.needsMapEleUpdate = true

                return true
            }
        } else if (this.positions.npcRotation === 1) {
            if (this.positions.npcPosX < this.mapLimit) {
                return false
            } else {
                this.driving = false
                this.needsMapEleUpdate = true

                return true
            }
        } else if (this.positions.npcRotation === 2) {
            if (this.positions.npcPosZ < this.mapLimit) {
                return false
            } else {
                this.driving = false
                this.needsMapEleUpdate = true

                return true
            }
        } else if (this.positions.npcRotation === 3) {
            if (this.positions.npcPosX > this.mapLimit) {
                return false
            } else {
                this.driving = false
                this.needsMapEleUpdate = true

                return true
            }
        }
    }

    calculateCurve() {
        if (this.curMapObj.rotation === 0) {
            this.curveCenterX = this.curMapObj.y + (this.fieldSize*0.1);
            this.curveCenterZ = this.curMapObj.x + (this.fieldSize*0.1);
            console.log("______ x:", this.curveCenterX, "z:", this.curveCenterZ)
            console.log("npc pos:", this.positions.npcPosX, this.positions.npcPosZ)
            if (this.lastCarRotation === 0) {
                this.driveCurveRight = true
                this.curveRadius = this.curveCenterX - this.positions.npcPosX
                this.currCurveAngle = 180;
                this.curveAngleInc = -0.5;
                console.log("___radius", this.curveRadius)
            } else if (this.lastCarRotation === 3) {
                this.driveCurveRight = false
                this.curveRadius = this.curveCenterZ - this.positions.npcPosZ
            } else {
                console.log("Fehler bei driveCurve 0")
            }
        }
    }

    driveCurveCalc() {
        /* radius, CurveCenter, Richtung der Kurve>*/
        console.log("drive curve aufgerufen")
        if (this.curMapObj.rotation === 0) {
            /*Innenpunkt der Kurve berechnen*/
            this.curveCenterZ = (this.trans2Dto3DcoordZ(this.nextMapObj.y) + this.fieldSize / 2) / 10
            this.curveCenterX = (this.trans2Dto3DcoordX(this.nextMapObj.y) + this.fieldSize / 2) / 10
            if (this.lastCarRotation === 0) {
                /*Rechtskurve*/
                this.driveCurveRight = true
                /*Radius der Kurve berechnen*/
                this.curveRadius = this.calculateRadius(this.curveCenterX, this.positions.npcPosX)
                /*
                    if(Math.cos(this.curveStepSize) * radius === radius){
                       
                    }
                    */
            } else if (this.lastCarRotation === 3) {
                /*Linkskurve*/
                this.driveCurveRight = false
                this.curveRadius = this.calculateRadius(this.curveCenterZ, this.positions.npcPosZ)
            } else {
                console.log("Fehler bei driveCurve 0")
            }
        } else if (this.curMapObj.rotation === 1) {
            this.curveCenterX = this.nextMapObj.x - this.fieldSize / 2
            this.curveCenterZ = this.nextMapObj.y + this.fieldSize / 2
            if (this.lastCarRotation === 1) {
                /*Rechtskurve*/
                this.driveCurveRight = true
                this.curveRadius = this.calculateRadius(this.curveCenterZ, this.positions.npcPosZ)
            } else if (this.lastCarRotation === 0) {
                /*Linkskurve*/
                this.driveCurveRight = false
                this.curveRadius = this.calculateRadius(this.curveCenterX, this.positions.npcPosX)
            } else {
                console.log("Fehler bei driveCurve 1")
            }
        } else if (this.curMapObj.rotation === 2) {
            this.curveCenterX = this.nextMapObj.x - this.fieldSize / 2
            this.curveCenterZ = this.nextMapObj.y - this.fieldSize / 2
            if (this.lastCarRotation === 2) {
                /*Rechtskurve*/
                this.driveCurveRight = true
                this.curveRadius = this.calculateRadius(this.curveCenterX, this.positions.npcPosX)
            } else if (this.lastCarRotation === 1) {
                /*Linkskurve*/
                this.driveCurveRight = false
                this.curveRadius = this.calculateRadius(this.curveCenterZ, this.positions.npcPosZ)
            } else {
                console.log("Fehler bei driveCurve 2")
            }
        } else if (this.curMapObj.rotation === 3) {
            this.curveCenterX = this.nextMapObj.x + this.fieldSize / 2
            this.curveCenterZ = this.nextMapObj.y - this.fieldSize / 2

            if (this.lastCarRotation === 3) {
                /*Linkskurve*/
                this.driveCurveRight = false
                this.curveRadius = this.calculateRadius(this.curveCenterZ, this.positions.npcPosZ)
            } else if (this.lastCarRotation === 2) {
                /*Rechtskurve*/
                this.driveCurveRight = true
                this.curveRadius = this.calculateRadius(this.curveCenterX, this.positions.npcPosX)
            } else {
                console.log("Fehler bei driveCurve 3")
            }
        } else {
            console.log("Fehler bei driveCurve 111")
        }

        console.log(`radius: ${this.curveRadius}`)
        console.log(`CurveCenterX: ${this.curveCenterX}`)
        console.log(`CurveCenterZ: ${this.curveCenterZ}`)
        console.log(`CarPosX:: ${this.positions.npcPosX}`)
        console.log(`CarPosZ:: ${this.positions.npcPosZ}`)
    }

    calculateRadius(centerPos: number, carPos: number): number {
        return centerPos - carPos < 0 ? (centerPos - carPos) * -1 : centerPos - carPos
    }

    calculateCurvePosition(radius: number, curveCenterPosX: number, curveCenterPosZ: number, angle: number) {
        const x = curveCenterPosX + Math.cos(angle * Math.PI/180) * radius
        const z = curveCenterPosZ + Math.sin(angle * Math.PI/180) * radius
        return {x, z}
    }

    trans2Dto3DcoordX(coord2dX: number) {
        return this.gridSizeX * -0.5 + coord2dX * this.fieldSize + this.fieldSize / 2
    }

    trans2Dto3DcoordZ(coord2dZ: number) {
        return this.gridSizeY * -0.5 + coord2dZ * this.fieldSize + this.fieldSize / 2
    }
}
