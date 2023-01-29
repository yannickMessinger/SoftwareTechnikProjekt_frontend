import { Client } from "@stomp/stompjs"
import { reactive } from "vue"
import { IPosition } from "../../typings/IPosition"
import { CreatePlayerCars } from "../../models/CreatePlayerCars"
import { useGameView } from "./useGameView"
import useUser from "../UserStore"
import useCrossroadData from "./useCrossroadData"
import { IMapObject } from "../streetplaner/IMapObject"
import { NpcCar } from "../../components/3D/NpcCar"
import { NpcPedestrian } from "../../components/3D/NpcPedestrian"
import { INpcPosition } from "../../typings/INpcPosition"

const { gameState } = useGameView()
const { activeLobby, user } = useUser()
const { crossroadMap } = useCrossroadData()

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/position"
const CREATE_MSG = "/app/position.create"
const DELETE_MSG = "/app/position.delete"
const UPDATE_MSG = "/app/position.update"

const NPC_DEST = "/topic/npc"
const NPC_SET_CLIENT_POS_TOPIC = "/topic/npc/setclientpos"
const UPDATE_POS_MSG = "/app/npc.updatepos"
const SET_CLIENT_POS_MSG = "/app/npc.setclientpos"

const fieldSize = 10

let stompClient: Client
let npcStompClient: Client
let npcPositionClient: Client

interface NpcInfoResponseDTO {
    npcId: number
    newGameAssetRotation: number
    nextUpperMapObject: IMapObject
    nextnextUpperMapObject: IMapObject
}

interface NpcInfoRequestDTO {
    mapId: number
    npcId: number
    npcRotation: number
    currentMapObject: IMapObject
}

interface INpcStompMessage {
    npcInfoRequestDTO: NpcInfoRequestDTO
    npcInfoResponseDTO?: NpcInfoResponseDTO
    npcPositionContent?: INpcPosition
    type: string
}

interface INpcPositionMsg {
    npcPositionContent: INpcPosition
    type: string
}

interface INpcCarState {
    npcCarMap: Map<number, NpcCar>
}
const npcCarState = reactive<INpcCarState>({
    npcCarMap: new Map<number, NpcCar>(),
})

function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function fillNpcCars() {
    npcCarState.npcCarMap.clear()

    //adds NpcCar instances to Map for each gameasset from backend
    gameState.mapObjsFromBackEnd.forEach((mapObj) => {
        if (mapObj.game_assets.length > 0) {
            mapObj.game_assets.forEach((gameAsset) => {
                if (gameAsset.userId === 0) {
                    if (gameAsset.assetId === null) {
                        let tempId = -1
                        npcCarState.npcCarMap.set(
                            tempId,
                            new NpcCar(
                                tempId,
                                gameAsset.objectTypeId,
                                gameAsset.x3d!,
                                gameAsset.z3d!,
                                gameAsset.rotation,
                                fieldSize,
                                mapObj
                            )
                        )
                    } else {
                        if (gameAsset.objectTypeId === 14) {
                            npcCarState.npcCarMap.set(
                                gameAsset.assetId!,
                                new NpcCar(
                                    gameAsset.assetId!,
                                    14,
                                    gameAsset.x3d!,
                                    gameAsset.z3d!,
                                    gameAsset.rotation,
                                    fieldSize,
                                    mapObj
                                )
                            )
                        } else if (gameAsset.objectTypeId >= 50 && gameAsset.objectTypeId < 60) {
                            npcCarState.npcCarMap.set(
                                gameAsset.assetId!,
                                new NpcPedestrian(
                                    gameAsset.assetId!,
                                    randomNumber(50, 59),
                                    gameAsset.x3d!,
                                    gameAsset.z3d!,
                                    gameAsset.rotation,
                                    fieldSize,
                                    mapObj
                                )
                            )
                        } else {
                            npcCarState.npcCarMap.set(
                                gameAsset.assetId!,
                                new NpcCar(
                                    gameAsset.assetId!,
                                    randomNumber(30, 33),
                                    gameAsset.x3d!,
                                    gameAsset.z3d!,
                                    gameAsset.rotation,
                                    fieldSize,
                                    mapObj
                                )
                            )
                        }
                    }
                }
            })
        }
    })
}

