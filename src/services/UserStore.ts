import { computed, reactive, readonly } from "vue"
import IUser from "../typings/IUser"
import { E_LobbyMode } from "../typings/E_LobbyMode"
import { ILobby } from "../typings/ILobby"
import { ILoginStateDTO } from "../typings/ILoginStateDTO"
import router from "../router/router"

let reloginTried = false

const state = reactive<IUser>({
    userId: undefined,
    userName: "",
    errormessage: "",
    loggedIn: false,
    activeLobby: {
        lobbyId: -1,
        hostId: -1,
        mapId: -1,
        lobbyName: "",
        numOfPlayers: 0,
        lobbyModeEnum: E_LobbyMode.BUILD_MODE,
        playerList: [],
    },
})

async function retrieveUserFromLocalStorage() {
    const userString = localStorage.getItem("user-e-mobility")
    if (userString) {
        const data = JSON.parse(userString)
        const loginResponse = await login(data.username, data.password)
        if (
            loginResponse?.hasOwnProperty("userId") &&
            loginResponse?.hasOwnProperty("userName")
        ) {
            router.push("/")
        }
    }
}

function setId(id: number): void {
    state.userId = id
}

function setName(name: string): void {
    state.userName = name
}

async function sendName(): Promise<void> {
    const response = await fetch("/api/player", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userName: state.userName,
        }),
    })

    const jsondata = await response.json()
    setId(Number(jsondata))
}

async function register(username: string, password: string): Promise<any> {
    return fetch("/api/player", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            userName: username,
            password: password,
        }),
    })
        .then((response) => {
            if (response.status === 200 || response.status === 400) {
                return response.json()
            } else {
                throw new Error(response.statusText)
            }
        })
        .then((data) => {
            return data
        })
        .catch((err) => console.log(err))
}

async function login(
    username: string,
    password: string
): Promise<{ userId: number; userName: string } | null> {
    return fetch("/api/player/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            userName: username,
            password: password,
        }),
    })
        .then((response) => {
            if (response.status === 200) {
                localStorage.setItem(
                    "user-e-mobility",
                    JSON.stringify({ username, password })
                )
                return response.json()
            }
            if (response.status === 400) {
                return response.json()
            } else {
                throw new Error(response.statusText)
            }
        })
        .then((data) => {
            const loginDataResponse: ILoginStateDTO = data
            setName(loginDataResponse.userName)
            setId(loginDataResponse.userId)
            state.errormessage = ""
            state.loggedIn = true
            return data
        })
        .catch((err) => console.log(err))
}

function logout() {
    localStorage.removeItem("user-e-mobility")
    state.loggedIn = false
    state.errormessage = ""
    state.activeLobby = {
        lobbyId: -1,
        mapId: -1,
        lobbyName: "",
        numOfPlayers: 0,
        lobbyModeEnum: E_LobbyMode.BUILD_MODE,
    }
    setId(-1)
    setName("")
}

//sets active Lobby property of the current User
async function setActiveLobby(lobby: ILobby): Promise<void> {
    state.activeLobby = lobby
}

function updateActiveLobbyPlayerList(players: IUser[]) {
    for (let p of players) {
        state.activeLobby.playerList?.push(p)
    }
    console.log(state.activeLobby.playerList)
}

export default function useUser() {
    if (!state.loggedIn && !reloginTried) {
        reloginTried = true
        retrieveUserFromLocalStorage()
    }
    return {
        logindata: readonly(state),
        name: computed(() => state.userName),
        userId: computed(() => state.userId),
        hostId: computed(() => state.activeLobby.hostId),
        activeLobby: computed(() => state.activeLobby),
        user: readonly<IUser>(state),
        setName,
        setId,
        sendName,
        setActiveLobby,
        login,
        register,
        logout,
        updateActiveLobbyPlayerList,
    }
}
