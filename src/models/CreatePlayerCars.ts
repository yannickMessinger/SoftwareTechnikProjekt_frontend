import { reactive } from "vue"
import { IPosition } from "../typings/IPosition"

export class CreatePlayerCars {
    public playerCarId: number
    public playerCarX: number
    public playerCarZ: number
    public playerCarRotation: number[]
    public positions: any

    constructor(position: IPosition) {
        this.playerCarId = position.id
        this.playerCarX = position.x
        this.playerCarZ = position.z // y is z change later when backend is adjusted
        this.playerCarRotation = [0, 0, 0]
        this.positions = reactive({
            playerCarId: position.id,
            playerCarX: position.x,
            playerCarZ: position.z, // y is z change later when backend is adjusted
            playerCarRotation: position.rotation,
        })
        this.initilize()
    }

    initilize() {}

    public update() {}

    public playerCarPosUpdate(x: number, z: number, rotation: number) {
        this.playerCarX = x
        this.playerCarZ = z
    }
}
