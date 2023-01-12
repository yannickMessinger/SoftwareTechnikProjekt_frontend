import { reactive, ref } from "vue"
import { IMapObject } from "../../services/streetplaner/IMapObject"
import { Client } from "@stomp/stompjs"
import { IGameAsset2D } from "../../services/streetplaner/IGameAsset2D"

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/npc"
const UPDATE_POS_MSG = "/app/npc.updatepos"

interface NpcInfo {
    npcId: number
    posX: number
    posZ: number
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

        this.checkMapEleLimit()
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
            //this.updatePosMessage()
        }
    }

    updatePosMessage() {
        if (this.stompClient) {
            const updatePosMsg: IStompMessage = {
                npcContent: {
                    npcId: this.npcId,
                    posX: this.positions.npcPosX,
                    posZ: this.positions.npcPosX,
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

    /*function to activate Websockets on specific destination in backend. 
    Also for errorhandling if connection could not successfully be established.
    If new message is arriving it is passed to onMessageReceived function*/
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
            console.log("npc sucessfully connected ws")
            stompClient.subscribe(DEST, (message) => {
                const lobbyUpdate: IStompMessage = JSON.parse(message.body)
                this.onMessageReceived(lobbyUpdate)
            })
        }

        stompClient.onDisconnect = () => {
            console.log("npc ws disconnected")
        }

        stompClient.activate()

        return stompClient
    }

    /*function that is called if new message is arriving on websocket, looks for message type and
    is performing specific actions depending on message type.
    
    If message tpye if of type "JOIN", the playerlist of this current lobby is updated with the payload for all players that joined the lobby.
    If message is of type "SWITCH_MODE", the lobbymode is changed to the payload content of the message for all players of the lobby.
    */
    async onMessageReceived(payload: IStompMessage) {
        console.log(`Npc mit ${this.npcId} hat neue Update Message erhalten ${payload}`)
    }
}
