import * as THREE from "three"
import { reactive, ref } from "vue"

export class CreatePlayerCars {
    public translation: any
    public playerCar: any
    public playerCarId: number
    public playerCarX: number
    public playerCarZ: number
    public playerCarRotation: number
    public positions: any

    constructor(playerID: number, x: number, z: number, rotation: number) {
        this.translation = new THREE.Vector3(0, 1, 0)
        this.playerCarId = playerID
        this.playerCarX = x
        this.playerCarZ = z
        this.playerCarRotation = rotation
        this.positions = reactive({ playerCarId: playerID, playerCarX: x, playerCarZ: z, playerCarRotation: rotation })
        this.initilize()
    }

    initilize() {}

    public update() {}

    public playerCarPosUpdate(x: number, z: number, rotation: number) {
        this.playerCarX = x
        this.playerCarZ = z
        this.playerCarRotation = rotation
    }
}
