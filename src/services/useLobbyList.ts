import { reactive, readonly } from "vue";
import { ILobbyListItem } from "../typings/ILobbyListItem";

export interface ILobbyListState {
    lobbylist: ILobbyListItem[]
}

const lobbyState = reactive<ILobbyListState>({
    lobbylist: Array<ILobbyListItem>()
})

// const lobbyState = reactive<ILobbyListState>({lobbylist: [{name:"Lobby1"}, {name:"Lobby2"}]})

export function useLobbyList(){

    lobbyState.lobbylist.push({name: "test", gamemode: "build", player: 4});
    lobbyState.lobbylist.push({name: "lobby2", gamemode: "play", player: 14});

    lobbyState.lobbylist.push({name: "test", gamemode: "build", player: 4});
    lobbyState.lobbylist.push({name: "lobby2", gamemode: "play", player: 14});

    lobbyState.lobbylist.push({name: "test", gamemode: "build", player: 4});
    lobbyState.lobbylist.push({name: "lobby2", gamemode: "play", player: 14});
    
    return {
        lobbyList: readonly(lobbyState) // state vor unkontrollierten Änderungen von außen schützen
        
    }


}





