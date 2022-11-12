import { reactive, readonly } from "vue";
import { IPlayerListItem } from "./interfaces/IPlayerListItem";

export interface IPlayerListState {
    playerlist: IPlayerListItem[]
}

const playerState = reactive<IPlayerListState>({
    playerlist: Array<IPlayerListItem>()
})

export function usePlayerList(){
    playerState.playerlist.push({name: "player1"});
    playerState.playerlist.push({name: "player2"});

    return {
        playerList: readonly(playerState)
    }
}