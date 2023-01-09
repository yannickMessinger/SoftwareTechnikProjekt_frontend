import { computed, reactive, readonly } from "vue"
import { E_LobbyMode } from "../typings/E_LobbyMode"
import { IPlayerListState } from "../typings/IPlayerListState"
import IUser from "../typings/IUser"
import useUser from "./UserStore"

const { logindata } = useUser();
const playerState = reactive<IPlayerListState>({
    playerlist: Array<IUser>(),
    errormsg: "",
})

/**
 * fetches the playerlist of the active lobby which is saved in the UserStore under activeLobby
 */
export async function fetchPlayerList(): Promise<void> {
    const response = await fetch(
        `/api/lobby/get_players/${logindata.activeLobby.lobbyId}`,
        {
            method: "GET",
        }
    )
    const result = await response.json()
    console.log("fetch playerlist response", result)
    for (let i of result) {
        playerState.playerlist.push({
            userId: i.userId,
            userName: i.userName,
            loggedIn: true,
            errormessage: "",
            activeLobby: {
                lobbyId: -1,
                mapId: -1,
                lobbyName: "",
                numOfPlayers: 0,
                lobbyModeEnum: E_LobbyMode.BUILD_MODE,
            },
        })
    }
    console.log("playerState", playerState)
}

export async function updatePlayerList() {
    console.log("Update PlayerList")
    const url = "/api/player"
    fetch(url)
        .then((resp) => {
            if (!resp.ok) {
                console.log("error fetching PlayerList")
                throw new Error(resp.statusText)
            }
            return resp.json()
        })
        .then((jsondata: IUser[]) => {
            playerState.playerlist = jsondata
            playerState.errormsg = ""
        })
        .catch((reason) => {
            console.log("error in parsing jsondata")
            playerState.errormsg = "FEHLER: ${reason}"
        })
}

export function usePlayerList() {
    return {
        playerListState: readonly(playerState),
        playerList: computed(() => playerState.playerlist),
        fetchPlayerList,
        updatePlayerList,
    }
}
