import { reactive, readonly } from "vue";
import { IPlayerListItem } from "../typings/IPlayerListItem";

export interface IPlayerListState {
    playerlist: IPlayerListItem[]
}

const playerState = reactive<IPlayerListState>({
    playerlist: Array<IPlayerListItem>()
})

export function usePlayerList(){
    for(let i = 0; i < 20; i++){
        playerState.playerlist.push({name: "player" + i});
    }

    return {
        playerList: readonly(playerState)
    }
}