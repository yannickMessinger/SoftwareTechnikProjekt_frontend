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

/**
 * initialize Audio Object, set volume, start and init listener for play ambient sound again after its over
 
*/
function initAmbientSound() {
    ambientSound = new Audio(AMBIENT_SOUND_PATH)
    ambientSound.volume = 0.2
    ambientSound.play()
    ambientSound.addEventListener("ended", (e) => {
        ambientSound.play()
    })
}
/**
 * play crash sound
 */
function playCrashSound() {
    crashSound.currentTime = 1
    crashSound.play()
}
/**
 * stop ambient Sound
 */
function stopAmbientSound() {
    ambientSound.pause()
}
/**
 * play Horn
 */
function playHorn() {
    sendHornMessage()
}
/**
 * play horn from other cars if other car distance lower as 100
 *
 * @param distance from other car
 */
function playHornFromFromOtherCar(distance: number) {
    const MAX_HEARING_HORN_DISTANCE = 50
    if (distance <= MAX_HEARING_HORN_DISTANCE) {
        audioHorn.volume = calculateSoundVolume(distance, MAX_HEARING_HORN_DISTANCE)
        audioHorn.play()
    }
}

/**
 * Play your own electric car engine.
 * To avoid start sound while driving (because of audio loop): if track ends set currenTime (starttime) to 15
 */
function playYourEngine() {
    audioEngine.volume = 0.1
    let buffer = 3
    if (audioEngine.currentTime > audioEngine.duration - buffer) {
        audioEngine.currentTime = 15
    }
    if (audioEngine.paused) {
        audioEngine.play()
    }
}
/**
 * Stop engine
 */
function stopYourEngine() {
    if (!audioEngine.paused) {
        audioEngine.pause()
    }
}

/**
 * Method so that the engine sound is played for nearby cars, depending on the distance.
 * The  cars on the map (Audio Objects)  are managed in the map audioEnginesOtherCars.
 *  When the car approaches for the first time the car audio is initialized and set in the map.
 * In the following approaches, the audio object with the corresponding ID is fetched from the map.
 * @param carId  - to differentiate the individual cars on the map
 * @param distance - distance between you and the other player car
 */
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

/**
 * Equivalent zu playEngineFromOtherCar only with npcs (cars and trains (because they make noise)).
 * The only difference is that by the objectTypeId still differentiates between different audio files. e.g. Is it a train play train sound
 * Thomas easter egg: Play other train sound if your name is Thomas :)
 * @param id  - to differentiate die indivdual npcs (cars and trains..)
 * @param distance - distance between you and npc
 * @param objectTypeId - to differentiate between Car(s) and train
 */
function playEngineFromNPC(id: number, distance: number, objectTypeId: number) {
    let volume = calculateSoundVolume(distance, 30)
    let engine
    if (audioEnginesOtherCarsNPC.has(id)) {
        engine = audioEnginesOtherCarsNPC.get(id)
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
            audioEnginesOtherCarsNPC.set(id, engine)
            engine.volume = volume
            engine.play()
        }
    }
}

/**
 * is used in methods playEngineFromNPC and playEngineFromOtherCar to calculate volume based on the distance
 * @param distance - current distance
 * @param factor - "absolute Distance" to to "invert" distance values. A long distance will get a low volume and a close distance will get a high volume
 * @returns the right volume value based on distance. Volume must be between 0 and 1, for this reason divide by 100
 */
function calculateSoundVolume(distance: number, factor: number) {
    distance -= factor
    return Math.abs(distance) / 100
}

/**
 * To pause the right car engine by id
 * @param carId to differentiate the individual cars on the map
 */
function pauseEngineFromOtherCar(carId: number) {
    if (audioEnginesOtherCars.has(carId)) {
        let engine = audioEnginesOtherCars.get(carId)
        if (engine !== undefined) {
            engine.pause()
        }
    }
}

/**
 * To pause the right NPC sound by id
 * @param id to differentiate die indivdual npcs (cars and trains..)
 */
function pauseEngineFromNPC(id: number) {
    if (audioEnginesOtherCarsNPC.has(id)) {
        let engine = audioEnginesOtherCarsNPC.get(id)
        if (engine !== undefined) {
            engine.pause()
        }
    }
}
/**
 * Stop all Engines (e.g. if you close want to close the game)
 */
function stopAllEngines() {
    audioEnginesOtherCars.forEach((engine) => {
        engine.pause()
    })
}

/**
 * Stop all NPC sounds (e.g. if you close want to close the game)
 */
function stopAllEnginesNPC() {
    audioEnginesOtherCarsNPC.forEach((engine) => {
        engine.pause()
    })
}

/**
 * connect HornSound WebSocket to get Horn sound from other players
 */
function connectHornSound() {
    let socket = new WebSocket(ws_url)
    stompClient = Stomp.over(socket)
    stompClient.connect({}, onConnected)
}
/**
 * subscribe Channel
 */
function onConnected() {
    subscription = stompClient.subscribe(DEST + lobbyId, onHornMessageReceived)
}

/**
 * unbuscribe subscription
 */
function disconnectHornSound() {
    subscription.unsubscribe()
}

/**
 * Send horn message to broker channel- with x and y coordinates to calculate distance for volume control.
 */
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

/**
 * Receive HornMessage, calculate distance with x and y pos and call horn sound
 * @param payload
 */
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
