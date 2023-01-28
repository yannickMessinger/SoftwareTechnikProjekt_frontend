import * as THREE from "three"
import { useCrashSound } from "../useSound"
import { useCarMultiplayer } from "./useCarMultiplayer"

const { positionState } = useCarMultiplayer()
const { playCrashSound } = useCrashSound()

export class CollisionService {
    public car: any
    public carBB: any

    constructor(car: any) {
        this.car = car
        this.carBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    }

    updateCarBoundingBox() {
        if (this.car.value != null) {
            this.carBB.setFromObject(this.car.value.mesh)
        }
    }

    checkCollision(
        objects: { id: number; box: THREE.Box3 }[],
        playerObjectMap: Map<any, any>,
        collisionResetService: any
    ): boolean {
        if (objects.length == 0) {
            return false
        } else {
            for (let i = 0; i < objects.length; i++) {
                if (this.carBB.intersectsBox(objects[i].box)) {
                    playCrashSound()
                    collisionResetService.resetCar()
                    return true
                }
            }
            playerObjectMap.forEach((player) => {
                let playerBB: THREE.Box3 = new THREE.Box3().setFromObject(player)
                if (this.carBB.intersectsBox(playerBB)) {
                    playCrashSound()
                    collisionResetService.resetCar()
                    return true
                }
            })
            return false
        }
    }
}
