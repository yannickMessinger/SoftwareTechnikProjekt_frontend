import { reactive, ref } from "vue"
import { NpcCar } from "../../components/3D/NpcCar"
import { IMapObject } from "../streetplaner/IMapObject"
import useUser from "../UserStore"
import { Client } from "@stomp/stompjs"

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/npc"
const UPDATE_POS_MSG = "/app/npc.updatepos"

let stompClient: Client

const { activeLobby } = useUser()

const mapWidth = ref()
const mapHeight = ref()

/*hardcoded values from GameView need modifying*/
let gridSizeX = 300
let gridSizeY = 200
const fieldSize = 10

/**
 * Gamestate obj with two lists containing necessary MapObjects
 * @param gameMapObjects : complete List of mapobjects, that is passed to Gameview to be rendered.
 * @param mapObjsFromBackEnd : list of mapobjects that have been placed in Editor, fetched from backend. List gameMapObjects is updated with these values
 *
 */
interface IGameState {
    gameMapObjects: IMapObject[]
    mapObjsFromBackEnd: IMapObject[]
    npcCarMapFromuseGameview: Map<number, NpcCar>
    mapId: number
}

/**
 * GameState obj that which gameMapObjects are passed to the 3D view to be rendered.
 * Map Id is not used yet.
 */

const gameState = reactive<IGameState>({
    gameMapObjects: Array<IMapObject>(),
    mapObjsFromBackEnd: Array<IMapObject>(),
    npcCarMapFromuseGameview: new Map<number, NpcCar>(),
    mapId: -1,
})

interface NpcInfo {
    npcId: number
    npcRotation: number
    currentMapObject: IMapObject
    nextUpperMapObject: IMapObject
}

interface NpcInfoResponseDTO {
    newGameAssetRotation: number
    currentMapObject: IMapObject
    nextUpperMapObject: IMapObject
}

interface IStompMessage {
    npcContent: NpcInfo
    type: string
}

export function useGameView() {
    return {
        gameState,
        resetGameMapObjects,
        resetMapObjsFromBackEnd,
        fillGameState,
        updateMapObjsFromGameState,
        setMapWidthAndMapHeight,
        setGameStateSizes,
        setGameStateMapId,
        updatePosMessage,
        receiveNpcUpdates,
    }
}

/**
 * function to set different size properties of game state, maybe usefull for future purposes with variable map size.
 * @param sizeX width
 * @param sizeY height
 * @param fieldSize size of a single map tile (square)
 */
function setGameStateSizes(sizeX: number, sizeY: number, fieldSize: number) {}

/**
 *
 * @param width sets counter variable for loop of function fillGameState
 * @param height sets counter variable for loop of function fillGameState
 * coming from GameView
 */

function setGameStateMapId(mapId: number) {
    gameState.mapId = mapId
}

function setMapWidthAndMapHeight(width: number, height: number) {
    mapWidth.value = width
    mapHeight.value = height
}

/**
 * function to fetch MapObjects from backend that have been placed in MapEditor. Is then used to update gamestate.gameMapObjects.
 * If fetch fails predefined list is set.
 */
