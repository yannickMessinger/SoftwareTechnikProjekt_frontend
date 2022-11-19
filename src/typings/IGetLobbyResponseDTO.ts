import { E_LobbyMode } from "./E_LobbyMode"

export interface IGetLobbyResponseDTO {
    lobbyName:string
    numOfPlayers: number
    lobbyMode: E_LobbyMode
}