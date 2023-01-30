/**
 *Data class to fetch and update the List of existing Lobbys
 */

import { reactive } from "vue"
import { E_LobbyMode } from "../../models/Lobby/E_LobbyMode"
import useUser from "../User/UserStore"
import { Client } from "@stomp/stompjs"
import { fetchPlayerList } from "../User/usePlayerList"
import { useChat } from "../Chat/useChat"
import router from "../../router/router"
import useEventBus from "../eventBus"
import IUser from "../../models/User/IUser"
import { ILobby } from "../../models/Lobby/ILobby"
import { ILobbyListState } from "../../models/Lobby/ILobbyListState"
import { ILobbyDTO } from "../../models/Lobby/ILobbyDTO"
import { IAddLobbyRequestDTO } from "../../models/Lobby/IAddLobbyRequestDTO"

const { emit } = useEventBus()
const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/lobby"
const SWITCHMODE_MSG = "/app/lobby.switchMode"
const JOIN_MSG = "/app/lobby.join"
const LEAVE_MSG = "/app/lobby.leave"
const CREATE_MSG = "/app/lobby.create"
const CLOSE_MSG = "/app/lobby.close"
const DRIVE_MSG = "/app/lobby.drive"
const SWITCHMAP_MSG = "/app/lobby.switchMap"

let stompClient: Client
const { user, userId, activeLobby, setActiveLobby, postActiveLobby } = useUser()
const { disconnectLobbyChat, connectLobbyChat } = useChat(user.userName, activeLobby.value)

interface IStompMessage {
    playerContent: IUser
    lobbyContent: ILobby
    type: string
}

const lobbyState = reactive<ILobbyListState>({
    lobbylist: Array<ILobbyDTO>(),
    errormsg: "",
})

export function useLobbyList() {
    return {
        lobbyList: lobbyState,
        updateLobbyList,
        receiveLobbyUpdates,
        joinMessage,
        changeLobbyModeMessage,
        leaveLobbyMessage,
        closeLobbyMessage,
        changeMapMessage,
        driveMessage,
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

        lobbyState.lobbylist = jsondata
        lobbyState.errormsg = ""
    } catch (error) {
        console.log(" error in updateLobbyList")
    }
}

//adds new lobby and sends it to backend, then update of lobbylist and set player as host directly in this lobby.
export async function createNewLobby(addLobbyName: string, addNumOfPlayers: number, addLobbyMode: E_LobbyMode) {
    const url = "/api/lobby/map/" + activeLobby.value.mapId

    const addLobby: IAddLobbyRequestDTO = {
        lobbyName: addLobbyName,
        numOfPlayers: addNumOfPlayers,
        lobbyModeEnum: addLobbyMode,
        hostId: userId.value,
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addLobby),
        })
        let id = await res.json()
        await updateLobbyList()
        var number: number = id
        var lobby: ILobby = {
            lobbyId: number,
            hostId: userId.value,
            mapId: activeLobby.value.mapId,
            lobbyName: addLobbyName,
            numOfPlayers: 1,
            lobbyModeEnum: addLobbyMode,
        }
        setActiveLobby(lobby)
        postActiveLobby(lobby)
        createLobbyMessage()
        router.push("/lobbyview")
    } catch (error) {
        console.log(error)
        return -1
    }
}

