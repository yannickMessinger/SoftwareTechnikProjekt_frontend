import { computed, reactive, readonly } from "vue"
import { IPlayerListState } from "../typings/IPlayerListState"
import IUser from "../typings/IUser"
import useUser from "./UserStore"

const { activeLobby } = useUser()
const playerState = reactive<IPlayerListState>({
    playerlist: Array<IUser>(),
    errormsg: "",
})

/**
 * fetches the playerlist of the active lobby which is saved in the UserStore under activeLobby
 */
export async function fetchPlayerList(): Promise<void> {
    const response = await fetch(
        `/api/lobby/get_players/${activeLobby.value?.lobbyId}`,
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
