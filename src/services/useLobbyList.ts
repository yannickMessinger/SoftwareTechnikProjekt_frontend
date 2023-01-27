/**
 *Data class to fetch and update the List of existing Lobbys
 */

import { reactive } from "vue"
import { IAddLobbyRequestDTO } from "../typings/IAddLobbyRequestDTO"
import { E_LobbyMode } from "../typings/E_LobbyMode"
import { ILobbyListState } from "../typings/ILobbyListState"
import { ILobby } from "../typings/ILobby"
import useUser from "./UserStore"
import { ILobbyDTO } from "../typings/ILobbyDTO"
import { Client } from "@stomp/stompjs"
import { fetchPlayerList } from "./usePlayerList"
import { useChat } from "./Chat/useChat"
import IUser from "../typings/IUser"
import { resolve } from "path"
import router from "../router/router"

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/lobby"
const SWITCHMODE_MSG = "/app/lobby.switchMode"
const JOIN_MSG = "/app/lobby.join"
const LEAVE_MSG = "/app/lobby.leave"
const CREATE_MSG = "/app/lobby.create"
const CLOSE_MSG = "/app/lobby.close"

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
    }
}

//functions to fetch and update List of available lobbys from backend
export async function updateLobbyList(): Promise<void> {
    console.log("lobbyupdate")
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

//adds new lobby and sends it to backend, then update of lobbylist
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
        joinMessage()
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
        console.log("join message methode wurde aufgerufen")
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
        console.log(lobbyMessage.lobbyContent)
        stompClient.publish({
            destination: JOIN_MSG,
            headers: {},
            body: JSON.stringify(lobbyMessage),
        })
    }
}

/*method that fires a "SWITCH_MODE" message to path /app/lobby.switchMode in backend via Websocket connetction.
Purpose to update Lobbymode of current active Lobby for all players who joined that lobby. */
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

function createLobbyMessage() {
    console.log("CREATE")
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
*/
async function onMessageReceived(payload: IStompMessage) {
    console.log("MS recieved")
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
        if (payload.type === "LEAVE") {
            console.log("LEAVE 2")
            await fetchPlayerList()
            var index = activeLobby.value.playerList?.findIndex(
                (element) => element.userId == payload.playerContent.userId
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
    }
}
