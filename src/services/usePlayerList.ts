import { reactive, readonly } from "vue";
import { IPlayerListItem } from "../typings/IPlayerListItem";
import { IPlayerListState } from "../typings/IPlayerListState";


const playerState = reactive<IPlayerListState>({
    playerlist: Array<IPlayerListItem>(),
    errormsg: ""
})

//temporary function to test the PlayerList
export function usePlayerList(){
    for(let i = 0; i < 20; i++){
        playerState.playerlist.push({name: "player" + i});
    }

    return {
        playerList: playerState
    }
}

/*
export function usePlayerList(){
    return {
        playerList: readonly(playerState),
        updatePlayerList,
    }
}
*/

export async function updatePlayerList() {
    console.log("Update PlayerList");
    const url = "/api/player"
    fetch(url)
    .then(resp => {
        if (!resp.ok) {
            console.log("error fetching PlayerList");
            throw new Error(resp.statusText);
        }
        return resp.json();
    })
    .then((jsondata: IPlayerListItem[]) => {
        playerState.playerlist = jsondata
        playerState.errormsg = ""
    })
    .catch(reason => {
        console.log("error in parsing jsondata");
        playerState.errormsg = 'FEHLER: ${reason}'
    })
    
}