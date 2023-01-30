import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { IMapObject } from "../streetplaner/IMapObject"
import { Scene } from "three"
import { Client } from "@stomp/stompjs"
import { off } from "process"
import { reactive } from "vue"
import { SphereGeometry } from "troisjs"


/**
 * Interface to store the traffic light object.
 * @property {any} currentState is the state of the traffic light.
 * @property {THREE.Group | null | undefined} object3d 3d Object of the traffic light
 * @property {number} crId ID of the crossroad the traffic light belongs to.
 */
interface ITrafficLight {
    currentState: any
    object3d: THREE.Group | null | undefined
    crId: number
}
/**
 * Interface to store a crossroad object
 * @property {number} crId ID of the crossroad
 * @property {Map<number, ITrafficLight>} trafficLights Map of the traffic lights in the crossroad.
 */
interface ICrossroad {
    crId: number
    trafficLights: Map<number, ITrafficLight>
}

/**
 * Describes the properties of a Traffic Light Response Data Transfer Object.
 * @interface TrafficLightResponseDTO
 * @property {number} tlId - The ID of the Traffic Light.
 * @property {string} currentState - The current state of the Traffic Light.
 * @property {number} crId - The ID of the Crossroad the Traffic Light belongs to.
 */

interface TrafficLightResponseDTO {
    tlId: number
    currentState: string
    crId: number
}

/**
 * @description Data Transfer Object to store the response of a crossroad.
 * @typedef {Object} GetCrossroadResponseDTO
 * @property {number} crId - ID of the crossroad.
 * @property {Array<TrafficLightResponseDTO>} tl - Array of traffic light information.
 */
interface GetCrossroadResponseDTO {
    crId: number
    tl: Array<TrafficLightResponseDTO>
}

/**
 * Enum class to store the different traffic light states.
 */
enum Light {
    GREEN,
    YELLOW,
    REDYELLOW,
    RED,
}
/**
 * Map to store the crossroads.
 */
let crossroadMap = new Map<number, ICrossroad>()

/**
 * Reactive map to store the traffic lights.
 */
let trafficLights = reactive(new Map<number, ITrafficLight>())

/**
 * Loader to load 3D models in GLTF format.
 */
const loader = new GLTFLoader()

/**
 * URL of the WebSocket server.
 */
const ws_url = `ws://${window.location.host}/stomp`

/**
 * Destination for the messages from the WebSocket server.
 */
const DEST = "/topic/crossroad"

/**
 * STOMP client to connect to the WebSocket server.
 */
const stompClient = new Client({ brokerURL: ws_url })

/**
 * @description This function is used to log a message when a WebSocket error occurs in the stompClient.
 * @function
 * @param {Event} event - The event object triggered by the WebSocket error.
 */
stompClient.onWebSocketError = (event) => {
    console.log("WS Fehler")
}

/**
 * @description This function is called when there is an error with the STOMP client.
 * @function
 * @param event - The event object for the error.
 */
stompClient.onStompError = (event) => {
    console.log("Stomp Fehler")
}

/**
 * @description Callback function for when the stomp client connects. 
 * The function subscribes to the DEST topic and sets the color of the traffic light objects based on the message body.
 * @param frame - The frame returned from the stomp client connection.
 */
stompClient.onConnect = (frame) => {
    stompClient.subscribe(DEST, (message) => {
        if (message.body) {
            const json = JSON.parse(message.body)
            Object.entries(json).forEach(([key, value]) => {
                if (trafficLights.get(Number(key)) != undefined) {
                    switch (value) {
                        case "GREEN":
                            trafficLights.get(Number(key))!.currentState = "GREEN"
                            trafficLights
                                .get(Number(key))!
                                .object3d.getObjectByName("sphere")
                                .material.color.setHex(0x77dd77)
                            break
                        case "YELLOW":
                            trafficLights.get(Number(key))!.currentState = "YELLOW"
                            trafficLights
                                .get(Number(key))!
                                .object3d.getObjectByName("sphere")
                                .material.color.setHex(0xdddd77)
                            break
                        case "REDYELLOW":
                            trafficLights.get(Number(key))!.currentState = "REDYELLOW"
                            trafficLights
                                .get(Number(key))!
                                .object3d.getObjectByName("sphere")
                                .material.color.setHex(0xdddd77)
                            break
                        case "RED":
                            trafficLights.get(Number(key))!.currentState = "RED"
                            trafficLights
                                .get(Number(key))!
                                .object3d.getObjectByName("sphere")
                                .material.color.setHex(0xdd7777)
                            break
                        default:
                            throw new Error(`Invalid light value: ${value}`)
                    }
                }
            })
        }
    })
}

