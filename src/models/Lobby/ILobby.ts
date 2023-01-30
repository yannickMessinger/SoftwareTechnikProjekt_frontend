//interface for single lobby object, aleady with optional host and playerlist arguments
import IUser from "../User/IUser"
import { E_LobbyMode } from "./E_LobbyMode"

export interface ILobby {
    lobbyId: number
    hostId?: number
    mapId: number
    lobbyName: string
    numOfPlayers: number
    lobbyModeEnum: E_LobbyMode

    playerList?: IUser[]
}
