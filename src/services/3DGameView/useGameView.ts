import { reactive, ref } from "vue"
import { IMapObject } from "../streetplaner/IMapObject"
import useUser from "../UserStore"

const { activeLobby } = useUser()

const mapWidth = ref()
const mapHeight = ref()

/**
 * Gamestate obj with two lists containing necessary MapObjects
 * @param gameMapObjects : complete List of mapobjects, that is passed to Gameview to be rendered.
 * @param mapObjsFromBackEnd : list of mapobjects that have been placed in Editor, fetched from backend. List gameMapObjects is updated with these values
 *
 */
interface IGameState {
    gameMapObjects: IMapObject[]
    mapObjsFromBackEnd: IMapObject[]
    sizeX: number
    sizeY: number
    fieldSize: number
    mapId: number
}

/**
 * GameState obj that which gameMapObjects are passed to the 3D view to be rendered.
 * Map Id is not used yet.
 */

const gameState = reactive<IGameState>({
    gameMapObjects: Array<IMapObject>(),
    mapObjsFromBackEnd: Array<IMapObject>(),
    sizeX: -1,
    sizeY: -1,
    fieldSize: -1,
    mapId: -1,
})

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
    }
}

/**
 * function to set different size properties of game state, maybe usefull for future purposes with variable map size.
 * @param sizeX width
 * @param sizeY height
 * @param fieldSize size of a single map tile (square)
 */
function setGameStateSizes(sizeX: number, sizeY: number, fieldSize: number) {
    gameState.sizeX = sizeX
    gameState.sizeY = sizeY
    gameState.fieldSize = fieldSize
}

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
 * then for each element of the mapObject from backend, the corresponding index in the gameMapObject list is calculated and the element
 * on this index gets replaced with the object from backend.
 */
export function fillGameState(): void {
    let counter = 0
    for (let i = 0; i < mapHeight.value; i++) {
        for (let j = 0; j < mapWidth.value; j++) {
            gameState.gameMapObjects[counter] = {
                objectId: -1,
                objectTypeId: randomNumer(17, 20),
                x: i,
                y: j,
                rotation: randomNumer(0, 3),
                game_assets: [],
            }
            counter += 1
        }
    }

    gameState.mapObjsFromBackEnd.forEach((mapObj) => {
        gameState.gameMapObjects[mapObj.x * mapWidth.value + mapObj.y] = mapObj
    })
}
