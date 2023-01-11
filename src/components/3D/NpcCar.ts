import { reactive, ref } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"

export class NpcCar {
    public npc: any
    public positions: any
    public curMapObjCenterCoords: any
    public curMapObj: IMapObject
    public gridSizeX: any
    public gridSizeY: any
    public fieldSize: any
    public mapLimit: any
    public gameAssetX: any
    public gameAssetZ: any

    constructor(
        gameAssetX: any,
        posY: any,
        gameAssetZ: any,
        npcRotation: any,
        gridSizeX: any,
        gridSizeY: any,
        fieldSize: any,
        curMapObj: IMapObject
    ) {
        this.npc = ref()
        this.curMapObj = curMapObj
        this.positions = reactive({ npcPosX: 0, npcPosY: posY, npcPosZ: 0, npcRotation: npcRotation })
        this.curMapObjCenterCoords = reactive({ centerX: 0, centerZ: 0 })
        this.curMapObj = reactive({
            objectTypeId: curMapObj.objectTypeId,
            x: curMapObj.x,
            y: curMapObj.y,
            rotation: curMapObj.rotation,
            game_assets: curMapObj.game_assets,
        })
        this.gridSizeX = gridSizeX
        this.gridSizeY = gridSizeY
        this.fieldSize = fieldSize
        this.mapLimit = 0
        this.gameAssetX = gameAssetX
        this.gameAssetZ = gameAssetZ

        this.calcMapEleCenter()
        this.calcPixelPosNpc()
        this.calcNpcMapLimit(
            this.curMapObjCenterCoords.centerX,
            this.curMapObjCenterCoords.centerZ,
            this.positions.npcRotation
        )
    }

    update() {
        const velocity = 0.005

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
        console.log(this.curMapObj)

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
    }

    calcNpcMapLimit(centerX: number, centerZ: number, npcRot: number) {
        let limit = 0

        if (npcRot === 0) {
            limit = centerX - this.fieldSize / 2
        } else if (npcRot === 1) {
            limit = centerZ + this.fieldSize / 2
        } else if (npcRot === 2) {
            limit = centerX + this.fieldSize / 2
        } else if (npcRot === 3) {
            limit = centerZ - this.fieldSize / 2
        }

        this.mapLimit = limit
    }

    //map ele rotation and driving direction need to be taken into account
    checkMapEleLimit() {
        if (this.positions.npcPosX < this.mapLimit) {
            console.log("in map Ele")
        } else {
            //method callto backend to get calculated coords of next map ele from script??
            console.log("left map ele")
        }
    }
}
