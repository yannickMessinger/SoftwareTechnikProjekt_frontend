import { Client } from "@stomp/stompjs"
import { reactive, readonly } from "vue"
import { IPosition } from "../../typings/IPosition"
import { CreatePlayerCars } from "../../models/CreatePlayerCars"
import { useGameView } from "./useGameView"
import { routeLocationKey } from "vue-router"

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/position"
const CREATE_MSG = "/app/position.create"
const DELETE_MSG = "/app/position.delete"
const UPDATE_MSG = "/app/position.update"

const fieldSize = 10

/*Defines the Grid Size in length by the number ob fields*/
let gridSizeX = fieldSize * 30
/*Defines the Grid Size in height by the number ob fields*/
let gridSizeY = fieldSize * 20
/*Map of 3d-model paths*/

let stompClient: Client

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

const { gameState } = useGameView()

interface IStompMessage {
    id: number
    type: string
    author: string
    content: IPosition
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
    }
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
    return gridSizeX * -0.5 + n * fieldSize + fieldSize / 2
}

/*Calculates Z coordinates position of loaded Model */
function calcCoordinateZ(n: number) {
    return gridSizeY * -0.5 + n * fieldSize + fieldSize / 2
}
