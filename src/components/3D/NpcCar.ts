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
    lastCarRotation: number

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

        this.calcMapEleCenter()
        this.calcPixelPosNpc()
        this.calcNpcMapLimit()
    }

    update() {
        if (this.driving) {
            this.drive()
        }
    }

    //driving
    drive() {
        const velocity = 0.1

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

    calcMapEleCenter() {
        let mapEleCenterX = this.gridSizeX * -0.5 + this.curMapObj.y * this.fieldSize + this.fieldSize / 2
        let mapEleCenterZ = this.gridSizeY * -0.5 + this.curMapObj.x * this.fieldSize + this.fieldSize / 2

        this.curMapObjCenterCoords.centerX = mapEleCenterX
        this.curMapObjCenterCoords.centerZ = mapEleCenterZ

        console.log(`center Npc: x:${mapEleCenterX}, z: ${mapEleCenterZ}`)
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

    driveCurve() {
        /* abbruchbedingung*/

        let curveCenterX = -1
        let curveCenterZ = -1
        let radius = -1
        if (this.nextMapObj.rotation === 0) {
            /*Innenpunkt der Kurve berechnen*/
            curveCenterX = this.nextMapObj.x + this.fieldSize / 2
            curveCenterZ = this.nextMapObj.y + this.fieldSize / 2
            if (this.lastCarRotation === 0) {
                /*Rechtskurve*/
                /*Radius der Kurve berechnen*/
                radius = this.calculateRadius(curveCenterX, this.positions.npcPosX)
            } else if (this.lastCarRotation === 3) {
                /*Linkskurve*/
                radius = this.calculateRadius(curveCenterZ, this.positions.npcPosZ)
            } else {
                console.log("Fehler bei driveCurve 0")
            }
        } else if (this.nextMapObj.rotation === 1) {
            curveCenterX = this.nextMapObj.x - this.fieldSize / 2
            curveCenterZ = this.nextMapObj.y + this.fieldSize / 2
            if (this.lastCarRotation === 1) {
                /*Rechtskurve*/
                radius = this.calculateRadius(curveCenterZ, this.positions.npcPosZ)
            } else if (this.lastCarRotation === 0) {
                /*Linkskurve*/
                radius = this.calculateRadius(curveCenterX, this.positions.npcPosX)
            } else {
                console.log("Fehler bei driveCurve 1")
            }
        } else if (this.nextMapObj.rotation === 2) {
            curveCenterX = this.nextMapObj.x - this.fieldSize / 2
            curveCenterZ = this.nextMapObj.y - this.fieldSize / 2
            if (this.lastCarRotation === 2) {
                /*Rechtskurve*/
                radius = this.calculateRadius(curveCenterX, this.positions.npcPosX)
            } else if (this.lastCarRotation === 1) {
                /*Linkskurve*/
                radius = this.calculateRadius(curveCenterZ, this.positions.npcPosZ)
            } else {
                console.log("Fehler bei driveCurve 2")
            }
        } else if (this.nextMapObj.rotation === 3) {
            curveCenterX = this.nextMapObj.x + this.fieldSize / 2
            curveCenterZ = this.nextMapObj.y - this.fieldSize / 2

            if (this.lastCarRotation === 3) {
                /*Linkskurve*/
                radius = this.calculateRadius(curveCenterZ, this.positions.npcPosZ)
            } else if (this.lastCarRotation === 2) {
                /*Rechtskurve*/
                radius = this.calculateRadius(curveCenterX, this.positions.npcPosX)
            } else {
                console.log("Fehler bei driveCurve 3")
            }
        } else {
            console.log("Fehler bei driveCurve 111")
        }
    }

    calculateRadius(centerPos: number, carPos: number): number {
        return centerPos - carPos < 0 ? (centerPos - carPos) * -1 : centerPos - carPos
    }

    calculateCurvePosition(radius: number, curveCenterPosX: number, curveCenterPosZ: number, angle: number) {
        return 0
    }
}
