import { Client } from "@stomp/stompjs"
import { reactive, readonly } from "vue"
import { IPosition } from "../../typings/IPosition"
import { CreatePlayerCars } from "../../models/CreatePlayerCars"
import { useGameView } from "./useGameView"
import { routeLocationKey } from "vue-router"
import useUser from "../UserStore"
import useCrossroadData from "./useCrossroadData"
import { IMapObject } from "../streetplaner/IMapObject"
import { NpcCar } from "../../components/3D/NpcCar"

const { gameState } = useGameView()
const { activeLobby } = useUser()
const { crossroadMap } = useCrossroadData()

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/position"
const CREATE_MSG = "/app/position.create"
const DELETE_MSG = "/app/position.delete"
const UPDATE_MSG = "/app/position.update"

const NPC_DEST = "/topic/npc"
const UPDATE_POS_MSG = "/app/npc.updatepos"

const fieldSize = 10

/*Defines the Grid Size in length by the number ob fields*/
let gridSizeX = fieldSize * 30
/*Defines the Grid Size in height by the number ob fields*/
let gridSizeY = fieldSize * 20
/*Map of 3d-model paths*/

let stompClient: Client
let npcStompClient: Client

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
                            console.log("THOMAS IST DAAAA")
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
    stompClient.onWebSocketError = (error) => {
        console.log("error", error.message)
    }
    stompClient.onStompError = (frame) => {
        console.log("error", frame.body)
    }

    stompClient.onConnect = (frame) => {
        console.log(`___NPC WEBSOCKET SUCCESS`)
        stompClient.subscribe(NPC_DEST, (message) => {
            const npcUpdate: INpcStompMessage = JSON.parse(message.body)
            if (npcCarState.npcCarMap.get(npcUpdate.npcInfoResponseDTO!.npcId)!.needsMapEleUpdate) {
                onNpcMessageReceived(npcUpdate)
            }
        })
    }

    stompClient.onDisconnect = () => {
        console.log("npc ws disconnected")
    }

    stompClient.activate()
}

//emits event to backend with current information, so that next map element can be calculated.
function updatePosMessage(npcId: number) {
    console.log("sende Update pos anfrage an backend")
    if (stompClient) {
        let tempCar = npcCarState.npcCarMap.get(npcId)!
        //console.log("vurUpdate", tempCar.nextMapObj)
        const updatePosMsg: INpcStompMessage = {
            npcInfoRequestDTO: {
                mapId: activeLobby.value.mapId,
                npcId: tempCar!.npcId,
                npcRotation: tempCar!.positions.npcRotation,
                currentMapObject: tempCar!.curMapObj,
            },

            type: "POSITION_UPDATE",
        }

        stompClient.publish({
            destination: UPDATE_POS_MSG,
            headers: {},
            body: JSON.stringify(updatePosMsg),
        })
        //gameState.npcCarMapFromuseGameview.get(npcId)!.needsMapEleUpdate = false
        console.log(updatePosMsg)
    }
}

//on update from backend set new values of current mapobj and updated position for corresponding npc car
async function onNpcMessageReceived(payload: INpcStompMessage) {
    console.log(`Npc ${payload.npcInfoResponseDTO!.npcId} hat neues POSITIONSUpdate Message erhalten`)

    if (payload.type === "NEW_POSITION_RECEIVED") {
        console.log(payload)

        const updateNpcCar = npcCarState.npcCarMap.get(payload.npcInfoResponseDTO!.npcId)

        updateNpcCar!.lastCarRotation = updateNpcCar!.positions.npcRotation
        updateNpcCar!.curMapObj = payload.npcInfoResponseDTO!.nextUpperMapObject
        updateNpcCar!.nextMapObj = payload.npcInfoResponseDTO!.nextnextUpperMapObject
        updateNpcCar!.positions.npcRotation = payload.npcInfoResponseDTO!.newGameAssetRotation

        updateNpcCar!.curMapObjCenterCoords.centerX = updateNpcCar!.curMapObj.centerX3d!
        updateNpcCar!.curMapObjCenterCoords.centerZ = updateNpcCar!.curMapObj.centerZ3d!
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
            //check Traffic light statussssssss etwas zu knapp,
            //besser bei nextMapObj abfrageN??
            if (updateNpcCar!.lastCarRotation === 0) {
                //get trafficlight with rotation 2
                rotationOfSearchedTrafficLight = 2
                //check trafficlight status
            } else if (updateNpcCar!.lastCarRotation === 1) {
                //get traffic light with rot 3
                rotationOfSearchedTrafficLight = 3
                //check trafficlight status
            } else if (updateNpcCar!.lastCarRotation === 2) {
                //get traffic light with rot 0
                rotationOfSearchedTrafficLight = 0
            } else if (updateNpcCar!.lastCarRotation === 3) {
                //get traffic light with rot 1
                rotationOfSearchedTrafficLight = 1
            }
            console.log("AMPEL")
            console.log(`Ampel mit Rot: ${rotationOfSearchedTrafficLight} muss abgefragt werden`)
            console.log(
                Array.from(crossroadMap.get(updateNpcCar!.curMapObj.objectId!)!.trafficLights.values())[
                    rotationOfSearchedTrafficLight
                ]
            )

            //check status of this traffic light!
        }

        updateNpcCar!.driving = true
        updateNpcCar!.needsMapEleUpdate = false
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
        console.log("connected")
        stompClient.subscribe(DEST, (message) => {
            const payload: IStompMessage = JSON.parse(message.body)
            if (payload) {
                onMessageReceived(payload)
            }
        })
    }
    stompClient.onDisconnect = () => {
        console.log("disconnected")
    }

    stompClient.activate()
}

function createMessage(message: IPosition) {
    if (message && stompClient) {
        const carMessage: IStompMessage = {
            id: positionState.mapId, // MappID
            type: "CREATE",
            author: positionState.userName,
            content: message, //information des autos
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
    //console.log("payload",payload.content)
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
            // let tempcar = playerCarState.playerCarMap.get(payload.content.id)
            // tempcar?.playerCarPosUpdate(payload.content.x,payload.content.z,payload.content.rotation)
            //console.log("Playercarmap",playerCarState.playerCarMap)
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
                            x: calcAssetCoordinateX(calcCoordinateX(mapObject.y), game_asset.x),
                            z: calcAssetCoordinateZ(calcCoordinateZ(mapObject.x), game_asset.y),
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

function calcAssetCoordinateZ(zCoordCenter: number, yCoordAsset: number) {
    let originZ = zCoordCenter - fieldSize / 2
    let z = originZ + yCoordAsset * fieldSize

    return z
}

function calcCoordinateX(n: number) {
    let x = gridSizeX * -0.5 + n * fieldSize + fieldSize / 2
    //console.log(`GameObj x: ${x}`)
    return x
}

/*Calculates Z coordinates position of loaded Model */
function calcCoordinateZ(n: number) {
    let z = gridSizeY * -0.5 + n * fieldSize + fieldSize / 2
    //console.log(`GameObj z: ${z}`)
    return z
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
