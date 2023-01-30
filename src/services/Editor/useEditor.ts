// imports
import { reactive } from "vue"
import { Client } from "@stomp/stompjs"
import { IMapObject } from "../../models/Editor/IMapObject"

// define url and paths for stompClient
const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/editor"
const CREATE_MSG = "/app/editor.create"
const DELETE_MSG = "/app/editor.delete"
const UPDATE_MSG = "/app/editor.update"
const RESET_MSG = "/app/editor.reset"
const MAP_API = "/api/map/objects/"

// define stompClient
let stompClient: Client

/**
 * mapObjects - List of IMapObjects of the current map
 * errormessage - contains the errormessage
 * mapId - mapId of the current map
 * userName - userName of the current user
 */
interface IEditorState {
    mapObjects: IMapObject[]
    errormessage: string
    mapId: number
    userName: string
}

/**
 * id - mapId of the current map
 * type - type of the update
 * author - username of the user which sends the message
 * content - updated or new IMapObjects
 */
interface IStompMessage {
    id: number
    type: string
    author: string
    content: IMapObject
}

/**
 *
 * create editorState and fill with default values
 */
const editorState = reactive<IEditorState>({
    mapObjects: Array<IMapObject>(),
    errormessage: "",
    mapId: 0,
    userName: "",
})

/**
 * export all available functions
 * @param mapId - mapId on which the Editor works
 * @returns all availabel functions
 */
export function useEditor(mapId: number) {
    editorState.mapId = mapId
    return {
        editorState: editorState,
        createMessage,
        deleteMessage,
        updateMessage,
        resetMessage,
        updateMap,
        receiveEditorUpdates,
        updateMapId,
    }
}

/**
 * updates the map id, when the map is changed
 * @param mapId - new mapId
 */
function updateMapId(mapId: number) {
    editorState.mapId = mapId
}

/**
 * updates the mapObjects in the editorState
 */
function updateMap() {
    if (editorState.mapId === 0) {
        editorState.errormessage = "Invalid mapId"
    } else {
        fetch(MAP_API + editorState.mapId)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error(resp.statusText)
                }
                return resp.json()
            })
            .then((jsonData: IMapObject[]) => {
                editorState.mapObjects = jsonData
            })
            .catch((reason) => {
                editorState.errormessage = `Error: ${reason}`
            })
    }
}

/**
 * initializes the stompClient and defines it's reaction on errors and messages
 */
function receiveEditorUpdates() {
    updateMap()

    stompClient = new Client({ brokerURL: ws_url })
    stompClient.onWebSocketError = (error) => {
        editorState.errormessage = error.message
    }
    stompClient.onStompError = (frame) => {
        editorState.errormessage = frame.body
    }

    stompClient.onConnect = (frame) => {
        stompClient.subscribe(DEST, (message) => {
            const editorUpdate: IStompMessage = JSON.parse(message.body)
            onMessageReceived(editorUpdate)
        })
    }
    stompClient.onDisconnect = () => {}

    stompClient.activate()
}

/**
 * sends an create message via the stompClient
 * @param message - IMapObject which got created
 */
function createMessage(message: IMapObject) {
    if (message && stompClient) {
        const editorMessage: IStompMessage = {
            id: editorState.mapId,
            type: "CREATE",
            author: editorState.userName,
            content: message,
        }
        stompClient.publish({
            destination: CREATE_MSG,
            headers: {},
            body: JSON.stringify(editorMessage),
        })
    }
}

/**
 * sends an delete message via the stompClient
 * @param message - IMapObject which got deleted
 */
function deleteMessage(message: IMapObject) {
    if (message && stompClient) {
        const editorMessage: IStompMessage = {
            id: editorState.mapId,
            type: "DELETE",
            author: editorState.userName,
            content: message,
        }

        stompClient.publish({
            destination: DELETE_MSG,
            headers: {},
            body: JSON.stringify(editorMessage),
        })
    }
}

/**
 * sends an update message via the stompClient
 * @param message - IMapObject which got updated
 */
function updateMessage(message: IMapObject) {
    if (message && stompClient) {
        const editorMessage: IStompMessage = {
            id: editorState.mapId,
            type: "UPDATE",
            author: editorState.userName,
            content: message,
        }

        stompClient.publish({
            destination: UPDATE_MSG,
            headers: {},
            body: JSON.stringify(editorMessage),
        })
    }
}

/**
 * sends an reset message via the stompClient to reset the current map
 */
function resetMessage() {
    const message: IMapObject = {
        objectTypeId: -1,
        x: 0,
        y: 0,
        rotation: 0,
        game_assets: [],
    }
    if (message && stompClient) {
        const editorMessage: IStompMessage = {
            id: editorState.mapId,
            type: "RESET",
            author: editorState.userName,
            content: message,
        }

        stompClient.publish({
            destination: RESET_MSG,
            headers: {},
            body: JSON.stringify(editorMessage),
        })
    }
}

/**
 * function reactes on updates which are received via the stompbroker
 * @param payload - received message
 */
function onMessageReceived(payload: IStompMessage) {
    if (editorState.mapId === payload.id) {
        if (payload.type === "CREATE") {
            // replace old mapObject with new one
            editorState.mapObjects = editorState.mapObjects.filter(
                (obj) => obj.x !== payload.content.x || obj.y !== payload.content.y
            )
            editorState.mapObjects.push(payload.content)
        } else if (payload.type === "DELETE") {
            // delete mapObject
            editorState.mapObjects = editorState.mapObjects.filter(
                (obj) => obj.x !== payload.content.x || obj.y !== payload.content.y
            )
        } else if (payload.type === "UPDATE") {
            // replace old mapObject with updated one
            editorState.mapObjects = editorState.mapObjects.filter(
                (obj) => obj.x !== payload.content.x || obj.y !== payload.content.y
            )
            editorState.mapObjects.push(payload.content)
        } else if (payload.type === "RESET") {
            // fetch the map again
            updateMap()
        }
    }
}
