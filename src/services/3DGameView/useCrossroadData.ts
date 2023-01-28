import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IMapObject } from '../streetplaner/IMapObject'
import { Scene } from 'three';
import { Client } from '@stomp/stompjs';

interface ITrafficLight {
    currentState: any
    object3d: THREE.Group | null | undefined
    crId: number
}

interface ICrossroad {
    crId: number
    trafficLights: Map<number, ITrafficLight>
}

interface TrafficLightResponseDTO {
    tlId: number
    currentState: string
    crId: number
}

interface GetCrossroadResponseDTO {
    crId: number
    tl: Array<TrafficLightResponseDTO>
}

enum Light {
    GREEN,
    YELLOW,
    REDYELLOW,
    RED
}


let crossroadMap = new Map<number, ICrossroad>()
let trafficLights = new Map<number, ITrafficLight>()
const loader = new GLTFLoader()

const ws_url = `ws://${window.location.host}/stomp`
const DEST = "/topic/crossroad"
const stompClient = new Client({ brokerURL: ws_url })
stompClient.onWebSocketError = (event) => { console.log("WS Fehler") }
stompClient.onStompError = (event) => { console.log("Stomp Fehler") }


stompClient.onConnect = (frame) => {
    stompClient.subscribe(DEST, (message) => {
        const json = JSON.parse(message.body)
        Object.entries(json).forEach(([key, value]) => {
            console.log(`Key: ${key}`)
            console.log(`Value: ${value}`)
            switch (value) {
                case 'GREEN':
                    trafficLights.get(Number(key))!.currentState = 'GREEN'
                    break;
                case 'YELLOW':
                    trafficLights.get(Number(key))!.currentState = 'YELLOW'
                    break;
                case 'REDYELLOW':
                    trafficLights.get(Number(key))!.currentState = 'REDYELLOW'
                    break;
                case 'RED':
                    trafficLights.get(Number(key))!.currentState = 'RED'
                    break;
                default:
                    throw new Error(`Invalid light value: ${value}`);
            }
            console.log(trafficLights.get(Number(key))!.currentState)
        });
        console.log(trafficLights)
    })
}

stompClient.onDisconnect = () => { console.log("Verbindung abgebaut") }
stompClient.activate()

function loadGLTF(path: string, scene: Scene, xParent: number, yParent: number, xOffset: number, yOffset: number, rotation: any, objectId: number) {
    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.position.set(xParent + xOffset, 0, yParent + yOffset)
        model.scale.set(0.5, 0.5, 0.5)
        model.rotation.set(0, rotation, 0)
        
        //crossroadMap.get(objectId)?.trafficLights.set(model.id, { tlId: model.id, currentState: "", object3d: model } as ITrafficLight);
        scene.add(model)

        const light = new THREE.SpotLight( 0xff0040, 5, 10, 0.2);
        light.add( new THREE.Mesh( new THREE.SphereGeometry( 0.3, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        light.position.set(xParent + xOffset, 3, yParent + yOffset)
        scene.add(light)

    })
}

function loadTrafficLight(crossroadObject: IMapObject, scene: Scene, x: number, y: number, rotationMap: Map<any, any>) {
    const path = "/../../../public/3D_Models/TrafficLight/Traffic_Light.gltf"
    loadGLTF(path, scene, x, y, 3, 3, rotationMap.get(0), crossroadObject.objectId)
    loadGLTF(path, scene, x, y, 3, -3, rotationMap.get(3), crossroadObject.objectId)
    loadGLTF(path, scene, x, y, -3, -3, rotationMap.get(2), crossroadObject.objectId)
    loadGLTF(path, scene, x, y, -3, 3, rotationMap.get(1), crossroadObject.objectId)
}
function toggle() {
    addCrossroad(4)
    console.log(trafficLights)
}

async function addCrossroad(tlAmount: number) {
    fetch(`/api/crossroad?tlAmount=${tlAmount}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(id => {
            let newCrossroad: ICrossroad = {
                crId: id,
                trafficLights: new Map<number, ITrafficLight>()
            }
            crossroadMap.set(id, newCrossroad)
            getCrossroad(id)
        })
}

async function getCrossroad(crId: number) {
    fetch(`/api/crossroad/${crId}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const crData = data as GetCrossroadResponseDTO;
            crData.tl.map(tl => {
                trafficLights.set(
                    tl.tlId,
                    {
                        tlId: tl.tlId,
                        currentState: tl.currentState as unknown as Light,
                        object3d: null,
                        crId: tl.crId
                    } as ITrafficLight
                )
            })

            const crossroad: ICrossroad = {
                crId: crData.crId,
                trafficLights: trafficLights
            };
            crossroadMap.set(crData.crId, crossroad);
        })
        .catch(error => {
            console.error('Error:', error);
        })
}



async function deleteCrossroad(crId: number) {
    fetch(`/api/crossroad/${crId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

export default function useCrossroadData() {
    return {
        loadTrafficLight,
        toggle,
        crossroadMap,
        addCrossroad,
        getCrossroad,
        deleteCrossroad
    }
}