import { reactive, ref } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"
import { Client } from "@stomp/stompjs"
import { IGameAsset2D } from "../../services/streetplaner/IGameAsset2D"

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/npc"
const UPDATE_POS_MSG = "/app/npc.updatepos"

//maybe MapId is necessary to identify current map for backend purposes

interface NpcInfo {
    npcId: number
    npcPosX: number
    npcPosZ: number
    npcRotation: number
}

interface IStompMessage {
    npcContent: NpcInfo
    type: string
}

export class NpcCar {
    public npcId: any
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
    public stompClient: Client
    public driving: any

    constructor(
        npcId: any,
        gameAssetX: any,
        posY: any,
        gameAssetZ: any,
        npcRotation: any,
        gridSizeX: any,
        gridSizeY: any,
        fieldSize: any,
        curMapObj: IMapObject
    ) {
        this.stompClient = this.receiveNpcUpdates()
        this.npcId = npcId
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
        this.driving = true

        this.calcMapEleCenter()
        this.calcPixelPosNpc()
        this.calcNpcMapLimit(
            this.curMapObjCenterCoords.centerX,
            this.curMapObjCenterCoords.centerZ,
            this.positions.npcRotation
        )
    }

    //driving
    update() {
        const velocity = 0.005

        if (this.driving) {
            if (this.positions.npcRotation === 0) {
                this.positions.npcPosZ -= velocity
            } else if (this.positions.npcRotation === 1) {
                this.positions.npcPosX += velocity
            } else if (this.positions.npcRotation === 2) {
                this.positions.npcPosZ += velocity
            } else if (this.positions.npcRotation === 3) {
                this.positions.npcPosX -= velocity
            }

            this.checkMapEleLimit()
        } else {
            console.log("not moving at the moment")
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
    }

    calcNpcMapLimit(centerX: number, centerZ: number, npcRot: number) {
        let limit = 0

        if (npcRot === 0) {
            limit = centerZ - this.fieldSize / 2
        } else if (npcRot === 1) {
            limit = centerX + this.fieldSize / 2
        } else if (npcRot === 2) {
            limit = centerZ + this.fieldSize / 2
        } else if (npcRot === 3) {
            limit = centerX - this.fieldSize / 2
        }

        this.mapLimit = limit
        console.log(this.mapLimit)
    }

    //map ele rotation and driving direction need to be taken into account
    checkMapEleLimit() {
        if (this.positions.npcRotation === 0) {
            if (this.positions.npcPosZ > this.mapLimit) {
                console.log(`npcCar id: ${this.npcId} in mapEle!`)
            } else {
                console.log(`npcCar id: ${this.npcId} left mapEle!`)
                this.driving = false
                this.updatePosMessage()
            }
        } else if (this.positions.npcRotation === 1) {
            if (this.positions.npcPosX < this.mapLimit) {
                console.log(`npcCar id: ${this.npcId} in mapEle!`)
            } else {
                console.log(`npcCar id: ${this.npcId} left mapEle!`)
                this.driving = false
                this.updatePosMessage()
            }
        } else if (this.positions.npcRotation === 2) {
            if (this.positions.npcPosZ < this.mapLimit) {
                console.log(`npcCar id: ${this.npcId} in mapEle!`)
            } else {
                console.log(`npcCar id: ${this.npcId} left mapEle!`)
                this.driving = false
                this.updatePosMessage()
            }
        } else if (this.positions.npcRotation === 3) {
            if (this.positions.npcPosX > this.mapLimit) {
                console.log(`npcCar id: ${this.npcId} in mapEle!`)
            } else {
                console.log(`npcCar id: ${this.npcId} left mapEle!`)
                this.driving = false
                this.updatePosMessage()
            }
        }
    }

    updatePosMessage() {
        if (this.stompClient) {
            const updatePosMsg: IStompMessage = {
                npcContent: {
                    npcId: this.npcId,
                    npcPosX: this.curMapObj.x,
                    npcPosZ: this.curMapObj.y,
                    npcRotation: this.positions.npcRotation,
                },
                type: "POSITION_UPDATE",
            }

            this.stompClient.publish({
                destination: UPDATE_POS_MSG,
                headers: {},
                body: JSON.stringify(updatePosMsg),
            })
        }
    }

    receiveNpcUpdates(): Client {
        const stompClient = new Client({
            brokerURL: ws_url,
        })
        stompClient.onWebSocketError = (error) => {
            console.log("error", error.message)
        }
        stompClient.onStompError = (frame) => {
            console.log("error", frame.body)
        }

        stompClient.onConnect = (frame) => {
            console.log(`npc id: ${this.npcId} sucessfully connected ws`)
            stompClient.subscribe(DEST, (message) => {
                const npcUpdate: IStompMessage = JSON.parse(message.body)
                this.onMessageReceived(npcUpdate)
            })
        }

        stompClient.onDisconnect = () => {
            console.log("npc ws disconnected")
        }

        stompClient.activate()

        return stompClient
    }

    async onMessageReceived(payload: IStompMessage) {
        console.log(`Npc mit ${this.npcId} hat neue Update Message erhalten ${payload}`)
    }
}
