import { CompatClient, Stomp } from "@stomp/stompjs"
import {} from "vue"

const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/sound"
const SEND_MSG = "/app/sound.horn"

let audioHorn = new Audio("/../../src/sound/honk-sound.wav")
let audioEngine = new Audio("/../../src/sound/engine-sound.mp3")
const audioEnginesOtherCars = new Map<number, HTMLAudioElement>()
audioEngine.volume = 0.1

let stompClient: CompatClient

interface ISoundMessage {
    type: string
    posX: number
    posY: number
}

function playHorn() {
    audioHorn.play()
    sendHornMessage(0, 0)
    //play
    //send broker - broker methoden aufrufen
}

function playHornFromFromOtherCar() {
    audioHorn.play()
}

function playEngine() {
    let buffer = 0.2
    if (audioEngine.currentTime > audioEngine.duration - buffer) {
        audioEngine.currentTime = 0.09
    }
    audioEngine.play()
}

function stopEngine() {
    audioEngine.pause()
}

function playEngineFromOtherCar(carId: number) {
    let engine
    if (audioEnginesOtherCars.has(carId)) {
        engine = audioEnginesOtherCars.get(carId)
        if (engine !== undefined) {
            if (engine.paused) {
                engine.volume = 0.01
                engine.play()
            }
        }
    } else {
        engine = new Audio("/../../src/sound/engine-sound.mp3")
        audioEnginesOtherCars.set(carId, engine)
        engine.volume = 0.01
        engine.play
    }
}

function pauseEngineFromOtherCar(carId: number) {
    if (audioEnginesOtherCars.has(carId)) {
        let engine = audioEnginesOtherCars.get(carId)
        if (engine !== undefined) {
            engine.pause()
        }
    }
}

export function useSound() {
    return {
        playHorn,
        playEngine,
        stopEngine,
        pauseEngineFromOtherCar,
        playEngineFromOtherCar,
        connectSound,
    }
}

function connectSound() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    console.log("testddd")
    stompClient.connect({}, onConnected, onError)
}

function onConnected() {
    stompClient.subscribe(DEST, onMessageReceived)
    console.log("test2")
}

function sendHornMessage(x: number, y: number) {
    console.log("test3")

    if (stompClient) {
        console.log("test4")

        const soundMessage: ISoundMessage = {
            type: "HORN",
            posX: x,
            posY: y,
        }
        stompClient.send(SEND_MSG, {}, JSON.stringify(soundMessage))
    }
}

function onError(error: Error) {}

function onMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)
    console.log("test5")

    playHornFromFromOtherCar()
}
