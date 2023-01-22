import * as THREE from "three"
import { reactive, ref } from "vue"
import { IPosition } from "../typings/IPosition"

export class CreatePlayerCars {
    public translation: any
    public playerCar: any
    public playerCarId: number
    public playerCarX: number
    public playerCarZ: number
    public playerCarRotation: number
    public positions: any

    constructor(position: IPosition) {
        this.translation = new THREE.Vector3(0, 1, 0)
        this.playerCarId = position.id
        this.playerCarX = position.x
        this.playerCarZ = position.z
        this.playerCarRotation = position.rotation
        this.positions = reactive({
            playerCarId: position.id,
            playerCarX: position.x,
            playerCarZ: position.z,
            playerCarRotation: position.rotation,
        })
        this.initilize()
    }

    initilize() {}

    public update() {}

    public playerCarPosUpdate(x: number, z: number, rotation: number) {
        this.playerCarX = x
        this.playerCarZ = z
        this.playerCarRotation = rotation
        //this.positions.playerCarX = x
        //this.positions.playerCarZ = z
        //this.positions.playerCarX = rotation
    }
}