export async function updateMapObjsFromGameState() {
    const url = "/api/map/objects"
    const mapId = activeLobby.value.mapId

    try {
        if (mapId === -1) {
            throw new Error("mapID is -1, make sure you are in a lobby.")
        }
        const response = await fetch(`${url}/${mapId}`, { method: "GET" })
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const jsondata = await response.json()
        gameState.mapObjsFromBackEnd = jsondata
        fillGameState()
    } catch (error: any) {
        console.log(error.statusText)
        let json =
            '{"mapObjects":[{"objectTypeId":1,"x":2,"y":9,"rotation":0},{"objectTypeId":0,"x":2,"y":10,"rotation":1},{"objectTypeId":0,"x":2,"y":11,"rotation":1},{"objectTypeId":0,"x":2,"y":12,"rotation":1},{"objectTypeId":0,"x":2,"y":13,"rotation":1},{"objectTypeId":0,"x":2,"y":14,"rotation":1},{"objectTypeId":1,"x":2,"y":15,"rotation":1},{"objectTypeId":0,"x":3,"y":9,"rotation":0},{"objectTypeId":6,"x":3,"y":14,"rotation":0},{"objectTypeId":0,"x":3,"y":15,"rotation":2},{"objectTypeId":0,"x":4,"y":9,"rotation":0},{"objectTypeId":1,"x":4,"y":12,"rotation":0},{"objectTypeId":0,"x":4,"y":13,"rotation":1},{"objectTypeId":0,"x":4,"y":14,"rotation":1},{"objectTypeId":1,"x":4,"y":15,"rotation":2},{"objectTypeId":0,"x":5,"y":9,"rotation":0},{"objectTypeId":0,"x":5,"y":12,"rotation":2},{"objectTypeId":0,"x":6,"y":9,"rotation":0},{"objectTypeId":5,"x":6,"y":10,"rotation":0},{"objectTypeId":0,"x":6,"y":12,"rotation":2},{"objectTypeId":1,"x":7,"y":5,"rotation":0},{"objectTypeId":0,"x":7,"y":6,"rotation":1},{"objectTypeId":0,"x":7,"y":7,"rotation":1},{"objectTypeId":0,"x":7,"y":8,"rotation":1},{"objectTypeId":2,"x":7,"y":9,"rotation":0},{"objectTypeId":0,"x":7,"y":10,"rotation":1},{"objectTypeId":0,"x":7,"y":11,"rotation":1},{"objectTypeId":1,"x":7,"y":12,"rotation":2},{"objectTypeId":1,"x":7,"y":14,"rotation":0},{"objectTypeId":0,"x":7,"y":15,"rotation":1},{"objectTypeId":0,"x":7,"y":16,"rotation":1},{"objectTypeId":1,"x":7,"y":17,"rotation":1},{"objectTypeId":0,"x":8,"y":5,"rotation":2},{"objectTypeId":3,"x":8,"y":8,"rotation":0},{"objectTypeId":0,"x":8,"y":9,"rotation":2},{"objectTypeId":3,"x":8,"y":10,"rotation":0},{"objectTypeId":0,"x":8,"y":14,"rotation":2},{"objectTypeId":0,"x":8,"y":17,"rotation":0},{"objectTypeId":0,"x":9,"y":5,"rotation":2},{"objectTypeId":4,"x":9,"y":8,"rotation":0},{"objectTypeId":0,"x":9,"y":9,"rotation":2},{"objectTypeId":3,"x":9,"y":10,"rotation":0},{"objectTypeId":0,"x":9,"y":14,"rotation":2},{"objectTypeId":0,"x":9,"y":17,"rotation":0},{"objectTypeId":0,"x":10,"y":5,"rotation":2},{"objectTypeId":4,"x":10,"y":8,"rotation":0},{"objectTypeId":0,"x":10,"y":9,"rotation":2},{"objectTypeId":0,"x":10,"y":14,"rotation":2},{"objectTypeId":0,"x":10,"y":17,"rotation":0},{"objectTypeId":1,"x":11,"y":5,"rotation":3},{"objectTypeId":0,"x":11,"y":6,"rotation":1},{"objectTypeId":0,"x":11,"y":7,"rotation":1},{"objectTypeId":0,"x":11,"y":8,"rotation":1},{"objectTypeId":2,"x":11,"y":9,"rotation":0},{"objectTypeId":0,"x":11,"y":10,"rotation":1},{"objectTypeId":0,"x":11,"y":11,"rotation":1},{"objectTypeId":0,"x":11,"y":12,"rotation":1},{"objectTypeId":0,"x":11,"y":13,"rotation":1},{"objectTypeId":2,"x":11,"y":14,"rotation":0},{"objectTypeId":0,"x":11,"y":15,"rotation":1},{"objectTypeId":0,"x":11,"y":16,"rotation":1},{"objectTypeId":1,"x":11,"y":17,"rotation":2},{"objectTypeId":0,"x":12,"y":9,"rotation":0},{"objectTypeId":0,"x":12,"y":14,"rotation":0},{"objectTypeId":0,"x":13,"y":9,"rotation":0},{"objectTypeId":0,"x":13,"y":14,"rotation":0},{"objectTypeId":1,"x":14,"y":9,"rotation":3},{"objectTypeId":0,"x":14,"y":10,"rotation":1},{"objectTypeId":0,"x":14,"y":11,"rotation":1},{"objectTypeId":0,"x":14,"y":12,"rotation":1},{"objectTypeId":0,"x":14,"y":13,"rotation":1},{"objectTypeId":1,"x":14,"y":14,"rotation":2}]}'
        gameState.mapObjsFromBackEnd = JSON.parse(json).mapObjects
    }
}

/**
 * resets the gameMapObject list
 */
export function resetGameMapObjects() {
    gameState.gameMapObjects.splice(0, gameState.gameMapObjects.length)
}

/**
 * resets the mapObjectsFromBackend list
 */
export function resetMapObjsFromBackEnd() {
    gameState.mapObjsFromBackEnd.splice(0, gameState.mapObjsFromBackEnd.length)
}

/**
 * function to generate random numbers between the given min and max values
 * @param min min value for random number
 * @param max value for random numbwer
 * @returns random number
 */
