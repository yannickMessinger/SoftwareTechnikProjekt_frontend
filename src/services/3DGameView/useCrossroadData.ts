import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IMapObject } from '../streetplaner/IMapObject'
import { Scene } from 'three';
import { Client } from '@stomp/stompjs';
import { off } from 'process';
import { reactive } from 'vue';
import { SphereGeometry } from 'troisjs';

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
let trafficLights = reactive(new Map<number, ITrafficLight>())
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
                    trafficLights.get(Number(key))!.object3d.getObjectByName("sphere").material.color.setHex(0x77dd77);
                    break;
                case 'YELLOW':
                    trafficLights.get(Number(key))!.currentState = 'YELLOW'
                    trafficLights.get(Number(key))!.object3d.getObjectByName("sphere").material.color.setHex(0xdddd77);
                    break;
                case 'REDYELLOW':
                    trafficLights.get(Number(key))!.currentState = 'REDYELLOW'
                    trafficLights.get(Number(key))!.object3d.getObjectByName("sphere").material.color.setHex(0xdddd77);
                    break;
                case 'RED':
                    trafficLights.get(Number(key))!.currentState = 'RED'
                    trafficLights.get(Number(key))!.object3d.getObjectByName("sphere").material.color.setHex(0xdd7777);
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

/*
function loadGLTF(path: string, scene: Scene, xParent: number, yParent: number, xOffset: number, yOffset: number, rotation: any, objectId: number) {
    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.position.set(xParent + xOffset, 0, yParent + yOffset)
        model.scale.set(0.5, 0.5, 0.5)
        model.rotation.set(0, rotation, 0)

        //crossroadMap.get(objectId)?.trafficLights.set(model.id, { tlId: model.id, currentState: "", object3d: model } as ITrafficLight);
        scene.add(model)

        const light = new THREE.SpotLight(0xff0040, 5, 10, 0.2);
        light.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 8), new THREE.MeshBasicMaterial({ color: 0xff0040 })));
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
} */

function toggle() {
    //addCrossroad(4)
    console.log(trafficLights)

}

async function addCrossroad(tlAmount: number, scene: Scene, x: number, y: number, rotationMap: Map<any, any>) {
    fetch(`/api/crossroad?tlAmount=${tlAmount}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(id => {
            let xOffset = 3
            let yOffset = 3
            let newCrossroad: ICrossroad = {
                crId: id,
                trafficLights: new Map<number, ITrafficLight>()
            }
            crossroadMap.set(id, newCrossroad)
            getCrossroad(id, scene, x, y, rotationMap)
        })
}

async function getCrossroad(crId: number, scene: Scene, x: number, y: number, rotationMap: Map<any, any>) {
    try {
        const response = await fetch(`/api/crossroad/${crId}`);
        const data = await response.json();
        const crData = data as GetCrossroadResponseDTO;
        const position = [
            { x: 3, y: 3 },
            { x: -3, y: 3 },
            { x: -3, y: -3 },
            { x: 3, y: -3 }
        ]

        for (let i = 0; i < crData.tl.length; i++) {
            const tl = crData.tl[i];
            try {
                const object3d = await new Promise((resolve) => {
                    loader.load("/../../../public/3D_Models/TrafficLight/Traffic_Light.gltf", (gltf) => {
                        const model = gltf.scene;
                        model.position.set(x + position[i].x, 0, y + position[i].y);
                        model.scale.set(0.5, 0.5, 0.5);
                        model.rotation.set(0, rotationMap.get(i), 0)

                        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 8))
                        sphere.material = new THREE.MeshBasicMaterial({ color: 0xFFD1D7 })
                        sphere.name = "sphere"
                        sphere.position.set(0, 5, 0)
                        model.add(sphere)
                        scene.add(model);
                        resolve(model);
                    });
                });
                trafficLights.set(
                    tl.tlId,
                    {
                        tlId: tl.tlId,
                        currentState: tl.currentState as unknown as Light,
                        object3d: object3d,
                        crId: tl.crId
                    } as ITrafficLight
                );
            } catch (error) {
                console.error(`Error loading model for traffic light ${tl.tlId}: ${error}`);
            }
        }
        console.log(trafficLights)
    } catch (error) {
        console.log(error);
    }
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
        toggle,
        crossroadMap,
        addCrossroad,
        getCrossroad,
        deleteCrossroad
    }
}