/**
 * imports
 */
import { reactive } from "vue"
import { IMapObject } from "../../models/Editor/IMapObject"
import { StreetGridDTO } from "../../models/Editor/StreetGridDTO"

/**
 * define reactive streetGridDTO
 */
const streetGridDTO = reactive({ mapObjects: Array<IMapObject>() })

export function useStreetGridList() {
    return {
        streetGridDTO: streetGridDTO,
        updateStreetGridList,
        resetMapEles,
    }
}

/**
 * updates streetGridDTO with map objects of map with mapID
 */
export async function updateStreetGridList(mapId: number) {
    const url = "/api/map/objects"

    try {
        if (mapId === -1) {
            throw new Error("mapID is -1, make sure you are in a lobby.")
        }
        const response = await fetch(`${url}/${mapId}`, { method: "GET" })
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const jsondata = await response.json()
        streetGridDTO.mapObjects = jsondata
    } catch (error: any) {
        console.log(error.statusText)
        let json =
            '{"mapObjects":[{"objectTypeId":1,"x":2,"y":9,"rotation":0},{"objectTypeId":0,"x":2,"y":10,"rotation":1},{"objectTypeId":0,"x":2,"y":11,"rotation":1},{"objectTypeId":0,"x":2,"y":12,"rotation":1},{"objectTypeId":0,"x":2,"y":13,"rotation":1},{"objectTypeId":0,"x":2,"y":14,"rotation":1},{"objectTypeId":1,"x":2,"y":15,"rotation":1},{"objectTypeId":0,"x":3,"y":9,"rotation":0},{"objectTypeId":6,"x":3,"y":14,"rotation":0},{"objectTypeId":0,"x":3,"y":15,"rotation":2},{"objectTypeId":0,"x":4,"y":9,"rotation":0},{"objectTypeId":1,"x":4,"y":12,"rotation":0},{"objectTypeId":0,"x":4,"y":13,"rotation":1},{"objectTypeId":0,"x":4,"y":14,"rotation":1},{"objectTypeId":1,"x":4,"y":15,"rotation":2},{"objectTypeId":0,"x":5,"y":9,"rotation":0},{"objectTypeId":0,"x":5,"y":12,"rotation":2},{"objectTypeId":0,"x":6,"y":9,"rotation":0},{"objectTypeId":5,"x":6,"y":10,"rotation":0},{"objectTypeId":0,"x":6,"y":12,"rotation":2},{"objectTypeId":1,"x":7,"y":5,"rotation":0},{"objectTypeId":0,"x":7,"y":6,"rotation":1},{"objectTypeId":0,"x":7,"y":7,"rotation":1},{"objectTypeId":0,"x":7,"y":8,"rotation":1},{"objectTypeId":2,"x":7,"y":9,"rotation":0},{"objectTypeId":0,"x":7,"y":10,"rotation":1},{"objectTypeId":0,"x":7,"y":11,"rotation":1},{"objectTypeId":1,"x":7,"y":12,"rotation":2},{"objectTypeId":1,"x":7,"y":14,"rotation":0},{"objectTypeId":0,"x":7,"y":15,"rotation":1},{"objectTypeId":0,"x":7,"y":16,"rotation":1},{"objectTypeId":1,"x":7,"y":17,"rotation":1},{"objectTypeId":0,"x":8,"y":5,"rotation":2},{"objectTypeId":3,"x":8,"y":8,"rotation":0},{"objectTypeId":0,"x":8,"y":9,"rotation":2},{"objectTypeId":3,"x":8,"y":10,"rotation":0},{"objectTypeId":0,"x":8,"y":14,"rotation":2},{"objectTypeId":0,"x":8,"y":17,"rotation":0},{"objectTypeId":0,"x":9,"y":5,"rotation":2},{"objectTypeId":4,"x":9,"y":8,"rotation":0},{"objectTypeId":0,"x":9,"y":9,"rotation":2},{"objectTypeId":3,"x":9,"y":10,"rotation":0},{"objectTypeId":0,"x":9,"y":14,"rotation":2},{"objectTypeId":0,"x":9,"y":17,"rotation":0},{"objectTypeId":0,"x":10,"y":5,"rotation":2},{"objectTypeId":4,"x":10,"y":8,"rotation":0},{"objectTypeId":0,"x":10,"y":9,"rotation":2},{"objectTypeId":0,"x":10,"y":14,"rotation":2},{"objectTypeId":0,"x":10,"y":17,"rotation":0},{"objectTypeId":1,"x":11,"y":5,"rotation":3},{"objectTypeId":0,"x":11,"y":6,"rotation":1},{"objectTypeId":0,"x":11,"y":7,"rotation":1},{"objectTypeId":0,"x":11,"y":8,"rotation":1},{"objectTypeId":2,"x":11,"y":9,"rotation":0},{"objectTypeId":0,"x":11,"y":10,"rotation":1},{"objectTypeId":0,"x":11,"y":11,"rotation":1},{"objectTypeId":0,"x":11,"y":12,"rotation":1},{"objectTypeId":0,"x":11,"y":13,"rotation":1},{"objectTypeId":2,"x":11,"y":14,"rotation":0},{"objectTypeId":0,"x":11,"y":15,"rotation":1},{"objectTypeId":0,"x":11,"y":16,"rotation":1},{"objectTypeId":1,"x":11,"y":17,"rotation":2},{"objectTypeId":0,"x":12,"y":9,"rotation":0},{"objectTypeId":0,"x":12,"y":14,"rotation":0},{"objectTypeId":0,"x":13,"y":9,"rotation":0},{"objectTypeId":0,"x":13,"y":14,"rotation":0},{"objectTypeId":1,"x":14,"y":9,"rotation":3},{"objectTypeId":0,"x":14,"y":10,"rotation":1},{"objectTypeId":0,"x":14,"y":11,"rotation":1},{"objectTypeId":0,"x":14,"y":12,"rotation":1},{"objectTypeId":0,"x":14,"y":13,"rotation":1},{"objectTypeId":1,"x":14,"y":14,"rotation":2}]}'
        streetGridDTO.mapObjects = JSON.parse(json).mapObjects
    }
}

/**
 * posts map objects of dto (StreetGridDTO of map with mapID) to backend
 */
export async function postStreetGrid(mapId: number, dto: StreetGridDTO) {
    const url = "/api/mapobject"
    let jsonstring = JSON.stringify(dto)
    try {
        const response = await fetch(`${url}/${mapId}`, {
            method: "POST",
            body: jsonstring,
            headers: { "Content-Type": "application/json;" },
        })
        if (!response.ok) {
            throw new Error(response.statusText)
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * removes all mapObjects from streetGridDTO
 */
export function resetMapEles() {
    streetGridDTO.mapObjects.splice(0, streetGridDTO.mapObjects.length)
}
