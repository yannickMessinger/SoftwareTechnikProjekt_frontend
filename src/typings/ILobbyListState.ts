//interface for reactive LobbyList data object in useLobbyList service class
import { ILobby } from "./ILobby"

export interface ILobbyListState {
    lobbylist: ILobby[]
    errormsg : string
    
}