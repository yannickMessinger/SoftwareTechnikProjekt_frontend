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

    lobbyState.lobbylist.push({name: "lobby1", gamemode: "build", player: 4});
    lobbyState.lobbylist.push({name: "lobby2", gamemode: "play", player: 7});
    lobbyState.lobbylist.push({name: "lobby3", gamemode: "build", player: 10});
    lobbyState.lobbylist.push({name: "lobby4", gamemode: "build", player: 4});
    lobbyState.lobbylist.push({name: "lobby5", gamemode: "play", player: 7});
    lobbyState.lobbylist.push({name: "lobby6", gamemode: "build", player: 10});
    lobbyState.lobbylist.push({name: "lobby7", gamemode: "build", player: 4});
    lobbyState.lobbylist.push({name: "lobby8", gamemode: "play", player: 7});
    lobbyState.lobbylist.push({name: "lobby9", gamemode: "build", player: 10});
    
    
    return {
        lobbyList: readonly(lobbyState) // state vor unkontrollierten Änderungen von außen schützen
        
    }


}





