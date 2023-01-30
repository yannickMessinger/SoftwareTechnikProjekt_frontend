import { Client } from "@stomp/stompjs"
import { reactive } from "vue"
import { CreatePlayerCars } from "../../models/3D/CreatePlayerCars"
import { useGameView } from "./useGameView"
import useUser from "../User/UserStore"
import { NpcCar } from "../../models/3D/NpcCar"
import { NpcPedestrian } from "../../models/3D/NpcPedestrian"
import { INpcPosition } from "../../models/3D/INpcPosition"
import { IPosition } from "../../models/3D/IPosition"
import { IMapObject } from "../../models/Editor/IMapObject"

const { gameState } = useGameView()
const { activeLobby } = useUser()

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/position"
const CREATE_MSG = "/app/position.create"
const DELETE_MSG = "/app/position.delete"
const UPDATE_MSG = "/app/position.update"

const NPC_DEST = "/topic/npc"
const UPDATE_POS_MSG = "/app/npc.updatepos"
const fieldSize = 10

let stompClient: Client
let npcStompClient: Client
//let npcPositionClient: Client

/**
 * Interfaces for DTO's tjat contain necessary info to communicate with backend
 */

/**
 * interface for DTO that is received from backend and contains
 * @param id id of the npc that requested update and new information is destined to
 * @param newGameAssetRotation new rotation of npc
 * @param nextUpperMapObject replaces current mapObject of npc
 * @param nextnextUpperMapObject next upper mapObject based on current mapObject
 */
interface NpcInfoResponseDTO {
    npcId: number
    newGameAssetRotation: number
    nextUpperMapObject: IMapObject
    nextnextUpperMapObject: IMapObject
}

/**
 * interface to send navigation update request to backend
 * @param mapId id of map that npc is currently moving on
 * @param npcId id of the npc that requested update
 * @param npcRotation current rotation of the npc
 * @param currentMapObject current mapObject that npc is currently on and reached the limit of.
 */
interface NpcInfoRequestDTO {
    mapId: number
    npcId: number
    npcRotation: number
    currentMapObject: IMapObject
}

/**
 * interface for stomp message to be published via stompbroker.
 * @param npcInfoRequestDTO please see description of interface for npcInfoRequestDTO
 * @param npcInfoResponseDTO please see description of interface for npcInfoResponseDTO
 * @param npcPositionContent object that contains infos of the current pixelposition of the npc
 * @param type type of the broker msg
 */
interface INpcStompMessage {
    npcInfoRequestDTO: NpcInfoRequestDTO
    npcInfoResponseDTO?: NpcInfoResponseDTO
    npcPositionContent?: INpcPosition
    type: string
}

/**
 * interface for messages that contains infos of the current pixelposition of the npc
 */

interface INpcPositionMsg {
    npcPositionContent: INpcPosition
    type: string
}

/**
 * interface for state object that contains all npc objects.
 * @param npcMap datatype Map, key: id of the npc from backend, value: the instance of the Npc itself.
 */
interface INpcState {
    npcMap: Map<number, NpcCar>
}
const npcState = reactive<INpcState>({
    npcMap: new Map<number, NpcCar>(),
})

/**
 *
 * @param min min value of random number
 * @param max max value of given number
 * @returns random number between the intervall of passed min and max value
 */
function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * method to fill npcMap object of npcState. Iterates over each map Object of gameState mapObjects and
 * checks if GameAsset arrays contain assets. If so, Array gets iterated and for each value, a new npc is
 * instance is added to the npcMap object. Based on the objectTypeId, correct instance is choosen from npc subclass.
 */
function fillNpcState() {
    npcState.npcMap.clear()

    //adds NpcCar instances to Map for each gameasset from backend
    gameState.mapObjsFromBackEnd.forEach((mapObj) => {
        if (mapObj.game_assets.length > 0) {
            mapObj.game_assets.forEach((gameAsset: any) => {
                if (gameAsset.userId === 0) {
                    if (gameAsset.assetId === null) {
                        let tempId = -1
                        npcState.npcMap.set(
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
                            npcState.npcMap.set(
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
                            npcState.npcMap.set(
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
                            npcState.npcMap.set(
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

/**
 * activates Websocket for backend communication
 * with given parameters
 */
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

            if (npcState.npcMap.get(npcUpdate.npcInfoResponseDTO!.npcId)!.needsMapEleUpdate) {
                onNpcMessageReceived(npcUpdate)
            }
        })
    }

    npcStompClient.onDisconnect = () => {
        console.log("npc ws disconnected")
    }

    npcStompClient.activate()
}

/**
 * emits event to backend with current npc information, so that next map element can be calculated
 * @param npcId id of npc object that needs update of its informations.
 */
function updatePosMessage(npcId: number) {
    if (npcStompClient) {
        let tempCar = npcState.npcMap.get(npcId)!

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

/**
 * on update from backend set new values of current mapobj and updated position for corresponding npc car
 * @param payload message that is received from backend and contains new position infos
 * first the parameters of ne npc cars are set to the new received payload values
 * then based on objectTypeId of reveived new MapObject, further actions are necessary.
 * if new MapObject is curve or intersections, intern calculation methods of the npc are triggered to induce correct driving behaviour.
 * In addition, if next mapObjects contains traffic lights the correct traffic light that is facing the npc is calculated and further actions could be
 * taken based on the current state of the traffic light.
 */
async function onNpcMessageReceived(payload: INpcStompMessage) {
    if (payload.type === "NEW_POSITION_RECEIVED") {
        const updateNpcCar = npcState.npcMap.get(payload.npcInfoResponseDTO!.npcId)

        //updating npc values with received info
        updateNpcCar!.lastCarRotation = updateNpcCar!.positions.npcRotation
        updateNpcCar!.curMapObj = payload.npcInfoResponseDTO!.nextUpperMapObject
        updateNpcCar!.nextMapObj = payload.npcInfoResponseDTO!.nextnextUpperMapObject
        updateNpcCar!.positions.npcRotation = payload.npcInfoResponseDTO!.newGameAssetRotation

        updateNpcCar!.calcNpcMapLimit()

        //checking objectTapeId of new mapobject to induce correct driving behaviour
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

            //calculate correct traffic light that is facing the npc
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

/*
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
}*/

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
            mapObject.game_assets.forEach((game_asset: any) => {
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
        fillNpcState,
        updatePosMessage,
        npcState,
        onNpcMessageReceived,
    }
}

/**
 * methods that were designed to add additional websockets an distribute position informations of npcs.
 */
/*
const SET_CLIENT_POS_MSG = "/app/npc.setclientpos"
const NPC_SET_CLIENT_POS_TOPIC = "/topic/npc/setclientpos"

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
