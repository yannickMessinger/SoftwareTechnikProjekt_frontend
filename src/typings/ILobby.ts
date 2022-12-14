//interface for single lobby object, aleady with optional host and playerlist arguments
import { E_LobbyMode } from "./E_LobbyMode"
import IUser from "./IUser"

export interface ILobby {
    lobbyId?:number
    hostID?:number
    mapID:number
    lobbyName:string
    numOfPlayers: number
    lobbyModeEnum: E_LobbyMode
    playerList?: IUser[]
}