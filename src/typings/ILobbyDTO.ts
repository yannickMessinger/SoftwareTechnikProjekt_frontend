import { E_LobbyMode } from "./E_LobbyMode"
import { IPlayerListItem } from "./IPlayerListItem"

export interface ILobbyDTO {
    lobbyID?:number
    hostID?:number
    mapID:number
    lobbyName:string
    numOfPlayers: number
    lobbyModeEnum: E_LobbyMode
    playerList?: IPlayerListItem[]
}