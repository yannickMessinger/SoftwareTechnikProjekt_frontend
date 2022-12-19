/**
 *Data class to fetch and update the List of existing Lobbys
 */

import { reactive, readonly } from "vue"
import { IAddLobbyRequestDTO } from "../typings/IAddLobbyRequestDTO"
import { ILobby } from "../typings/ILobby"
import { E_LobbyMode } from "../typings/E_LobbyMode"
import { ILobbyListState } from "../typings/ILobbyListState"
import useUser from "./UserStore"
import { ILobbyDTO } from "../typings/ILobbyDTO"

const { userID } = useUser()

const lobbyState = reactive<ILobbyListState>({
    lobbylist: Array<ILobbyDTO>(),
    errormsg: "",
})

const activeLobbyState = reactive<ILobbyDTO>({
    lobbyID: -1,
    hostID: -1,
    mapID: -1,
    lobbyName: "",
    numOfPlayers: -1,
    lobbyModeEnum: E_LobbyMode.BUILD_MODE,
})

export function useLobbyList() {
    return {
        lobbyList: lobbyState,
        activeLobbyState: activeLobbyState,
        updateLobbyList,
        updateLobby,
    }
}

//functions to fetch and update List of available lobbys from backend
export async function updateLobbyList(): Promise<void> {
    const url = "/api/lobby"

    try {
        const response = await fetch(url, {
            method: "GET",
        })

        if (!response.ok) {
            lobbyState.errormsg = response.statusText
            lobbyState.lobbylist = []
            console.log("error in fetching lobbylist")
            throw new Error(response.statusText)
        }

        const jsondata: ILobbyDTO[] = await response.json()
        console.log("JSONDATA")
        console.log(jsondata)

        lobbyState.lobbylist = jsondata
        lobbyState.errormsg = ""
    } catch (error) {
        console.log(" error in updateLobbyList")
    }
}

export async function updateLobby(id: number) {
    const url = "/api/lobby"

    try {
        const response = await fetch(`${url}/${id}`, { method: "GET" })
        if (!response.ok) {
            console.log("can't get active lobby")
        }
        const jsondata: ILobbyDTO = await response.json()
        activeLobbyState.hostID = jsondata.hostID
        activeLobbyState.lobbyID = jsondata.lobbyID
        activeLobbyState.lobbyModeEnum = jsondata.lobbyModeEnum
        activeLobbyState.lobbyName = jsondata.lobbyName
        activeLobbyState.mapID = jsondata.mapID
        activeLobbyState.numOfPlayers = jsondata.numOfPlayers
        activeLobbyState.playerList = jsondata.playerList
    } catch (error) {
        console.log(error)
    }
}

//adds new lobby and sends it to backend, then update of lobbylist
export async function createNewLobby(
    addLobbyName: string,
    addNumOfPlayers: number,
    addLobbyMode: E_LobbyMode
) {
    console.log(`User ID from useLobbyList  ${userID.value}`)
    const url = "/api/lobby"

    const addLobby: IAddLobbyRequestDTO = {
        lobbyName: addLobbyName,
        numOfPlayers: addNumOfPlayers,
        lobbyModeEnum: addLobbyMode,
        hostID: userID.value,
    }

    console.log(addLobby)

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addLobby),
        })
        let id = await res.json()
        updateLobby(id)

        await updateLobbyList()
    } catch (error) {
        console.log(error)
    }
}
