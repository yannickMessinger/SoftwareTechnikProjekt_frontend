import { ILobby } from "../typings/ILobby";

export default interface User {
    id: number | undefined,
    username: string,
    activeLobby: ILobby
}
