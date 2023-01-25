import { E_LobbyMode } from "./E_LobbyMode"
import IUser from "./IUser"

export interface ILobbyDTO {
    lobbyId: number
    hostId?: number
    mapId: number
    lobbyName: string
    numOfPlayers: number
    lobbyModeEnum: E_LobbyMode
    playerList?: IUser[]
}
