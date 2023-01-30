import { CompatClient, Stomp, StompSubscription } from "@stomp/stompjs"
import { IPosition } from "../../models/3D/IPosition"
import useUser from "../User/UserStore"
const { user } = useUser()
const ws_url = "ws://localhost:8080/stomp"
const DEST = "/topic/sound/"
const SEND_MSG = "/app/sound.horn/"
const AMBIENT_SOUND_PATH = "/../../../src/sound/ambient_bird_sound.mp3"
const AUDIO_HORN_PATH = "/../../src/sound/honk-sound.wav"
const AUDIO_ENGINE_PATH = "/../../src/sound/engine-sound.mp3"
const AUDIO_ENGINE_OTHER_PATH = "/../../src/sound/engine-sound_other.mp3"
const AUDIO_ENGINE_NPC_PATH = "/../../src/sound/engine-sound_npc.mp3"
const AUDIO_TRAIN_PATH = "/../../src/sound/train_sound.mp3"
const AUDIO_THOMAS_TRAIN_PATH = "/../../src/sound/thomas_sound.mp3"
const CRASH_SOUND = "/../../src/sound/crash_sound.mp3"

let ambientSound: HTMLAudioElement
let audioHorn = new Audio(AUDIO_HORN_PATH)
let audioEngine = new Audio(AUDIO_ENGINE_PATH)
let crashSound = new Audio(CRASH_SOUND)

const audioEnginesOtherCars = new Map<number, HTMLAudioElement>()
const audioEnginesOtherCarsNPC = new Map<number, HTMLAudioElement>()

const carObjectTypeIds = [7, 21, 30, 31, 32, 33]

let lobbyId: number
let payloadObject: IPosition

let stompClient: CompatClient
let subscription: StompSubscription

crashSound.volume = 0.2
interface ISoundMessage {
    type: string
    posX: number
    posY: number
}

function initAmbientSound() {
    ambientSound = new Audio(AMBIENT_SOUND_PATH)
    ambientSound.volume = 0.2
    ambientSound.play()
    ambientSound.addEventListener("ended", (e) => {
        ambientSound.play()
    })
}

function playCrashSound() {
    crashSound.currentTime = 1
    crashSound.play()
}

function stopAmbientSound() {
    ambientSound.pause()
}

function playHorn() {
    sendHornMessage()
}

function playHornFromFromOtherCar(distance: number) {
    const MAX_HEARING_HORN_DISTANCE = 100
    if (distance <= MAX_HEARING_HORN_DISTANCE) {
        audioHorn.volume = calculateSoundVolume(distance, MAX_HEARING_HORN_DISTANCE)
        audioHorn.play()
    }
}

function playYourEngine() {
    audioEngine.volume = 0.2
    let buffer = 3
    if (audioEngine.currentTime > audioEngine.duration - buffer) {
        audioEngine.currentTime = 15
    }
    if (audioEngine.paused) {
        audioEngine.play()
    }
}

function stopYourEngine() {
    if (!audioEngine.paused) {
        audioEngine.pause()
    }
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
        engine.play()
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
            if (user.userName.toUpperCase() === "THOMAS") engine = new Audio(AUDIO_THOMAS_TRAIN_PATH)
            else engine = new Audio(AUDIO_TRAIN_PATH)
        } else {
            carObjectTypeIds.forEach((carObjectTypeId) => {
                if (carObjectTypeId === objectTypeId) {
                    engine = new Audio(AUDIO_ENGINE_NPC_PATH)
                }
            })
        }
        if (engine) {
            audioEnginesOtherCarsNPC.set(carId, engine)
            engine.volume = volume
            engine.play()
        }
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
        playCrashSound,
    }
}

export function useCrashSound() {
    return {
        playCrashSound,
    }
}
