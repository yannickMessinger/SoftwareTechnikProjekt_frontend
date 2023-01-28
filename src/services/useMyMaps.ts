import { reactive } from "vue"
import { IMyMapsState } from "../typings/IMyMapsState"
import { IAddMyMapsRequestDTO } from "../typings/IAddMyMapsRequestDTO"
import { IMapDTO } from "../typings/IMapDTO"
import useEventBus from "./eventBus"

const mapsState = reactive<IMyMapsState>({
    mapslist: Array<IMapDTO>(),
    errormsg: "",
})

const { emit } = useEventBus()
//temporary function to test MyMapsList
export function useMyMaps() {
    //let date: Date = new Date(500000);
    for (let i = 0; i < 4; i++) {
        mapsState.mapslist.push({ userId: 1, lobbyName: "Karte " + i, date: "hallo" })
    }

    return {
        mapsList: mapsState,
        updateMapsList,
        test_list: mapsState.mapslist,
    }
}

export async function updateMapsList(): Promise<void> {
    const url = "api/map"

    try {
        const response = await fetch(url, {
            method: "GET",
        })

        if (!response.ok) {
            mapsState.errormsg = response.statusText
            mapsState.mapslist = []
            console.log("error in fetching maplist")
            throw new Error(response.statusText)
        }

        const jsondata: IMapDTO[] = await response.json()

        mapsState.mapslist = jsondata
        mapsState.errormsg = ""
    } catch (error) {
        console.log("error in updateMapsList")
    }
}

export async function createNewMap(addUserId: number, addMapName: string) {
    const url = "/api/map"

    const addMap: IAddMyMapsRequestDTO = {
        mapName: addMapName,
        creationDate: new Date(),
        sizeX: 0,
        sizeY: 0,
        mapOwnerId: addUserId,
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addMap),
        })
        let id = await res.json()
        await updateMapsList()
        emit("new-map-event", id)
        return id
    } catch (error) {
        console.log(error)
        return -1
    }

    function getCurrentDate() {
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, "0")
        var mm = String(today.getMonth() + 1).padStart(2, "0")
        var yyyy = today.getFullYear()

        return dd + "/" + mm + "/" + yyyy
    }
}
