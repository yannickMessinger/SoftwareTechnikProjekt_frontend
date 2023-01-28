import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs"
import { IPosition } from "../typings/IPosition"

const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/sound/"
const SEND_MSG = "/app/sound.horn/"
const AMBIENT_SOUND_PATH = "/../../../src/sound/ambient_bird_sound.mp3"
const AUDIO_HORN_PATH = "/../../src/sound/honk-sound.wav"
const AUDIO_ENGINE_PATH = "/../../src/sound/engine-sound.mp3"
const AUDIO_ENGINE_OTHER_PATH = "/../../src/sound/engine-sound_other.mp3"
const AUDIO_TRAIN_PATH = "/../../src/sound/train_sound.mp3"

let ambientSound: HTMLAudioElement
let audioHorn = new Audio(AUDIO_HORN_PATH)
let audioEngine = new Audio(AUDIO_ENGINE_PATH)

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
    ambientSound = new Audio(AMBIENT_SOUND_PATH)
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

function playYourEngine() {
    audioEngine.volume = 0.2
    let buffer = 4
    if (audioEngine.currentTime > audioEngine.duration - buffer) {
        audioEngine.currentTime = 3
    }
    if (audioEngine.paused) {
        audioEngine.play()
    }
}

function stopYourEngine() {
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
        engine = new Audio(AUDIO_ENGINE_OTHER_PATH)
        audioEnginesOtherCars.set(carId, engine)
        engine.volume = volume
        engine.play
    }
}

function playEngineFromNPC(carId: number, distance: number, objectTypeId: number) {
    let volume = calculateSoundVolume(distance, 30)
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
        if (objectTypeId === 14) {
            engine = new Audio(AUDIO_TRAIN_PATH)
        } else {
            engine = new Audio(AUDIO_ENGINE_OTHER_PATH)
        }
        audioEnginesOtherCarsNPC.set(carId, engine)
        engine.volume = volume
        engine.play
    }
}

function calculateSoundVolume(distance: number, factor: number) {
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

function pauseEngineFromNPC(carId: number) {
    if (audioEnginesOtherCarsNPC.has(carId)) {
        let engine = audioEnginesOtherCarsNPC.get(carId)
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
        playYourEngine,
        stopYourEngine,
        pauseEngineFromOtherCar,
        playEngineFromOtherCar,
        initAmbientSound,
        stopAmbientSound,
        connectHornSound,
        disconnectHornSound,
        stopAllEngines,
        pauseEngineFromNPC,
        playEngineFromNPC,
        stopAllEnginesNPC,
    }
}

function connectHornSound() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnected, onError)
}

function onConnected() {
    subscription = stompClient.subscribe(DEST + lobbyId, onHornMessageReceived)
}

function disconnectHornSound() {
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

function onHornMessageReceived(payload: { body: string }) {
    const message = JSON.parse(payload.body)
    if ((message.type = "HORN")) {
        let distance = Math.abs(payloadObject.x - message.posX) + Math.abs(payloadObject.z - message.posY)
        playHornFromFromOtherCar(distance)
    }
}
