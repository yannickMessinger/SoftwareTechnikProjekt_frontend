import { MovmentInputController } from "../../models/MovementInputController"

export class CollisionResetService {
    public playerResetPositions: any
    public playerResetRotation: any
    public movementInputController: any

    constructor(movementInputController: MovmentInputController) {
        this.movementInputController = movementInputController
    }

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

    resetCar() {
        this.movementInputController.resetCarAndCameraPosition(this.playerResetPositions, this.playerResetRotation)
    }
}