/**
 * Event handler for STOMP errors.
 */
stompClient.onDisconnect = () => {
    console.log("Verbindung abgebaut")
}
/**
 * Activates the STOMP client connection.
 */
stompClient.activate()

/**
 * Adds a new crossroad to the scene
 * @async
 * @function addCrossroad
 * @param {number} tlAmount - Number of traffic lights in the crossroad
 * @param {Scene} scene - Scene to add the crossroad to
 * @param {number} x - X coordinate for the crossroad
 * @param {number} y - Y coordinate for the crossroad
 * @param {Map<any, any>} rotationMap - Map containing rotation information
 */
async function addCrossroad(tlAmount: number, scene: Scene, x: number, y: number, rotationMap: Map<any, any>) {
    fetch(`/api/crossroad?tlAmount=${tlAmount}`, {
        method: "POST",
    })
        .then((response) => response.json())
        .then((id) => {
            let newCrossroad: ICrossroad = {
                crId: id,
                trafficLights: new Map<number, ITrafficLight>(),
            }
            crossroadMap.set(id, newCrossroad)
            getCrossroad(id, scene, x, y, rotationMap)
        })
}

/**
 * Asynchronously fetch a crossroad from the server, load its associated traffic lights, and add them to the 3D scene.
 *
 * @async
 * @function
 * @param {number} crId - The ID of the crossroad to fetch.
 * @param {Scene} scene - The THREE.js Scene object representing the 3D scene.
 * @param {number} x - The x position of the crossroad in the scene.
 * @param {number} y - The y position of the crossroad in the scene.
 * @param {Map<any, any>} rotationMap - A map used to determine the rotation of each traffic light.
 * @throws {Error} If an error occurs while fetching the crossroad or loading the 3D model for the traffic lights.
 */
async function getCrossroad(crId: number, scene: Scene, x: number, y: number, rotationMap: Map<any, any>) {
    try {
        const response = await fetch(`/api/crossroad/${crId}`)
        const data = await response.json()
        const crData = data as GetCrossroadResponseDTO
        const position = [
            { x: 3, y: 3 },
            { x: -3, y: 3 },
            { x: -3, y: -3 },
            { x: 3, y: -3 },
        ]

        for (let i = 0; i < crData.tl.length; i++) {
            const tl = crData.tl[i]
            try {
                const object3d = await new Promise((resolve) => {
                    loader.load("/../../../3D_Models/TrafficLight/Traffic_Light.gltf", (gltf) => {
                        const model = gltf.scene
                        model.position.set(x + position[i].x, 0, y + position[i].y)
                        model.scale.set(0.5, 0.5, 0.5)
                        model.rotation.set(0, rotationMap.get(i), 0)

                        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 8))
                        sphere.material = new THREE.MeshBasicMaterial({ color: 0xffd1d7 })
                        sphere.name = "sphere"
                        sphere.position.set(0, 5, 0)
                        model.add(sphere)
                        scene.add(model)
                        resolve(model)
                    })
                })
                trafficLights.set(tl.tlId, {
                    tlId: tl.tlId,
                    currentState: tl.currentState as unknown as Light,
                    object3d: object3d,
                    crId: tl.crId,
                } as ITrafficLight)
            } catch (error) {
                console.error(`Error loading model for traffic light ${tl.tlId}: ${error}`)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Asynchronously deletes a crossroad from the server.
 * 
 * @async
 * @function
 * @param {number} crId - The ID of the crossroad to be deleted.
 */
async function deleteCrossroad(crId: number) {
    fetch(`/api/crossroad/${crId}`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.error("Error:", error)
        })
}

/**
 * @function useCrossroadData
 * @returns An object containing the crossroadMap, trafficLights, and addCrossroad functions.
 */

export default function useCrossroadData() {
    return {
        crossroadMap,
        trafficLights,
        addCrossroad,
    }
}
