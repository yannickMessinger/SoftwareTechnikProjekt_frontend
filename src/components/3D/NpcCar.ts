import { reactive, ref } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"

export class NpcCar {
    public npc: any
    public positions: any
    public curMapObjCenterCoords: any
    public curMapObjCords: any
    public gridSizeX: any
    public gridSizeY: any
    public fieldSize: any
    public mapLimit: any

    //public currentMapObj: IMapObject

    constructor(
        posX: any,
        posY: any,
        posZ: any,
        npcRotation: any,
        gridSizeX: any,
        gridSizeY: any,
        fieldSize: any,
        mapObjCoordX: any,
        mapObjCoordY: any
    ) {
        this.npc = ref()
        this.positions = reactive({ npcPosX: posX, npcPosY: posY, npcPosZ: posZ, npcRotation: npcRotation })
        this.curMapObjCenterCoords = reactive({ centerX: 0, centerZ: 0 })
        this.curMapObjCords = reactive({ mapObjCoordX: mapObjCoordX, mapObjCoordY: mapObjCoordY, mapObjRot: 0 })
        this.gridSizeX = gridSizeX
        this.gridSizeY = gridSizeY
        this.fieldSize = fieldSize
        this.mapLimit = 0

        this.calcCenter(this.curMapObjCords.mapObjCoordX, this.curMapObjCords.mapObjCoordY)
        this.calcNpcMapLimit(
            this.curMapObjCenterCoords.centerX,
            this.curMapObjCenterCoords.centerZ,
            this.positions.npcRotation
        )
        //this.currentMapObj = {objectTypeId:0, x:0, y:0, rotation:0, game_assets:[]}
    }

    /*Calculates X coordinates position of loaded Model */
    calcCoordinateX(n: number) {
        let x = this.gridSizeX * -0.5 + n * this.fieldSize + this.fieldSize / 2
        //console.log(`GameObj x: ${x}`)
        return x
    }

    /*Calculates Z coordinates position of loaded Model */
    calcCoordinateZ(n: number) {
        let z = this.gridSizeY * -0.5 + n * this.fieldSize + this.fieldSize / 2
        //console.log(`GameObj z: ${z}`)
        return z
    }

    calcCenter(mapObjX: number, mapObjY: number) {
        let x = this.gridSizeX * -0.5 + mapObjX * this.fieldSize + this.fieldSize / 2
        let z = this.gridSizeY * -0.5 + mapObjY * this.fieldSize + this.fieldSize / 2

        this.curMapObjCenterCoords.centerX = x
        this.curMapObjCenterCoords.centerZ = z
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

        console.log(
            `MapEle x: ${this.curMapObjCords.mapObjCoordX} MapEle y: ${this.curMapObjCords.mapObjCoordY} center: x: ${this.curMapObjCenterCoords.centerX} center: z: ${this.curMapObjCenterCoords.centerZ} limit: ${limit}`
        )
        console.log(`Npc Car pos: x ${this.positions.npcPosX} z: ${this.positions.npcPosZ}`)
        this.mapLimit = limit
    }

    setCurMapObjCords(x: number, y: number) {
        this.curMapObjCords.mapObjCoordX = x
        this.curMapObjCords.mapObjCoordY = y
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
