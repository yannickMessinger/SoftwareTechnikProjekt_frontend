import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs"
import { watch } from "fs"
import { reactive, readonly, ref } from "vue"
import { ILobby } from "../../typings/ILobby"

const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/chat"
const SEND_MSG = "/app/chat.globalChat"
const LOBBY_MSG = "/app/chat.lobbyChat/"
const message_notification = new Audio("src/assets/audio/chat/message_notification/msn.mp3")
message_notification.volume = 0.5

let stompClient: CompatClient
let globalSubscription: StompSubscription
let lobbySubscription: StompSubscription
let activeLobbyID = ref(-1)

interface IChatMessage {
    message: string
    author: string
    type: string
}

interface IChatState {
    chatList: IChatMessage[]
    chatList_lobby: IChatMessage[]
    errormessage: string
    userName: string
    activeLobbyId: number
}

interface IStompMessage {
    author: string
    content: string
    type: string
    lobbyId: number
}

const chatState = reactive<IChatState>({
    chatList: Array<IChatMessage>(),
    chatList_lobby: Array<IChatMessage>(),
    errormessage: "",
    userName: "",
    activeLobbyId: -1,
})

export function useChat(username: string, lobby: ILobby) {
    chatState.userName = username
    chatState.activeLobbyId = lobby.lobbyId

    return {
        chat: readonly(chatState),
        sendMessage,
        sendLobbyMessage,
        connectGlobalChat,
        connectLobbyChat,
        disconnectLobbyChat,
        activeLobbyID,
    }
}

function connectGlobalChat() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnectedGlobalWs, onError)
}

function onConnectedGlobalWs() {
    if (globalSubscription !== undefined) {
        globalSubscription.unsubscribe()
    }
    globalSubscription = stompClient.subscribe(DEST, onMessageReceived)
    stompClient.send(SEND_MSG, {}, JSON.stringify({ author: chatState.userName, type: "JOIN" }))
}

function onError(error: Error) {
    chatState.errormessage = error.message
}

//connect second ws for local lobbychat
function connectLobbyChat() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnectedLobbyWs, onError)
}

//subscribes ws to lobby specific path
function onConnectedLobbyWs() {
    lobbySubscription = lobbySubscription = stompClient.subscribe(
        `/topic/chat/lobby/${chatState.activeLobbyId}`,
        onLobbyMessageReceived
    )
    stompClient.send(
        LOBBY_MSG + chatState.activeLobbyId,
        {},
        JSON.stringify({ author: chatState.userName, type: "JOIN" })
    )
}

function disconnectLobbyChat(oldValue: number) {
    stompClient.send(LOBBY_MSG + oldValue, {}, JSON.stringify({ author: chatState.userName, type: "LEAVE" }))
    chatState.chatList_lobby = []
    if (lobbySubscription !== undefined) {
        lobbySubscription.unsubscribe()
    }
}

function sendMessage(message: string) {
    if (message && stompClient) {
        const chatMessage: IStompMessage = {
            author: chatState.userName,
            content: message,
            type: "CHAT",
            lobbyId: chatState.activeLobbyId,
        }

        stompClient.send(SEND_MSG, {}, JSON.stringify(chatMessage))
    }
}

//sends lobby inter message to specific endpoint
function sendLobbyMessage(message: string) {
    if (message && stompClient) {
        const chatMessage: IStompMessage = {
            author: chatState.userName,
            content: message,
            type: "CHAT",
            lobbyId: chatState.activeLobbyId,
        }

        stompClient.send(LOBBY_MSG + chatMessage.lobbyId, {}, JSON.stringify(chatMessage))
    }
}

function onMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)
    if (message.type === "CHAT") {
        message_notification.play()
        const message = JSON.parse(payload.body)
        chatState.chatList.push({
            message: message.content,
            author: message.author,
            type: "CHAT",
        })
    }
}

function onLobbyMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)

    if (message.type === "JOIN") {
        chatState.chatList_lobby.push({
            message: message.author + " ist dem Chat beigetreten",
            author: message.author,
            type: "JOIN",
        })
    } else if (message.type === "LEAVE") {
        chatState.chatList_lobby.push({
            message: message.author + " hat den Chat verlassen",
            author: message.author,
            type: "LEAVE",
        })
    } else {
        message_notification.play()
        chatState.chatList_lobby.push({
            message: message.content,
            author: message.author,
            type: "CHAT",
        })
    }
}