/*method that publishes a "JOIN" message to backend via Websocket connection on path /app/lobby.join, 
purpose to update playerlist of active lobby for all players that joined that particullar lobby.
*/
function joinMessage() {
    connectLobbyChat()
    if (stompClient && userId.value !== undefined && activeLobby.value.lobbyId !== -1) {
        //if(activeLobby.value)
        const lobbyMessage: IStompMessage = {
            playerContent: {
                userId: user.userId,
                userName: user.userName,
                activeLobby: {
                    lobbyId: user.activeLobby.lobbyId,
                    mapId: user.activeLobby.mapId,
                    lobbyName: user.activeLobby.lobbyName,
                    numOfPlayers: user.activeLobby.numOfPlayers,
                    lobbyModeEnum: user.activeLobby.lobbyModeEnum,
                },
            },
            lobbyContent: {
                lobbyId: user.activeLobby.lobbyId,
                hostId: user.activeLobby.hostId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
            type: "JOIN",
        }
        stompClient.publish({
            destination: JOIN_MSG,
            headers: {},
            body: JSON.stringify(lobbyMessage),
        })
    }
}

/*method that fires a "LEAVE" message to path /app/lobby.leave in backend via Websocket connetction.
Purpose to inform all players of current active lobby that this player leaves the lobby */
function leaveLobbyMessage() {
    console.log("LEAVE")
    const leaveLobbyMessage: IStompMessage = {
        playerContent: {
            userId: user.userId,
            userName: user.userName,
            activeLobby: {
                lobbyId: user.activeLobby.lobbyId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
        },
        lobbyContent: {
            lobbyId: user.activeLobby.lobbyId,
            hostId: user.activeLobby.hostId,
            mapId: user.activeLobby.mapId,
            lobbyName: user.activeLobby.lobbyName,
            numOfPlayers: user.activeLobby.numOfPlayers,
            lobbyModeEnum: user.activeLobby.lobbyModeEnum,
        },
        type: "LEAVE",
    }
    disconnectLobbyChat(activeLobby.value.lobbyId)
    stompClient.publish({
        destination: LEAVE_MSG,
        headers: {},
        body: JSON.stringify(leaveLobbyMessage),
    })
}
/*method that fires a "CREATE" message to path /app/lobby.create in backend via Websocket connetction.
Purpose to inform all user about new available lobby */
function createLobbyMessage() {
    console.log("CREATE")
    connectLobbyChat()
    if (stompClient && userId.value !== undefined && activeLobby.value.lobbyId !== -1) {
        const lobbyMessage: IStompMessage = {
            playerContent: {
                userId: user.userId,
                userName: user.userName,
                activeLobby: {
                    lobbyId: user.activeLobby.lobbyId,
                    mapId: user.activeLobby.mapId,
                    lobbyName: user.activeLobby.lobbyName,
                    numOfPlayers: user.activeLobby.numOfPlayers,
                    lobbyModeEnum: user.activeLobby.lobbyModeEnum,
                },
            },
            lobbyContent: {
                lobbyId: user.activeLobby.lobbyId,
                hostId: user.activeLobby.hostId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
            type: "JOIN",
        }
        stompClient.publish({
            destination: JOIN_MSG,
            headers: {},
            body: JSON.stringify(lobbyMessage),
        })

        const createLobbyMessage: IStompMessage = {
            playerContent: {
                userId: user.userId,
                userName: user.userName,
                activeLobby: {
                    lobbyId: user.activeLobby.lobbyId,
                    mapId: user.activeLobby.mapId,
                    lobbyName: user.activeLobby.lobbyName,
                    numOfPlayers: user.activeLobby.numOfPlayers,
                    lobbyModeEnum: user.activeLobby.lobbyModeEnum,
                },
            },
            lobbyContent: {
                lobbyId: user.activeLobby.lobbyId,
                hostId: user.activeLobby.hostId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
            type: "CREATE",
        }
        stompClient.publish({
            destination: CREATE_MSG,
            headers: {},
            body: JSON.stringify(createLobbyMessage),
        })
    }
}
/*method that fires a "CLOSE" message to path /app/lobby.close in backend via Websocket connetction.
Purpose to close active lobby for all players who joined that lobby. */
function closeLobbyMessage() {
    console.log("CLOSE")
    const closeLobbyMessage: IStompMessage = {
        playerContent: {
            userId: user.userId,
            userName: user.userName,
            activeLobby: {
                lobbyId: user.activeLobby.lobbyId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
        },
        lobbyContent: {
            lobbyId: user.activeLobby.lobbyId,
            hostId: user.activeLobby.hostId,
            mapId: user.activeLobby.mapId,
            lobbyName: user.activeLobby.lobbyName,
            numOfPlayers: user.activeLobby.numOfPlayers,
            lobbyModeEnum: user.activeLobby.lobbyModeEnum,
        },
        type: "CLOSE",
    }
    disconnectLobbyChat(activeLobby.value.lobbyId)
    stompClient.publish({
        destination: CLOSE_MSG,
        headers: {},
        body: JSON.stringify(closeLobbyMessage),
    })
}

/*method that fires a "SWITCH_MODE" message to path /app/lobby.switchMode in backend via Websocket connetction.
Purpose to update Lobbymode of current active Lobby for all players who joined that lobby. */
function changeLobbyModeMessage() {
    if (stompClient && userId.value !== undefined && activeLobby.value.lobbyId !== -1) {
    }
    const switchModeMessage: IStompMessage = {
        playerContent: {
            userId: user.userId,
            userName: user.userName,
            activeLobby: {
                lobbyId: user.activeLobby.lobbyId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
        },
        lobbyContent: {
            lobbyId: user.activeLobby.lobbyId,
            hostId: user.activeLobby.hostId,
            mapId: user.activeLobby.mapId,
            lobbyName: user.activeLobby.lobbyName,
            numOfPlayers: user.activeLobby.numOfPlayers,
            lobbyModeEnum: user.activeLobby.lobbyModeEnum,
        },
        type: "SWITCH_MODE",
    }

    stompClient.publish({
        destination: SWITCHMODE_MSG,
        headers: {},
        body: JSON.stringify(switchModeMessage),
    })
}
/*method that fires a "SWITCH_MAP" message to path /app/lobby.switchMap in backend via Websocket connetction.
Purpose to update map of current active lobby for all players who joined that lobby. */
function changeMapMessage() {
    if (stompClient && userId.value !== undefined && activeLobby.value.lobbyId !== -1) {
    }
    const changeMapMessage: IStompMessage = {
        playerContent: {
            userId: user.userId,
            userName: user.userName,
            activeLobby: {
                lobbyId: user.activeLobby.lobbyId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
        },
        lobbyContent: {
            lobbyId: user.activeLobby.lobbyId,
            hostId: user.activeLobby.hostId,
            mapId: user.activeLobby.mapId,
            lobbyName: user.activeLobby.lobbyName,
            numOfPlayers: user.activeLobby.numOfPlayers,
            lobbyModeEnum: user.activeLobby.lobbyModeEnum,
        },
        type: "SWITCH_MAP",
    }

    stompClient.publish({
        destination: SWITCHMAP_MSG,
        headers: {},
        body: JSON.stringify(changeMapMessage),
    })
}

/*method that fires a "DRIVE" message to path /app/lobby.drive in backend via Websocket connetction.
Purpose to start driving session of current active lobby for all players who joined that lobby. */
function driveMessage() {
    if (stompClient && userId.value !== undefined && activeLobby.value.lobbyId !== -1) {
    }
    const driveMessage: IStompMessage = {
        playerContent: {
            userId: user.userId,
            userName: user.userName,
            activeLobby: {
                lobbyId: user.activeLobby.lobbyId,
                mapId: user.activeLobby.mapId,
                lobbyName: user.activeLobby.lobbyName,
                numOfPlayers: user.activeLobby.numOfPlayers,
                lobbyModeEnum: user.activeLobby.lobbyModeEnum,
            },
        },
        lobbyContent: {
            lobbyId: user.activeLobby.lobbyId,
            hostId: user.activeLobby.hostId,
            mapId: user.activeLobby.mapId,
            lobbyName: user.activeLobby.lobbyName,
            numOfPlayers: user.activeLobby.numOfPlayers,
            lobbyModeEnum: user.activeLobby.lobbyModeEnum,
        },
        type: "DRIVE",
    }

    stompClient.publish({
        destination: DRIVE_MSG,
        headers: {},
        body: JSON.stringify(driveMessage),
    })
}

/*function to activate Websockets on specific destination in backend. 
Also for errorhandling if connection could not successfully be established.
If new message is arriving it is passed to onMessageReceived function*/
function receiveLobbyUpdates() {
    stompClient = new Client({
        brokerURL: ws_url,
    })
    stompClient.onWebSocketError = (error) => {
        console.log("error", error.message)
    }
    stompClient.onStompError = (frame) => {
        console.log("error", frame.body)
    }

    stompClient.onConnect = (frame) => {
        console.log("lobby ws connected")
        stompClient.subscribe(DEST, (message) => {
            const lobbyUpdate: IStompMessage = JSON.parse(message.body)
            onMessageReceived(lobbyUpdate)
        })
    }

    stompClient.onDisconnect = () => {
        console.log("lobby ws disconnected")
    }

    stompClient.activate()
}

/*function that is called if new message is arriving on websocket, looks for message type and
is performing specific actions depending on message type.

If message tpye if of type "JOIN", the playerlist of this current lobby is updated with the payload for all players that joined the lobby.
If message is of type "SWITCH_MODE", the lobbymode is changed to the payload content of the message for all players of the lobby.
If message is of type "CREATE", update local lobbylist.
If message is of type "CLOSE", update local lobbylist with new data from backend, if its your current lobby, reset all local active lobby values to default and switch to lobby overview.
If message is of type "LEAVE", updates displayed playerlist given from backend and removes player with given entry out of local active lobby playerlist if player is found there.
If message is of type "DRIVE", pushes player to /game to start drive session for all players. 
If message is of type "SWITCH_MAP", starts a card-changed event on event bus and pushes player back to /lobbyview
*/
async function onMessageReceived(payload: IStompMessage) {
    if (payload.type === "CLOSE") {
        updateLobbyList()
    }
    if (payload.type === "CREATE") {
        updateLobbyList()
    }

    if (payload.lobbyContent.lobbyId === activeLobby.value.lobbyId) {
        if (payload.type === "JOIN") {
            await fetchPlayerList()
            activeLobby.value.playerList?.push({
                userId: payload.playerContent.userId,
                userName: payload.playerContent.userName,
                activeLobby: payload.lobbyContent,
            })
        }
        if (payload.type === "SWITCH_MODE") {
            activeLobby.value.lobbyModeEnum = payload.lobbyContent.lobbyModeEnum
        }
        if (payload.type === "SWITCH_MAP") {
            activeLobby.value.mapId = payload.lobbyContent.mapId
            emit("change-map-event", payload.lobbyContent.mapId)
            router.push("/lobbyview")
        }
        if (payload.type === "LEAVE") {
            await fetchPlayerList()
            var index = activeLobby.value.playerList?.findIndex(
                (element: any) => element.userId == payload.playerContent.userId
            )
            if (index != undefined) {
                switch (index) {
                    case 0:
                        /*delete list head (shift)*/
                        activeLobby.value.playerList?.shift()
                        break
                    case -1:
                        console.warn("-1: Deleted Item not found")
                        break
                    default:
                        /* delete list element (splice) */
                        activeLobby.value.playerList?.splice(index, index)
                }
            }
        }
        if (payload.type === "CLOSE") {
            setActiveLobby({
                lobbyId: -1,
                hostId: -1,
                mapId: -1,
                lobbyName: "",
                numOfPlayers: 0,
                lobbyModeEnum: E_LobbyMode.BUILD_MODE,
                playerList: [],
            })
            router.push("/lobby")
        }
        if (payload.type === "DRIVE") {
            router.push("/game")
        }
    }
}
