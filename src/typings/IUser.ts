import { ILobby } from "./ILobby"
import { IPlayerPosition } from "./IPlayerPosition"

export default interface IUser {
    userId: number | undefined
    userName: string
    activeLobby: ILobby
    errormessage?: string
    loggedIn?: boolean
    playerPosition: IPlayerPosition
}
