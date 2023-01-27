import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs"
import {} from "vue"
import { IPosition } from "../typings/IPosition"

const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/sound/"
const SEND_MSG = "/app/sound.horn/"

let ambientSound: HTMLAudioElement
let audioHorn = new Audio("/../../src/sound/honk-sound.wav")
let audioEngine = new Audio("/../../src/sound/engine-sound.mp3")
const audioEnginesOtherCars = new Map<number, HTMLAudioElement>()
const audioEnginesOtherCarsNPC = new Map<number, HTMLAudioElement>()

let lobbyId: number
let payloadObject: IPosition

let stompClient: CompatClient
let subscription: StompSubscription

interface ISoundMessage {
    type: string
    posX: number
    posY: number
}

function initAmbientSound() {
    ambientSound = new Audio("/../../../src/sound/ambient_bird_sound.mp3")
    ambientSound.volume = 0.5
    ambientSound.play()
    ambientSound.addEventListener("ended", (e) => {
        ambientSound.play()
    })
}

function stopAmbientSound() {
    ambientSound.pause()
}

function playHorn() {
    sendHornMessage()
}

function playHornFromFromOtherCar(distance: number) {
    if (distance <= 100) {
        audioHorn.volume = calculateSoundVolume(distance, 100)
        audioHorn.play()
    }
}

function playEngine() {
    let buffer = 0.09
    audioEngine.volume = 0.04
    if (audioEngine.currentTime > audioEngine.duration - buffer) {
        audioEngine.currentTime = 0.03
    }
    if (audioEngine.paused) {
        audioEngine.play()
    }
}

function stopEngine() {
    audioEngine.pause()
}

function playEngineFromOtherCar(carId: number, distance: number) {
    let volume = calculateSoundVolume(distance, 20)
    let engine
    if (audioEnginesOtherCars.has(carId)) {
        engine = audioEnginesOtherCars.get(carId)
        if (engine !== undefined) {
            engine.volume = volume
            if (engine.paused) {
                engine.play()
            }
        }
    } else {
        engine = new Audio("/../../src/sound/engine-sound_other.mp3")
        audioEnginesOtherCars.set(carId, engine)
        engine.volume = volume
        engine.play
    }
}

function playEngineFromOtherCarNPC(carId: number, distance: number, objectTypeId : number ) {
    let volume = calculateSoundVolume(distance, 20)
    let engine
    if (audioEnginesOtherCarsNPC.has(carId)) {
        engine = audioEnginesOtherCarsNPC.get(carId)
        if (engine !== undefined) {
            engine.volume = volume
            if (engine.paused) {
                engine.play()
            }
        }
    } else {
        if(objectTypeId === 14) {
            engine = new Audio("/../../src/sound/train_sound.mp3")
        }else {
            engine = new Audio("/../../src/sound/engine-sound_other.mp3")
        }
        audioEnginesOtherCarsNPC.set(carId, engine)
        engine.volume = volume
        engine.play
    }
}

function calculateSoundVolume(distance: number, factor: number) {
    //console.log(distance)
    distance -= factor
    return Math.abs(distance) / 100
}

function pauseEngineFromOtherCar(carId: number) {
    if (audioEnginesOtherCars.has(carId)) {
        let engine = audioEnginesOtherCars.get(carId)
        if (engine !== undefined) {
            engine.pause()
        }
    }
}

function stopAllEngines() {
    audioEnginesOtherCars.forEach((engine) => {
        engine.pause()
    })
}

function pauseEngineFromOtherCarNPC(carId: number) {
    if (audioEnginesOtherCarsNPC.has(carId)) {
        let engine = audioEnginesOtherCarsNPC.get(carId)
        if (engine !== undefined) {
            engine.pause()
        }
    }
}

function stopAllEnginesNPC() {
    audioEnginesOtherCarsNPC.forEach((engine) => {
        engine.pause()
    })
}

export function useSound(activeLobbyId: number, payload: IPosition) {
    lobbyId = activeLobbyId
    payloadObject = payload
    return {
        playHorn,
        playEngine,
        stopEngine,
        pauseEngineFromOtherCar,
        playEngineFromOtherCar,
        connectSound,
        initAmbientSound,
        stopAmbientSound,
        disconnectSound,
        stopAllEngines,
        pauseEngineFromOtherCarNPC,
        playEngineFromOtherCarNPC,
        stopAllEnginesNPC,
    }
}

function connectSound() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnected, onError)
}

function onConnected() {
    subscription = stompClient.subscribe(DEST + lobbyId, onMessageReceived)
}

function disconnectSound() {
    subscription.unsubscribe()
}

function sendHornMessage() {
    if (stompClient) {
        const soundMessage: ISoundMessage = {
            type: "HORN",
            posX: payloadObject.x,
            posY: payloadObject.z,
        }
        stompClient.send(SEND_MSG + lobbyId, {}, JSON.stringify(soundMessage))
    }
}

function onError(error: Error) {}

function onMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)
    console.log(message)
    if ((message.type = "HORN")) {
        let distance = Math.abs(payloadObject.x - message.posX) + Math.abs(payloadObject.z - message.posY)
        playHornFromFromOtherCar(distance)
    }
}
