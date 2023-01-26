import { reactive, readonly } from "vue"
import { IMyMapsListItem } from "../typings/IMyMapsListItem"
import { IMyMapsState } from "../typings/IMyMapsState"

const mapsState = reactive<IMyMapsState>({
    mapslist: Array<IMyMapsListItem>(),
    errormsg: "",
})

//temporary function to test MyMapsList
export function useMyMaps() {
    //let date: Date = new Date(500000);
    for (let i = 0; i < 4; i++) {
        mapsState.mapslist.push({ name: "Karte " + i, datum: "hallo" })
    }

    return {
        mapsList: mapsState,
        test_list: mapsState.mapslist,
    }
}