function randomNumer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
/**
 * first fills gameMapObjects list with dummy environment elements with random rotation, each ele is initially equipped with an empty game assets array
 * then for each element of the mapObject from backend, the corresponding index in the gameMapObject list is calculated and the elementwwwww
 * on this index gets replaced with the object from backend.
 */
export function fillGameState(): void {
    let counter = 0
    for (let i = 0; i < mapHeight.value; i++) {
        for (let j = 0; j < mapWidth.value; j++) {
            gameState.gameMapObjects[counter] = {
                objectTypeId: randomNumer(17, 20),
                x: i,
                y: j,
                rotation: randomNumer(0, 3),
                game_assets: [],
            }
            counter += 1
        }
    }
    gameState.npcCarMapFromuseGameview.clear()

    //adds NpcCar instances to Map for each gameasset from backend
    gameState.mapObjsFromBackEnd.forEach((mapObj) => {
        if (mapObj.game_assets.length > 0) {
            mapObj.game_assets.forEach((gameAsset) => {
                if (gameAsset.assetId === null) {
                    let tempId = -1
                    gameState.npcCarMapFromuseGameview.set(
                        tempId,
                        new NpcCar(
                            tempId,
                            gameAsset.x,
                            0,
                            gameAsset.y,
                            gameAsset.rotation,
                            gridSizeX,
                            gridSizeY,
                            fieldSize,
                            mapObj
                        )
                    )
                } else {
                    gameState.npcCarMapFromuseGameview.set(
                        gameAsset.assetId!,
                        new NpcCar(
                            gameAsset.assetId,
                            gameAsset.x,
                            0,
                            gameAsset.y,
                            gameAsset.rotation,
                            gridSizeX,
                            gridSizeY,
                            fieldSize,
                            mapObj
                        )
                    )
                }
            })
        }
        gameState.gameMapObjects[mapObj.x * 30 + mapObj.y] = mapObj
    })
}

//emits event to backend with current information, so that next map element can be calculated.
function updatePosMessage(npcId: number) {
    console.log("sende Update pos anfrage an backend")
    if (stompClient) {
        let tempCar = gameState.npcCarMapFromuseGameview.get(npcId)!
        const updatePosMsg: IStompMessage = {
            npcContent: {
                npcId: tempCar!.npcId,
                npcRotation: tempCar!.positions.npcRotation,
                currentMapObject: tempCar!.curMapObj,
                nextUpperMapObject: tempCar!.nextMapObj,
            },
            type: "POSITION_UPDATE",
        }

        stompClient.publish({
            destination: UPDATE_POS_MSG,
            headers: {},
            body: JSON.stringify(updatePosMsg),
        })
        gameState.npcCarMapFromuseGameview.get(npcId)!.needsMapEleUpdate = false
        console.log(updatePosMsg)
    }
}

//activates Websocket for backend communication
function receiveNpcUpdates() {
    stompClient = new Client({
        brokerURL: ws_url,
    })
    stompClient.onWebSocketError = (error) => {
        console.log("error", error.message)
    }
    stompClient.onStompError = (frame) => {
        console.log("error", frame.body)
    }

    stompClient.onConnect = (frame) => {
        console.log(`use gameview client sucessfully connected ws`)
        stompClient.subscribe(DEST, (message) => {
            const npcUpdate: any = JSON.parse(message.body)
            onMessageReceived(npcUpdate)
        })
    }

    stompClient.onDisconnect = () => {
        console.log("npc ws disconnected")
    }

    stompClient.activate()
}

//on update from backend set new values of current mapobj and updated position for corresponding npc car
async function onMessageReceived(payload: any) {
    //console.log(`Npc mit ${this.npcId} hat neue Update Message erhalten`)
    if (payload.type === "NEW_POSITION_RECEIVED") {
        console.log(payload.nextMapEleInfo)
        const updateNpcCar = gameState.npcCarMapFromuseGameview.get(payload.npcContent.npcId)
        updateNpcCar!.curMapObj = payload.nextMapEleInfo.currentMapObject
        updateNpcCar!.nextMapObj = payload.nextMapEleInfo.nextUpperMapObject
        updateNpcCar!.positions.npcRotation = payload.nextMapEleInfo.newGameAssetRotation
        updateNpcCar!.calcMapEleCenter()
        updateNpcCar!.calcNpcMapLimit()
        //updateNpcCar!.calcPixelPosNpc();
        console.log(
            `pixelpos nach UPDATE npc: x:${updateNpcCar!.positions.npcPosX} z:${updateNpcCar!.positions.npcPosZ}`
        )

        updateNpcCar!.driving = true
        updateNpcCar!.needsMapEleUpdate = false
    }
}
