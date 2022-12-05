//interface for single lobby object, aleady with optional host and playerlist arguments
import { E_LobbyMode } from "./E_LobbyMode"
import { IPlayerListItem } from "./IPlayerListItem"

export interface ILobby {
    lobbyId: number,
    lobbyName:string
    numOfPlayers: number
    lobbyModeEnum: E_LobbyMode
    hostID?:string
    playerList?: IPlayerListItem[]
}