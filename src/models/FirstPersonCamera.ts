import * as THREE from "three"
import { InputController } from "./InputController"

export class FirstPersonCamera {
    public camera: any
    public objects: any
    public input: InputController
    public rotation: any
    public translation: any
    public phi: any
    public phiSpeed: any
    public theta: any
    public thetaSpeed: any
    public headBobActive: any
    public headBobTimer: any
    public KEYS: any
    public audio = new Audio("/../../src/sound/engine-sound.mp3")

    constructor(camera: any, objects: any) {
        this.camera = camera
        this.objects = objects
        this.input = new InputController()
        this.rotation = new THREE.Quaternion()
        this.translation = new THREE.Vector3(0, 1, 0)
        this.phi = 0
        this.phiSpeed = 8
        this.theta = 0
        this.thetaSpeed = 5
        this.headBobActive = false
        this.headBobTimer = 0
        this.objects = objects
        this.KEYS = { a: 65, s: 83, w: 87, d: 68, y: 89 }
        this.audio.volume = 0.2
    }

    update() {
        const velocity = 0.01 // random velocity
        this.updateRotation(velocity)
        this.updateCamera()
        this.updateTranslation(velocity)
        this.updateWasHonked()
        this.updateEngineSound()
        this.input.update()
    }

    updateRotation(velocity: number) {
        const xh = this.input.current.mouseXDelta / window.innerWidth
        const yh = this.input.current.mouseYDelta / window.innerHeight

        this.phi += -xh * this.phiSpeed
        this.theta = this.clamp(this.theta + -yh * this.thetaSpeed, -Math.PI / 3, Math.PI / 3)

        const qx = new THREE.Quaternion()
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
        const qz = new THREE.Quaternion()
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

        const q = new THREE.Quaternion()
        q.multiply(qx)
        q.multiply(qz)

        this.rotation.copy(q)
    }

    updateCamera() {
        this.camera.value.camera.quaternion.copy(this.rotation)
        this.camera.value.camera.position.copy(this.translation)
        this.camera.value.camera.position.y += Math.sin(this.headBobTimer * 10) * 1.5

        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyQuaternion(this.rotation)

        const dir = forward.clone()

        forward.multiplyScalar(100)
        forward.add(this.translation)

        let closest = forward
        const result = new THREE.Vector3()
        const ray = new THREE.Ray(this.translation, dir)
        this.camera.value.camera.lookAt(closest)
    }

    updateTranslation(velocity: number) {
        const forwardVelocity = (this.input.key(this.KEYS.w) ? 1 : 0) + (this.input.key(this.KEYS.s) ? -1 : 0)
        const strafeVelocity = (this.input.key(this.KEYS.a) ? 1 : 0) + (this.input.key(this.KEYS.d) ? -1 : 0)

        const qx = new THREE.Quaternion()
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)

        const forward = new THREE.Vector3(0, 0, -1)
        forward.applyQuaternion(qx)
        forward.multiplyScalar(forwardVelocity * velocity * 10)

        const left = new THREE.Vector3(-1, 0, 0)
        left.applyQuaternion(qx)
        left.multiplyScalar(strafeVelocity * velocity * 10)

        this.translation.add(forward)
        this.translation.add(left)
    }

    clamp(x: any, a: any, b: any) {
        return Math.min(Math.max(x, a), b)
    }

    updateWasHonked() {
        if (this.input.key(this.KEYS.y)) {
            var audio = new Audio("/../../src/sound/honk-sound.wav")
            audio.play()
            this.input.keys[this.KEYS.y] = false
        }
    }

    updateEngineSound() {
        if (
            this.input.key(this.KEYS.a) ||
            this.input.key(this.KEYS.w) ||
            this.input.key(this.KEYS.d) ||
            this.input.key(this.KEYS.s)
        ) {
            let buffer = 0.2
            if (this.audio.currentTime > this.audio.duration - buffer) {
                this.audio.currentTime = 0.2
            }
            this.audio.play()
        } else {
            this.audio.pause()
        }
    }
}
