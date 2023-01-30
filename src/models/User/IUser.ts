import { ILobby } from "../Lobby/ILobby"

export default interface IUser {
    userId: number
    userName: string
    activeLobby: ILobby
    errormessage?: string
    loggedIn?: boolean
}
