//interface to for DTO's to communicate with backend

import { E_LobbyMode } from "./E_LobbyMode"

export interface IAddLobbyRequestDTO{
    lobbyName:string
    numOfPlayers: number
    lobbyMode: E_LobbyMode
}