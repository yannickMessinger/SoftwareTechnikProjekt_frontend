//interface for DTO's to receive messages from backend

import { E_LobbyMode } from "./E_LobbyMode"

export interface IGetLobbyResponseDTO {
    lobbyName:string
    numOfPlayers: number
    lobbyMode: E_LobbyMode
    hostID?:number
}