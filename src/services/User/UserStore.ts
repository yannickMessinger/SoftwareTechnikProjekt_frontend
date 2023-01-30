import { computed, reactive, readonly } from "vue"
import { E_LobbyMode } from "../../models/Lobby/E_LobbyMode"
import { ILobby } from "../../models/Lobby/ILobby"
import { ILobbyDTO } from "../../models/Lobby/ILobbyDTO"
import { ILoginStateDTO } from "../../models/Login/ILoginStateDTO"
import { IGetPlayerWALResponseDTO } from "../../models/User/IGetPlayerWALResponseDTO"
import IUser from "../../models/User/IUser"
import router from "../../router/router"

let reloginTried = false

/**
 * Represents the state of a user.
 * 
 * @typedef {Object} IUser
 * @property {number} userId - The user's unique identifier.
 * @property {string} userName - The user's name.
 * @property {string} errormessage - An error message, if any.
 * @property {boolean} loggedIn - Whether the user is logged in or not.
 * @property {Object} activeLobby - The user's current active lobby.
 * @property {number} activeLobby.lobbyId - The lobby's unique identifier.
 * @property {number} activeLobby.hostId - The host's unique identifier.
 * @property {number} activeLobby.mapId - The map's unique identifier.
 * @property {string} activeLobby.lobbyName - The lobby's name.
 * @property {number} activeLobby.numOfPlayers - The number of players in the lobby.
 * @property {E_LobbyMode} activeLobby.lobbyModeEnum - The mode of the lobby.
 * @property {Array} activeLobby.playerList - The list of players in the lobby.
 */
const state = reactive<IUser>({
    userId: 0,
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

/**
 * @function
 * @async
 * Retrieves the user data from local storage and logs the user in.
 * If the user data exists and the login is successful, the user is redirected to the appropriate page (either lobby or lobbyview).
*/
async function retrieveUserFromLocalStorage() {
    const userString = localStorage.getItem("user-e-mobility")
    if (userString) {
        const data = JSON.parse(userString)
        const loginResponse = await login(data.username, data.password)
        if (loginResponse?.hasOwnProperty("userId") && loginResponse?.hasOwnProperty("userName")) {
            await getActiveLobbyOfPlayerDB()
            if (state.activeLobby.lobbyId != -1) {
                router.push("/lobbyview")
            } else {
                router.push("/lobby")
            }
        }
    }
}

function setId(id: number): void {
    state.userId = id
}

function setName(name: string): void {
    state.userName = name
}

/**
 * Sends the user's name to the server and sets the user's id.
 * @async
 * @returns {Promise<void>} A promise that resolves when the function has completed.
*/
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

/**
 * Asynchronously register a new user with the given username and password.
 *
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user.
 *
 * @return {Promise<any>} - A promise that resolves with the server's response.
 *
 * @throws {Error} - If the response from the server is not status 200 or 400.
 */
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

/**
 * Performs a login request to the API with given username and password.
 * @function
 * @async
 * @param {string} username - The username to be used in the login request.
 * @param {string} password - The password to be used in the login request.
 * @returns {Promise<{ userId: number; userName: string } | null>} - Returns a Promise that resolves to an object containing userId and userName on successful login, or null if the login fails.
 */
async function login(username: string, password: string): Promise<{ userId: number; userName: string } | null> {
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
                localStorage.setItem("user-e-mobility", JSON.stringify({ username, password }))
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

/**
 * It is an asynchronous function that sends a DELETE request to the server to remove the current player from the active lobby.
 * @function
 * @async
 * @throws {Error} If the response from the server is not successful (i.e., not OK), an error message indicating the failure reason is logged to the console.
 */
async function removePlayerFromLobby() {
    const url = "/api/lobby/get_players/" + state.activeLobby.lobbyId + "?player_id=" + state.userId
    try {
        const response = await fetch(url, {
            method: "DELETE",
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }
    } catch (error) {
        console.log(" error in remove player from Lobby: " + error)
    }
}

/**
 * Logs the user out of the system.
 *
 * Removes the "user-e-mobility" item from local storage, sets `state.loggedIn` to `false`,
 * sets `state.errormessage` to an empty string, sets `state.activeLobby` to default values,
 * sets the player's id to `-1`, and sets the player's name to an empty string.
 */
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

/**
 * Adds the players to the current active lobby's player list
 * @param {IUser[]} players - An array of player objects to be added to the active lobby's player list.
*/
function updateActiveLobbyPlayerList(players: IUser[]) {
    for (let p of players) {
        state.activeLobby.playerList?.push(p)
    }
}

/**
 * Posts the active lobby information to the server.
 * @async
 * @param {ILobby} lobby - The lobby information to be posted.
 */
async function postActiveLobby(lobby: ILobby) {
    const response = await fetch(`/api/lobby/get_players/${lobby.lobbyId}?player_id=${state.userId}`, {
        method: "POST",
    })
}

/**
 * Asynchronously fetches the active lobby of the current player from the database and sets it to the state.
 * @async
 * @function
 */
async function getActiveLobbyOfPlayerDB() {
    const url = "/api/player/wal/" + state.userId
    var activeLobbyId = -1
    try {
        const response = await fetch(url, {
            method: "GET",
        })

        if (!response.ok) {
            console.log("error in getting active Lobby Id")
            throw new Error(response.statusText)
        }

        const jsondata: IGetPlayerWALResponseDTO = await response.json()
        activeLobbyId = jsondata.activeLobbyId
    } catch (error) {
        console.log(" error in getting active Lobby ID")
    }
    if (activeLobbyId != -1) {
        const url2 = "/api/lobby/" + activeLobbyId
        try {
            const response = await fetch(url2, {
                method: "GET",
            })

            if (!response.ok) {
                console.log("error in getting Lobby Data with active Lobby ID")
                throw new Error(response.statusText)
            }

            const jsondata: ILobbyDTO = await response.json()
            const lobbydata: ILobby = {
                lobbyId: jsondata.lobbyId,
                hostId: jsondata.hostId,
                mapId: jsondata.mapId,
                lobbyName: jsondata.lobbyName,
                numOfPlayers: jsondata.numOfPlayers,
                lobbyModeEnum: jsondata.lobbyModeEnum,
            }
            setActiveLobby(lobbydata)
        } catch (error) {
            console.log(" error in getting Lobby Data with active Lobby ID")
        }
    }
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
        postActiveLobby,
    }
}
