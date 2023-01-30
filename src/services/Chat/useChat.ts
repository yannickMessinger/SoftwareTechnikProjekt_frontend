import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs"
import { reactive, readonly, ref } from "vue"
import { ILobby } from "../../models/Lobby/ILobby"

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

/**
 * Chat Message for parse to json
 */
interface IChatMessage {
    message: string
    author: string
    type: string
}

/**
 * Chat state for inter communication, consists of a global and a lobby chatlist
 */
interface IChatState {
    chatList: IChatMessage[]
    chatList_lobby: IChatMessage[]
    errormessage: string
    userName: string
    activeLobbyId: number
}

/**
 * Stomp message interface for stomp communication
 */
interface IStompMessage {
    author: string
    content: string
    type: string
    lobbyId: number
}

/**
 * Initialize chat state reactive
 */
const chatState = reactive<IChatState>({
    chatList: Array<IChatMessage>(),
    chatList_lobby: Array<IChatMessage>(),
    errormessage: "",
    userName: "",
    activeLobbyId: -1,
})

/**
 * connect on gloabal chat channel per Websocket and Stomp
 */
function connectGlobalChat() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnectedGlobalWs, onError)
}

/**
 * Subscribe on global channel and send a join message
 */
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

/**
 * Connect lobby chat channel
 */
function connectLobbyChat() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnectedLobbyWs, onError)
}

/**
 * Subscribes the right lobby channel using the activeLobbyId,  and send join message
 */
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

/**
 * unsubscribe lobby chat for disconnect and clear chat.
 */
function disconnectLobbyChat() {
    if (lobbySubscription !== undefined) {
        chatState.chatList_lobby = []
        lobbySubscription.unsubscribe()
    }
}

/**
 * unsubscribe lobby chat for leave, send leave message and clear chat.
 * @param oldLobbyId - to send leave message to old lobby
 */
function leaveLobbyChat(oldLobbyId: number) {
    if (lobbySubscription !== undefined) {
        stompClient.send(LOBBY_MSG + oldLobbyId, {}, JSON.stringify({ author: chatState.userName, type: "LEAVE" }))
        chatState.chatList_lobby = []
        lobbySubscription.unsubscribe()
    }
}

/**
 * sende Message to global chat
 * @param message - chat message
 */
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
/**
 * sends lobby inter message to specific lobby endpoint
 * @param message - chat mesage
 */

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

/**
 * if chat message received, add it du chatstate.chatlist. Additionally a notification message will be sent
 * @param payload chat message
 */
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
/**
 * if chat message received (could be join-message, leave-message or normal chat message), add it du chatstate.chatList_lobby.
 *  Additionally a notification message will be sent
 * @param payload
 */
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
        leaveLobbyChat,
        activeLobbyID,
    }
}
