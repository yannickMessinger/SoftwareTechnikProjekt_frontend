import { reactive, readonly } from "vue";
import { IMyMapsListItem } from "../typings/IMyMapsListitem";
import { IMyMapsState } from "../typings/IMyMapsState";

const mapsState = reactive<IMyMapsState>({
    mapslist: Array<IMyMapsListItem>(),
    errormsg: ""
})

export function useMyMaps(){
    let date: Date = new Date("2019-01-16");
    for(let i = 0; i < 4; i++){
        mapsState.mapslist.push({name: "Karte " + i, datum: date})
    }
    return {
        mapslist: mapsState
    }
}