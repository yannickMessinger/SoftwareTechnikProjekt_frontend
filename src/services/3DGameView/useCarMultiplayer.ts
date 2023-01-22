import { Client } from "@stomp/stompjs"
import { reactive, readonly } from "vue"
import { IPosition } from "../../typings/IPosition"

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/position"
const CREATE_MSG = "/app/position.create"
const DELETE_MSG = "/app/position.delete"
const UPDATE_MSG = "/app/position.update"

let stompClient: Client

interface IPositionState {
    mapObjects: IPosition[]
    errormessage: string
    mapId: number
    userName: string
}

const positionState = reactive<IPositionState>({
    mapObjects: Array<IPosition>(),
    errormessage: "",
    mapId: 0,
    userName: "",
})

interface IStompMessage {
    id: number
    type: string
    author: string
    content: IPosition
}
export function useCarMultiplayer() {
    return {
        positionState,
        initCarUpdateWebsocket,
        createMessage,
        deleteMessage,
        updateMessage,
    }
}

function initCarUpdateWebsocket() {
    stompClient = new Client({ brokerURL: ws_url })
    console.log("BIN DRINNEN")

    stompClient.onWebSocketError = (error) => {
        positionState.errormessage = error.message
    }
    stompClient.onStompError = (frame) => {
        positionState.errormessage = frame.body
    }

    stompClient.onConnect = (frame) => {
        console.log("connected")
        stompClient.subscribe(DEST, (message) => {
            console.log("onConnect message", message)
            const payload: IStompMessage = JSON.parse(message.body)
            console.log("MEssage.Body", message.body)
            console.log(payload)
            if (payload) {
                onMessageReceived(payload)
            }
        })
    }
    stompClient.onDisconnect = () => {
        console.log("disconnected")
    }

    stompClient.activate()
}

function createMessage(message: IPosition) {
    console.log("stompclien <<<", stompClient)
    if (message && stompClient) {
        const carMessage: IStompMessage = {
            id: positionState.mapId, // MappID
            type: "CREATE",
            author: positionState.userName,
            content: message, //information des autos
        }
        console.log("message des autos in create message", message)
        console.log("CARMESSAGE", carMessage)
        stompClient.publish({
            destination: CREATE_MSG,
            headers: {},
            body: JSON.stringify(carMessage),
        })
    }
}

function deleteMessage(message: IPosition) {
    if (message && stompClient) {
        const carMessage: IStompMessage = {
            id: positionState.mapId,
            type: "DELETE",
            author: positionState.userName,
            content: message,
        }

        stompClient.publish({
            destination: DELETE_MSG,
            headers: {},
            body: JSON.stringify(carMessage),
        })
    }
}

function updateMessage(message: IPosition) {
    if (message && stompClient) {
        const carMessage: IStompMessage = {
            id: positionState.mapId,
            type: "UPDATE",
            author: positionState.userName,
            content: message,
        }
        console.log("message des autos in update message", message)
        console.log("CARMESSAGE", carMessage)
        stompClient.publish({
            destination: UPDATE_MSG,
            headers: {},
            body: JSON.stringify(carMessage),
        })
    }
}

/**
 * handle stomp payload message based on type
 * @param payload message as IStompMessage containing type and content (object position)
 */
function onMessageReceived(payload: IStompMessage) {
    console.log("messagereived: ", payload.content)
    if (positionState.mapId === payload.id) {
        const index = positionState.mapObjects.indexOf(payload.content)
        if (payload.type === "CREATE") {
            if (index < 0) {
                positionState.mapObjects.push(payload.content)
            }
        }
        if (payload.type === "DELETE") {
            if (index > -1) {
                positionState.mapObjects.splice(index, 1)
            }
        }
        if (payload.type === "UPDATE") {
            if (index > -1) {
                positionState.mapObjects[index] = payload.content
            }
        }
    }
}
