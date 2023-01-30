import IUser from "../User/IUser"
import { E_LobbyMode } from "./E_LobbyMode"

export interface ILobbyDTO {
    lobbyId: number
    hostId?: number
    mapId: number
    lobbyName: string
    numOfPlayers: number
    lobbyModeEnum: E_LobbyMode
    playerList?: IUser[]
}
