import { CompatClient, Stomp } from "@stomp/stompjs"
import { reactive, readonly } from "vue"

const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/public"
const ADD_MSG = "/app/chat.addUser"
const SEND_MSG = "/app/chat.sendMessage"

let stompClient: CompatClient

interface IChatMessage {
    message: string
    author: string
}

interface IChatState {
    chatList: IChatMessage[]
    errormessage: string
    userName: string
}

interface IStompMessage {
    author: string
    content: string
    type: string
}

const chatState = reactive<IChatState>({
    chatList: Array<IChatMessage>(),
    errormessage: "",
    userName: "",
})

export function useChat(username: string) {
    chatState.userName = username

    return {
        chat: readonly(chatState),
        sendMessage,
        connect,
    }
}

function connect(event: Event) {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnected, onError)
    event.preventDefault()
}

function onConnected() {
    stompClient.subscribe(DEST, onMessageReceived)

    stompClient.send(ADD_MSG, {}, JSON.stringify({ author: chatState.userName, type: "JOIN" }))
}

function onError(error: Error) {
    chatState.errormessage = error.message
}

function sendMessage(event: Event, message: string) {
    if (message && stompClient) {
        const chatMessage: IStompMessage = {
            author: chatState.userName,
            content: message,
            type: "CHAT",
        }

        stompClient.send(SEND_MSG, {}, JSON.stringify(chatMessage))
    }

    event.preventDefault()
}

function onMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)

    if (message.type === "JOIN") {
        chatState.chatList.push({ message: message.author + " joined", author: message.author })
    } else if (message.type === "LEAVE") {
        chatState.chatList.push({ message: message.author + " left", author: message.author })
    } else {
        chatState.chatList.push({ message: message.content, author: message.author })
    }
}
