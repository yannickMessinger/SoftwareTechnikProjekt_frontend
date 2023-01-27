import { reactive, ref } from "vue"
import { NpcCar } from "../../components/3D/NpcCar"
import { IMapObject } from "../streetplaner/IMapObject"
import useUser from "../UserStore"
import { Client } from "@stomp/stompjs"
import useCrossroadData from "./useCrossroadData"
import { NpcPedestrian } from "../../components/3D/NpcPedestrian"

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/npc"
const UPDATE_POS_MSG = "/app/npc.updatepos"
const INIT_NEXT_MAP_ELE_MSG = "/app/npc.initpos"

let stompClient: Client

const { activeLobby } = useUser()
const { crossroadMap } = useCrossroadData()

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
    npcCarMapFromuseGameview: Map<number, NpcCar | NpcPedestrian>
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
    //nextUpperMapObject: IMapObject
}

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

interface IStompMessage {
    npcInfoRequestDTO: NpcInfoRequestDTO
    npcInfoResponseDTO?: NpcInfoResponseDTO
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
        randomNumber
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
    console.log(`setze gameState Mapid auf ${mapId}`)
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
function randomNumber(min: number, max: number) {
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
                objectId: -1,
                objectTypeId: randomNumber(17, 20),
                x: i,
                y: j,
                rotation: randomNumber(0, 3),
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
                if (gameAsset.userId === 0) {
                    if (gameAsset.assetId === null) {
                        let tempId = -1
                        gameState.npcCarMapFromuseGameview.set(
                            tempId,
                            new NpcCar(
                                tempId,
                                gameAsset.objectTypeId,
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
                        if(gameAsset.objectTypeId === 14){
                            console.log("THOMAS IST DAAAA")
                            gameState.npcCarMapFromuseGameview.set(
                                gameAsset.assetId!,
                                new NpcCar(
                                    gameAsset.assetId!,
                                    14,
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
                            
                        } else if (gameAsset.objectTypeId >  49 && gameAsset.objectTypeId < 60) {
                            console.log("Fussgaenger sind da")
                            gameState.npcCarMapFromuseGameview.set(
                                gameAsset.assetId!,
                                new NpcPedestrian(
                                    gameAsset.assetId!,
                                    gameAsset.objectTypeId,
                                    gameAsset.x,
                                    0.2,
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
                                    gameAsset.assetId!,
                                    randomNumber(30, 33),
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
                        
                    }
                }
            })
        }

        gameState.gameMapObjects[mapObj.x * 30 + mapObj.y] = mapObj
        console.log(gameState.npcCarMapFromuseGameview)
    })
}

//emits event to backend with current information, so that next map element can be calculated.
function updatePosMessage(npcId: number) {
    console.log("sende Update pos anfrage an backend")
    if (stompClient) {
        let tempCar = gameState.npcCarMapFromuseGameview.get(npcId)!
        console.log("vurUpdate", tempCar.nextMapObj)
        const updatePosMsg: IStompMessage = {
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
            const npcUpdate: IStompMessage = JSON.parse(message.body)
            if (gameState.npcCarMapFromuseGameview.get(npcUpdate.npcInfoResponseDTO!.npcId)!.needsMapEleUpdate) {
                onMessageReceived(npcUpdate)
            }
        })
    }

    stompClient.onDisconnect = () => {
        console.log("npc ws disconnected")
    }

    stompClient.activate()
}

//on update from backend set new values of current mapobj and updated position for corresponding npc car
async function onMessageReceived(payload: IStompMessage) {
    console.log(`Npc ${payload.npcInfoResponseDTO!.npcId} hat neues POSITIONSUpdate Message erhalten`)

    if (payload.type === "NEW_POSITION_RECEIVED") {
        console.log(payload)

        const updateNpcCar = gameState.npcCarMapFromuseGameview.get(payload.npcInfoResponseDTO!.npcId)

        updateNpcCar!.lastCarRotation = updateNpcCar!.positions.npcRotation
        updateNpcCar!.curMapObj = payload.npcInfoResponseDTO!.nextUpperMapObject
        updateNpcCar!.nextMapObj = payload.npcInfoResponseDTO!.nextnextUpperMapObject
        updateNpcCar!.positions.npcRotation = payload.npcInfoResponseDTO!.newGameAssetRotation

        updateNpcCar!.calcMapEleCenter()
        updateNpcCar!.calcNpcMapLimit()

        if (payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 0 || payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 12 || payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 9 || payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 11) {
            updateNpcCar!.viewRotation = updateNpcCar!.rotationMap.get(updateNpcCar!.positions.npcRotation)!
        } else if (payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 1 || payload.npcInfoResponseDTO!.nextUpperMapObject.objectTypeId === 10) {
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
    } else if (payload.type === "INIT_NEXT_MAP_ELE") {
        console.log(`initiales setzen des naechsten Map Eles für npc mit id:${payload.npcInfoResponseDTO!.npcId}`)
    }
}
