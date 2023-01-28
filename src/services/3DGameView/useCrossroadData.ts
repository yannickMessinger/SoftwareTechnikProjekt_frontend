import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { IMapObject } from "../streetplaner/IMapObject"
import { Scene } from "three"

interface ICrossroad {
    id: number
    trafficLights: Map<number, {}>
}

let crossroadMap = new Map<number, ICrossroad>()

function loadTrafficLight(object: IMapObject, scene: Scene, x: number, y: number, rotationMap: Map<any, any>) {
    //if (object.objectTypeId !== 2) return

    const path = "/../../../public/3D_Models/TrafficLight/Traffic_Light.gltf"
    const loader = new GLTFLoader()
    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.position.set(x + 3, 0, y + 3)
        model.scale.set(0.5, 0.5, 0.5)
        model.rotation.set(0, rotationMap.get(0), 0)

        if (!crossroadMap.has(object.objectId!)) {
            crossroadMap.set(object.objectId!, {
                id: object.objectId!,
                trafficLights: new Map<number, {}>(),
            })
        }
        crossroadMap.get(object.objectId!)?.trafficLights.set(model.id, model)
        scene.add(model)
    })

    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.position.set(x + 3, 0, y - 3)
        model.scale.set(0.5, 0.5, 0.5)
        model.rotation.set(0, rotationMap.get(3), 0)

        if (!crossroadMap.has(object.objectId!)) {
            crossroadMap.set(object.objectId!, {
                id: object.objectId!,
                trafficLights: new Map<number, {}>(),
            })
        }
        crossroadMap.get(object.objectId!)?.trafficLights.set(model.id, model)
        scene.add(model)
    })

    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.position.set(x - 3, 0, y - 3)
        model.scale.set(0.5, 0.5, 0.5)
        model.rotation.set(0, rotationMap.get(2), 0)

        if (!crossroadMap.has(object.objectId!)) {
            crossroadMap.set(object.objectId!, {
                id: object.objectId!,
                trafficLights: new Map<number, {}>(),
            })
        }
        crossroadMap.get(object.objectId!)?.trafficLights.set(model.id, model)
        scene.add(model)
    })

    loader.load(path, (gltf) => {
        const model = gltf.scene
        model.position.set(x - 3, 0, y + 3)
        model.scale.set(0.5, 0.5, 0.5)
        model.rotation.set(0, rotationMap.get(1), 0)

        if (!crossroadMap.has(object.objectId!)) {
            crossroadMap.set(object.objectId!, {
                id: object.objectId!,
                trafficLights: new Map<number, {}>(),
            })
        }
        crossroadMap.get(object.objectId!)?.trafficLights.set(model.id, model)
        scene.add(model)
    })
    console.log(crossroadMap)
}

export default function useCrossroadData() {
    return {
        loadTrafficLight,
        crossroadMap,
    }
}
