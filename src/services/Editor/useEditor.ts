import {reactive, readonly} from "vue";
import {CompatClient, Stomp} from "@stomp/stompjs";

const ws_url = 'ws://localhost:8080/stomp'
const DEST = '/topic/public'
const SEND_MSG = '/app/editor.sendMessage'
const CREATE_MSG = '/app/editor.create'
const DELETE_MSG = '/app/editor.delete'
const UPDATE_MSG = '/app/editor.update'
const MAP_API = '/api/map/objects/'

let stompClient: CompatClient

interface IMapObject {
    objectTypeId: number,
    x: number,
    y: number,
    rotation: number
}

interface IEditorState {
    objectList: IMapObject[],
    errormessage: string,
    mapId: number,
    userName: string
}

interface IStompMessage {
    id: number
    type: string,
    author: string,
    content: IMapObject
}

const editorState = reactive<IEditorState>({
    objectList: Array<IMapObject>(),
    errormessage: '',
    mapId: 0,
    userName: ''
})

export function useEditor(mapId: number) {
    editorState.mapId = mapId

    return {
        mapObjects: readonly(editorState),
        createMessage,
        deleteMessage,
        updateMessage,
        updateMap,
        connect
    }
}

function updateMap() {
    if (editorState.mapId === 0) {
        editorState.errormessage = 'Invalid mapId'
    } else {
        fetch(MAP_API + editorState.mapId)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText)
                }
                return resp.json()
            })
            .then((jsonData: IMapObject[]) => {
                editorState.objectList = jsonData
            })
            .catch((reason) => {
                editorState.errormessage = `Error: ${reason}`
            })
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
}

function onError(error: Error) {
    editorState.errormessage = error.message
}

function createMessage(event: Event, message: IMapObject) {
    if (message && stompClient) {
        const editorMessage: IStompMessage = {
            id: editorState.mapId,
            author: editorState.userName,
            content: message,
            type: 'CREATE'
        }

        stompClient.send(
            CREATE_MSG,
            {},
            JSON.stringify(editorMessage)
        )
    }

    event.preventDefault()
}

function deleteMessage(event: Event, message: IMapObject) {
    if (message && stompClient) {
        const editorMessage: IStompMessage = {
            id: editorState.mapId,
            author: editorState.userName,
            content: message,
            type: 'DELETE'
        }

        stompClient.send(
            DELETE_MSG,
            {},
            JSON.stringify(editorMessage)
        )
    }

    event.preventDefault()
}

function updateMessage(event: Event, message: IMapObject) {
    if (message && stompClient) {
        const editorMessage: IStompMessage = {
            id: editorState.mapId,
            author: editorState.userName,
            content: message,
            type: 'UPDATE'
        }

        stompClient.send(
            UPDATE_MSG,
            {},
            JSON.stringify(editorMessage)
        )
    }

    event.preventDefault()
}

function onMessageReceived(payload: { body: string }) {
    const message: IStompMessage = JSON.parse(payload.body)

    if (editorState.mapId === message.id) {
        if (message.type === 'CREATE') {
            editorState.objectList.push(message.content)
        } else if (message.type === 'DELETE') {
            editorState.objectList = editorState.objectList.filter(
                (obj) => obj.objectTypeId != message.content.objectTypeId)
        } else if (message.type === 'UPDATE') {
            editorState.objectList.forEach((obj, index) => {
                if (obj.objectTypeId === message.content.objectTypeId) {
                    editorState.objectList[index] = message.content
                }
            })
        }
    }
}