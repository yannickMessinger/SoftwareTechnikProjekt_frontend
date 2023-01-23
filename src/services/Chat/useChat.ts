import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs"
import { watch } from "fs"
import { reactive, readonly } from "vue"
import { ILobby } from "../../typings/ILobby"

const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/chat"
const SEND_MSG = "/app/chat.sendMessage"
const LOBBY_MSG = "/app/chat.lobbyChat/"
const message_notification = new Audio("src/assets/audio/chat/message_notification/msn.mp3")

let stompClient: CompatClient
let globalSubscription: StompSubscription
let lobbySubscription: StompSubscription

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
        connect,
        connectLobbyWs,
        disconnectLobby,
    }
}

function connect() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnected, onError)
}

function onConnected() {
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
function connectLobbyWs() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnectedLobbyWs, onErrorLobbyWs)
}

//subscribes ws to lobby specific path
function onConnectedLobbyWs() {
    if (lobbySubscription !== undefined) {
        chatState.chatList_lobby = []
        lobbySubscription.unsubscribe()
    }

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

function disconnectLobby(oldValue: number) {
    stompClient.send(LOBBY_MSG + oldValue, {}, JSON.stringify({ author: chatState.userName, type: "LEAVE" }))
}

function onErrorLobbyWs(error: Error) {
    console.log("ERROR CONNECT LOCAL LOBBY WS")
    chatState.errormessage = error.message
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
function sendLobbyMessage(/*event: Event,*/ message: string) {
    console.log(chatState.activeLobbyId)
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
        const message = JSON.parse(payload.body)
        chatState.chatList.push({
            message: message.content,
            author: message.author,
            type: "CHAT",
        })
        message_notification.play()
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
