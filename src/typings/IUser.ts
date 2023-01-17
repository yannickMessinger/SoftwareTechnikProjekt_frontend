import { ILobby } from "./ILobby"

export default interface IUser {
    userId: number | undefined
    userName: string
    activeLobby: ILobby
    errormessage?: string
    loggedIn?: boolean
}
