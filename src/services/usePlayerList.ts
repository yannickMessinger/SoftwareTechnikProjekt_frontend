import { reactive, readonly } from "vue";
import { IPlayerListItem } from "../typings/IPlayerListItem";

export interface IPlayerListState {
    playerlist: IPlayerListItem[]
}

const playerState = reactive<IPlayerListState>({
    playerlist: Array<IPlayerListItem>()
})

export function usePlayerList(){
    playerState.playerlist.push({name: "player1"});
    playerState.playerlist.push({name: "player2"});
    playerState.playerlist.push({name: "player3"});
    playerState.playerlist.push({name: "player4"});
    playerState.playerlist.push({name: "player5"});
    playerState.playerlist.push({name: "player6"});
    playerState.playerlist.push({name: "player7"});
    playerState.playerlist.push({name: "player8"});
    playerState.playerlist.push({name: "player9"});

    return {
        playerList: readonly(playerState)
    }
}