import { reactive } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"

export class NpcAsset {
    public npcId: number
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
    //public curveStepSize: number
    public viewRotation: number
    public rotationMap: Map<number, number>
    public velocity: number
    public objectTypeId: number

    public curveRadius: number
    public curveCenterX: number
    public curveCenterZ: number
    public driveCurveRight: boolean
    public currCurveAngle: number
    public curveAngleInc: number

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
        this.npcId = npcId
        this.rotationMap = new Map([
            [0, Math.PI],
            [1, Math.PI / 2],
            [2, 0],
            [3, (3 * Math.PI) / 2],
        ])
        this.positions = reactive({
            npcPosX: 0,
            npcPosY: posY,
            npcPosZ: 0,
            npcRotation: npcRotation
        })
        this.curMapObjCenterCoords = reactive({
            centerX: 0,
            centerZ: 0
        })
        this.curMapObj = reactive({
            objectId: curMapObj.objectId,
            objectTypeId: curMapObj.objectTypeId,
            x: curMapObj.x,
            y: curMapObj.y,
            rotation: curMapObj.rotation,
            game_assets: curMapObj.game_assets
        })
        this.nextMapObj = reactive({
            objectId: -1,
            objectTypeId: -1,
            x: -1,
            y: -1,
            rotation: -1,
            game_assets: [],
        })
        this.velocity = 0.05
        this.objectTypeId = objectTypeId
        this.gridSizeX = gridSizeX
        this.gridSizeY = gridSizeY
        this.fieldSize = fieldSize
        this.mapLimit = 0
        this.gameAssetX = gameAssetX
        this.gameAssetZ = gameAssetZ
        this.driving = true
        this.needsMapEleUpdate = true
        this.lastCarRotation = this.positions.npcRotation

        this.viewRotation = this.rotationMap.get(this.positions.npcRotation) || 0

        this.curveRadius = 0
        this.curveCenterX = 0
        this.curveCenterZ = 0
        this.driveCurveRight = false
        this.currCurveAngle = 0.5
        this.curveAngleInc = 0.5
    }
}