//activates Websocket for backend communication
function initNpcSocket() {
    npcStompClient = new Client({
        brokerURL: ws_url,
    })
    npcStompClient.onWebSocketError = (error) => {
        console.log("error", error.message)
    }
    npcStompClient.onStompError = (frame) => {
        console.log("error", frame.body)
    }

    npcStompClient.onConnect = (frame) => {
        npcStompClient.subscribe(NPC_DEST, (message) => {
            const npcUpdate: INpcStompMessage = JSON.parse(message.body)

            if (npcCarState.npcCarMap.get(npcUpdate.npcInfoResponseDTO!.npcId)!.needsMapEleUpdate) {
                onNpcMessageReceived(npcUpdate)
            }
        })
    }

    npcStompClient.onDisconnect = () => {
        console.log("npc ws disconnected")
    }

    npcStompClient.activate()
}
/*
function initNpcPositionSocket() {
    npcPositionClient = new Client({
        brokerURL: ws_url,
    })
    npcPositionClient.onWebSocketError = (error) => {
        console.log("error", error.message)
    }
    npcPositionClient.onStompError = (frame) => {
        console.log("error", frame.body)
    }

    npcPositionClient.onConnect = (frame) => {
        npcPositionClient.subscribe(NPC_SET_CLIENT_POS_TOPIC, (message) => {
            const npcPosUpdate: INpcStompMessage = JSON.parse(message.body)
            if (user.userId !== activeLobby.value.hostId) {
                onNpcPositionMessageReceived(npcPosUpdate)
            }
        })
    }

    npcPositionClient.onDisconnect = () => {
        console.log("npc ws disconnected")
    }

    npcPositionClient.activate()
}*/

//emits event to backend with current information, so that next map element can be calculated.
function updatePosMessage(npcId: number) {
    if (npcStompClient) {
        let tempCar = npcCarState.npcCarMap.get(npcId)!

        const updatePosMsg: INpcStompMessage = {
            npcInfoRequestDTO: {
                mapId: activeLobby.value.mapId,
                npcId: tempCar!.npcId,
                npcRotation: tempCar!.positions.npcRotation,
                currentMapObject: tempCar!.curMapObj,
            },

            type: "POSITION_UPDATE",
        }

        npcStompClient.publish({
            destination: UPDATE_POS_MSG,
            headers: {},
            body: JSON.stringify(updatePosMsg),
        })
    }
}

/*function setClientPosMessage(position: INpcPosition) {
    if (npcStompClient) {
        const setClientPosMsg: INpcPositionMsg = {
            npcPositionContent: {
                npcId: position.npcId,
                npcPosX: position.npcPosX,
                npcPosZ: position.npcPosZ,
                npcRotation: position.npcRotation,
                npcViewRotation: position.npcViewRotation,
            },

            type: "SET_CLIENT_POS",
        }

        npcStompClient.publish({
            destination: SET_CLIENT_POS_MSG,
            headers: {},
            body: JSON.stringify(setClientPosMsg),
        })
    }
}*/

//on update from backend set new values of current mapobj and updated position for corresponding npc car
async function onNpcMessageReceived(payload: INpcStompMessage) {
    if (payload.type === "NEW_POSITION_RECEIVED") {
        const updateNpcCar = npcCarState.npcCarMap.get(payload.npcInfoResponseDTO!.npcId)

        updateNpcCar!.lastCarRotation = updateNpcCar!.positions.npcRotation
        updateNpcCar!.curMapObj = payload.npcInfoResponseDTO!.nextUpperMapObject
        updateNpcCar!.nextMapObj = payload.npcInfoResponseDTO!.nextnextUpperMapObject
        updateNpcCar!.positions.npcRotation = payload.npcInfoResponseDTO!.newGameAssetRotation

        updateNpcCar!.calcNpcMapLimit()

        if (
            payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 0 ||
            payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 12 ||
            payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 9 ||
            payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 11
        ) {
            updateNpcCar!.viewRotation = updateNpcCar!.rotationMap.get(updateNpcCar!.positions.npcRotation)!
        } else if (
            payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 1 ||
            payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 10
        ) {
            updateNpcCar!.calculateCurve()
        } else if (payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 2) {
            updateNpcCar!.calculateIntersection()
            let rotationOfSearchedTrafficLight = -1
            if (updateNpcCar!.lastCarRotation === 0) {
                rotationOfSearchedTrafficLight = 2
            } else if (updateNpcCar!.lastCarRotation === 1) {
                rotationOfSearchedTrafficLight = 3
            } else if (updateNpcCar!.lastCarRotation === 2) {
                rotationOfSearchedTrafficLight = 0
            } else if (updateNpcCar!.lastCarRotation === 3) {
                rotationOfSearchedTrafficLight = 1
            }
        }

        updateNpcCar!.driving = true
        updateNpcCar!.needsMapEleUpdate = false
    }
}

function onNpcPositionMessageReceived(payload: INpcStompMessage) {
    if (payload.type === "SET_CLIENT_POS") {
        if (user.userId !== activeLobby.value.hostId) {
            const updateNpcCar = npcCarState.npcCarMap.get(payload.npcPositionContent!.npcId)
            updateNpcCar!.setClientNpcPosition(
                payload.npcPositionContent!.npcPosX,
                payload.npcPositionContent!.npcPosZ,
                payload.npcPositionContent!.npcRotation,
                payload.npcPositionContent!.npcViewRotation!
            )
        }
    }
}

//------------------------------------------------------------------------------------------------------------------>

interface IPositionState {
    mapObjects: IPosition[]
    errormessage: string
    mapId: number
    userName: string
}

