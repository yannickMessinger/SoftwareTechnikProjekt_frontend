import { CompatClient, Stomp } from "@stomp/stompjs"
import { reactive, readonly } from "vue"

const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/chat"
const ADD_MSG = "/app/chat.addUser"
const SEND_MSG = "/app/chat.sendMessage"
const LOBBY_MSG = "/app/chat.lobbyChat/"
const message_notification = new Audio(
    "src/assets/audio/chat/message_notification/msn.mp3"
)

let stompClient: CompatClient

interface IChatMessage {
    message: string
    author: string
}

interface IChatState {
    chatList: IChatMessage[]
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
    errormessage: "",
    userName: "",
    activeLobbyId: -1,
})

//update of active lobby for ws connectivity
function updateActiveChatLobbyId(id: number) {
    if (chatState.activeLobbyId === -1) {
        console.log("invalid active lobby")
    }
    chatState.activeLobbyId = id
    connectLobbyWs()
}

export function useChat(username: string) {
    chatState.userName = username

    return {
        chat: readonly(chatState),
        sendMessage,
        sendLobbyMessage,
        connect,
        updateActiveChatLobbyId,
    }
}

function connect(/*event: Event*/) {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnected, onError)
    //event.preventDefault()
}

function onConnected() {
    stompClient.subscribe(DEST, onMessageReceived)

    stompClient.send(
        ADD_MSG,
        {},
        JSON.stringify({ author: chatState.userName, type: "JOIN" })
    )
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
    stompClient.subscribe(
        `/topic/chat/lobby/${chatState.activeLobbyId}`,
        onLobbyMessageReceived
    )
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

        stompClient.send(
            LOBBY_MSG + chatMessage.lobbyId,
            {},
            JSON.stringify(chatMessage)
        )
    }
}

function onMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)

    if (message.type === "JOIN") {
        chatState.chatList.push({
            message: message.author + " joined",
            author: message.author,
        })
    } else if (message.type === "LEAVE") {
        chatState.chatList.push({
            message: message.author + " left",
            author: message.author,
        })
    } else {
        message_notification.play()
        chatState.chatList.push({
            message: message.content,
            author: message.author,
        })
    }
}

function onLobbyMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)

    chatState.chatList.push({
        message: message.content,
        author: message.author,
    })
}
