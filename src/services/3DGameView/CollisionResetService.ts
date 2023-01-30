import { MovmentInputController } from "../../models/MovementInputController"
import { IPlayerResetPosition } from "../../typings/IPlayerResetPosition"
import { IPlayerResetRotation } from "../../typings/IPlayerResetRotation"

export class CollisionResetService {
    public playerResetPositions: IPlayerResetPosition = {
        x: 0,
        y: 0,
        z: 0,
    }
    public playerResetRotation: IPlayerResetRotation = {
        x: 0,
        y: 0,
        z: 0,
        order: "XYZ",
    }
    public movementInputController: any

    constructor(movementInputController: MovmentInputController) {
        this.movementInputController = movementInputController
    }

    /**
     * Sets the spawn position of the player and the spawn rotation of the player
     * @param car Playercar in 3D which is a 3D Box from THREE.js
     */
    setResetCarPosition(car: any) {
        this.playerResetRotation = {
            x: car.value.mesh.rotation._x,
            y: car.value.mesh.rotation._y,
            z: car.value.mesh.rotation._z,
            order: "XYZ",
        }
        this.playerResetPositions = {
            x: car.value.mesh.position.x,
            y: car.value.mesh.position.y,
            z: car.value.mesh.position.z,
        }
    }
    /**
     * Resets the car position and rotation to the beginning of the game
     */
    resetCar() {
        this.movementInputController.resetCarAndCameraPosition(this.playerResetPositions, this.playerResetRotation)
    }
}
