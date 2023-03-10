import * as THREE from "three"
import { KeyboardState } from "./KeyboardState"

export class MovmentInputController {
    public camera: any
    public KEYS: any
    public previousKeys: any
    public objects: any
    public box: any
    public target: any
    public translation: any
    public pressedKey: any
    public clock: any
    public keyboard: KeyboardState
    public rotation: number
    public rotAngle: number

    public hornPlayed: boolean
    public enginePlayed: boolean

    //temp data
    walkDirection = new THREE.Vector3()

    //constant

    moveVelocity = 0

    constructor(objects: any, camera: any) {
        this.objects = objects
        this.camera = camera
        this.target = document
        this.rotation = 0
        this.rotAngle = 0
        this.clock = new THREE.Clock()
        this.translation = new THREE.Vector3(0, 1, 0)
        this.KEYS = { a: 65, s: 83, w: "w", d: 68 }
        this.keyboard = new KeyboardState()
        this.hornPlayed = false
        this.enginePlayed = true
        this.initialize()
    }

    initialize() {}

    public update() {
        const velocity = 0.05
        this.updateTranslation()
        this.updateCamera()
        this.updateSound()
    }

    updateTranslation() {
        const delta = this.clock.getDelta() // seconds
        const movespeed = 2 * delta //speed
        const rotateAngle = (Math.PI / 2) * delta //rotation Angle

        if (this.keyboard.pressed("W")) {
            if (this.moveVelocity < 0.2) {
                this.moveVelocity += movespeed / 20
            }
            this.objects.value.mesh.translateZ(-this.moveVelocity)
        }
        if (this.keyboard.pressed("S")) {
            if (this.moveVelocity >= 0) {
                this.moveVelocity -= movespeed / 30
            } else {
                this.objects.value.mesh.translateZ(movespeed)
            }
        }
        if (this.keyboard.pressed("D")) {
            this.objects.value.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
            this.rotation -= rotateAngle
            if (this.rotation < -1) {
                this.rotation += 2
            }
        }
        if (this.keyboard.pressed("A")) {
            this.objects.value.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
            this.rotation += rotateAngle
            if (this.rotation > 1) {
                this.rotation += -2
            }
        }
        if (this.keyboard.pressed("Q")) {
            this.objects.value.mesh.translateY(movespeed)
        }
        if (this.keyboard.pressed("E")) {
            this.objects.value.mesh.translateY(-movespeed)
        }
        if (!this.keyboard.pressed("W") && this.moveVelocity > 0) {
            if (this.moveVelocity > 0) {
                this.moveVelocity -= movespeed / 30
                this.objects.value.mesh.translateZ(-this.moveVelocity)
            }
        }
    }
    updateCamera() {
        let relativeCameraOffset = new THREE.Vector3(0, 0.5, 2)
        let cameraOffset = relativeCameraOffset.applyMatrix4(this.objects.value.mesh.matrixWorld)
        this.camera.value.camera.position.x = this.objects.value.mesh.position.x
        this.camera.value.camera.position.y = this.objects.value.mesh.position.y
        this.camera.value.camera.position.z = this.objects.value.mesh.position.z
        this.camera.value.camera.setRotationFromEuler(this.objects.value.mesh.rotation)
    }

    resetCarAndCameraPosition(resetPosition: any, resetRotation: any) {
        this.objects.value.mesh.position.x = resetPosition.x
        this.objects.value.mesh.position.y = 0.75
        this.objects.value.mesh.position.z = resetPosition.z
        this.objects.value.mesh.setRotationFromEuler(
            new THREE.Euler(resetPosition._x, resetPosition._y, resetPosition._z, resetPosition.order)
        )
        this.updateCamera()
        this.moveVelocity = 0
    }

    updateSound() {
        if (this.keyboard.pressed("Y")) {
            this.hornPlayed = true
        } else {
            this.hornPlayed = false
        }
        if (this.moveVelocity > 0) {
            this.enginePlayed = true
        } else if (this.keyboard.pressed("S")) {
            this.enginePlayed = true
        } else {
            this.enginePlayed = false
        }
    }

    getPositionX() {
        return this.objects.value.mesh.position.x
    }
    getPositionY() {
        return this.objects.value.mesh.position.y
    }
    getPositionZ() {
        return this.objects.value.mesh.position.z
    }
    getRotation() {
        return this.objects.value.mesh.rotation
    }
}
