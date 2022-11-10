import { reactive, readonly } from "vue";
import { ILobbyListItem } from "./interfaces/ILobbyListItem";

export interface ILobbyListState {
    lobbylist: ILobbyListItem[]
}

const lobbyState = reactive<ILobbyListState>({
    lobbylist: Array<ILobbyListItem>()
})

// const lobbyState = reactive<ILobbyListState>({lobbylist: [{name:"Lobby1"}, {name:"Lobby2"}]})

export function useLobbyList(){

    lobbyState.lobbylist.push({name: "test"});
    lobbyState.lobbylist.push({name:"test2"});
    
    return {
        lobbyList: readonly(lobbyState) // state vor unkontrollierten Änderungen von außen schützen
        
    }


}





