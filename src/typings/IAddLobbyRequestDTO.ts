import { E_LobbyMode } from "./E_LobbyMode"

export interface IAddLobbyRequestDTO{
    lobbyName:string
    numOfPlayers: number
    lobbyMode: E_LobbyMode
}