import { E_LobbyMode } from "./E_LobbyMode"

export interface ILobbyListItem {
    name:string
    player: number
    gamemode: E_LobbyMode
}