interface IPlayerCarState {
    playerCarMap: Map<number, CreatePlayerCars>
}
const playerCarState = reactive<IPlayerCarState>({
    playerCarMap: new Map<number, CreatePlayerCars>(),
})

const positionState = reactive<IPositionState>({
    mapObjects: Array<IPosition>(),
    errormessage: "",
    mapId: 0,
    userName: "",
})

interface IStompMessage {
    id: number
    type: string
    author: string
    content: IPosition
}

function initCarUpdateWebsocket() {
    stompClient = new Client({ brokerURL: ws_url })

    stompClient.onWebSocketError = (error) => {
        positionState.errormessage = error.message
    }
    stompClient.onStompError = (frame) => {
        positionState.errormessage = frame.body
    }

    stompClient.onConnect = (frame) => {
        stompClient.subscribe(DEST, (message) => {
            const payload: IStompMessage = JSON.parse(message.body)
            if (payload) {
                onMessageReceived(payload)
            }
        })
    }
    stompClient.onDisconnect = () => {}

    stompClient.activate()
}

function createMessage(message: IPosition) {
    if (message && stompClient) {
        const carMessage: IStompMessage = {
            id: positionState.mapId,
            type: "CREATE",
            author: positionState.userName,
            content: message,
        }

        stompClient.publish({
            destination: CREATE_MSG,
            headers: {},
            body: JSON.stringify(carMessage),
        })
    }
}

function deleteMessage(message: IPosition) {
    if (message && stompClient) {
        const carMessage: IStompMessage = {
            id: positionState.mapId,
            type: "DELETE",
            author: positionState.userName,
            content: message,
        }

        stompClient.publish({
            destination: DELETE_MSG,
            headers: {},
            body: JSON.stringify(carMessage),
        })
    }
}

function updateMessage(message: IPosition) {
    if (message && stompClient) {
        const carMessage: IStompMessage = {
            id: positionState.mapId,
            type: "UPDATE",
            author: positionState.userName,
            content: message,
        }

        stompClient.publish({
            destination: UPDATE_MSG,
            headers: {},
            body: JSON.stringify(carMessage),
        })
    }
}

/**
 * handle stomp payload message based on type
 * @param payload message as IStompMessage containing type and content (object position)
 */
function onMessageReceived(payload: IStompMessage) {
    if (positionState.mapId === payload.id) {
        const index = positionState.mapObjects.indexOf(payload.content)
        if (payload.type === "CREATE") {
            if (index < 0) {
                positionState.mapObjects.push(payload.content)
            }
        }
        if (payload.type === "DELETE") {
            if (index > -1) {
                positionState.mapObjects.splice(index, 1)
            }
        }
        if (payload.type === "UPDATE") {
            fillPosition(payload)

            if (index > -1) {
                positionState.mapObjects[index] = payload.content
            }
        }
    }
}

function fillPosition(payload: IStompMessage) {
    positionState.mapObjects.forEach((elePosObj) => {
        if (elePosObj.id === payload.content.id) {
            elePosObj.x = payload.content.x
            elePosObj.z = payload.content.z
            elePosObj.rotation = payload.content.rotation
        }
    })
}
/**
 * fills the PlayerCarState from game state and creates a new Car object
 */
function fillPlayerCarState() {
    gameState.mapObjsFromBackEnd.forEach((mapObject) => {
        if (mapObject.game_assets.length > 0) {
            mapObject.game_assets.forEach((game_asset) => {
                if (game_asset.userId! > 0) {
                    playerCarState.playerCarMap.set(
                        game_asset.userId!,
                        new CreatePlayerCars({
                            id: game_asset.userId!,
                            x: game_asset.x3d!,
                            z: game_asset.z3d!,
                            rotation: [0, 1, 0],
                        })
                    )
                }
            })
        }
    })
    //playerCarState.playerCarMap.set(1, new CreatePlayerCars({ id: 1, x: 0, z: 1, rotation: [0,1,0] })) // remove l8er :D will be later filled with data from set playercars in the editor
    //playerCarState.playerCarMap.set(2, new CreatePlayerCars({ id: 2, x: 1, z: 1, rotation: [0,1,0] }))
}

function calcAssetCoordinateX(xCoordCenter: number, xCoordAsset: number) {
    let originX = xCoordCenter - fieldSize / 2
    let x = originX + xCoordAsset * fieldSize

    return x
}

export function useCarMultiplayer() {
    return {
        positionState,
        initCarUpdateWebsocket,
        createMessage,
        deleteMessage,
        updateMessage,
        fillPlayerCarState,
        playerCarState,
        initNpcSocket,
        fillNpcCars,
        updatePosMessage,
        npcCarState,
        onNpcMessageReceived,
    }
}

function calcAssetCoordinateZ(zCoordCenter: number, yCoordAsset: number) {
    let originZ = zCoordCenter - fieldSize / 2
    let z = originZ + yCoordAsset * fieldSize

    return z
}
