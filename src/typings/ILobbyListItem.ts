import { E_LobbyMode } from "./E_LobbyMode"

export interface ILobbyListItem {
    lobbyName:string
    numOfPlayers: number
    lobbyMode: E_LobbyMode
}