<!--
    Component that reperents the current Lobby that the current user choose to join.
    If User is host of Lobby, he is allowed to switch the Lobby Modes. If he is not the
    host, buttons that would change the lobby mode are not displayed.

    By clicking on button "Fahren": Lobbymode is changed to playmode
    By clicking on button "Planungsmodus": Lobbymode is changed to buildmode
-->

<template>
    <div class="headline">
        <h2>Aktive Lobby</h2>
    </div>
    <div class="container">
        <div class="LobbyName">
            <p>
                <b>Lobbyname: {{ activeLobby.lobbyName }}</b>
            </p>
            <p>
                <b>Kartenname: {{ mapName }}</b>
            </p>
            <p v-if="userId === activeLobby.hostId"><b>Status: Host</b></p>
            <p v-else><b>Status: Spieler</b></p>
        </div>
        <div class="LobbyClose">
            <div v-if="userId === activeLobby.hostId">
                <button class="red" @click="closeLobbyClicked()">Lobby Schließen</button>
            </div>
            <div v-else>
                <button class="red" @click="leaveLobbyClicked()">Lobby verlassen</button>
            </div>
        </div>
        <div class="PlayMode">
            <p v-if="activeLobby.lobbyModeEnum === E_LobbyMode.PLAY_MODE"><b>Modus:</b> Fahrmodus</p>
            <p v-else><b>Modus:</b> Baumodus</p>
        </div>
        <div class="SwitchMode">
            <div v-if="userId === activeLobby.hostId">
                <button @click="changeGamemode()">Wechseln</button>
            </div>
        </div>
        <div class="Button2">
            <button
                class="green"
                v-if="activeLobby.lobbyModeEnum === E_LobbyMode.PLAY_MODE && userId === activeLobby.hostId"
                @click="goDrive()"
            >
                zur Fahransicht
            </button>
            <button class="green" v-if="activeLobby.lobbyModeEnum === E_LobbyMode.BUILD_MODE" @click="goBuild()">
                zur Bauansicht
            </button>
        </div>
    </div>
    <Chat />
</template>

<script setup lang="ts">
import useUser from "../../services/UserStore"
import Chat from "../UI/Chat.vue"
import { E_LobbyMode } from "../../typings/E_LobbyMode"
import { useLobbyList } from "../../services/useLobbyList"
import { useChat } from "../../services/Chat/useChat"
import { onMounted, ref, watch } from "vue"
import router from "../../router/router"
import { IGetMapByMapIdDTO } from "../../typings/IGetMapByMapIdDTO"
import useEventBus from "../../services/eventBus"

const { name, userId, activeLobby, setActiveLobby } = useUser()
const { connectLobbyChat, disconnectLobbyChat, activeLobbyID } = useChat(name.value, activeLobby.value)
const { receiveLobbyUpdates, leaveLobbyMessage, closeLobbyMessage, driveMessage } = useLobbyList()
const { bus } = useEventBus()

const mapName = ref("")

getMapName().then((value) => {
    if (value != undefined) {
        const str: string = value
        mapName.value = str
    } else {
        mapName.value = "no name found"
    }
})

watch(
    () => bus.value.get("change-map-event"),
    (id) => {
        getMapName().then((value) => {
            if (value != undefined) {
                const str: string = value
                mapName.value = str
            } else {
                mapName.value = "no name found"
            }
        })
    }
)

let gameId = ref(20) //TODO: gameId must refers to the id in the backend

function changeGamemode() {
    if (activeLobby.value.lobbyModeEnum == E_LobbyMode.PLAY_MODE) {
        activeLobby.value.lobbyModeEnum = E_LobbyMode.BUILD_MODE
    } else {
        activeLobby.value.lobbyModeEnum = E_LobbyMode.PLAY_MODE
    }
    useLobbyList().changeLobbyModeMessage()
}

function goBuild() {
    const url = "/edit/" + { gameId }
    router.push(url)
}

function goDrive() {
    const url = "/game/" + { gameId }
    driveMessage()
    router.push(url)
}

function closeLobbyClicked() {
    //TODO: Messaage to Backend that Host Closed the lobby (delete lobby, all lobbyuser return to lobby overview)
    deletePlayerFromLobby()
    closeLobbyMessage()
    disconnectLobbyChat(activeLobbyID.value)
    setActiveLobby({
        lobbyId: -1,
        hostId: -1,
        mapId: -1,
        lobbyName: "",
        numOfPlayers: 0,
        lobbyModeEnum: E_LobbyMode.BUILD_MODE,
        playerList: [],
    })
    router.push("/lobby")
}

function leaveLobbyClicked() {
    leaveLobbyMessage()
    deletePlayerFromLobby()
    setActiveLobby({
        lobbyId: -1,
        hostId: -1,
        mapId: -1,
        lobbyName: "",
        numOfPlayers: 0,
        lobbyModeEnum: E_LobbyMode.BUILD_MODE,
        playerList: [],
    })
    router.push("/lobby")
}

async function deletePlayerFromLobby() {
    const url = "/api/lobby/get_players/" + activeLobby.value.lobbyId + "?player_id=" + userId.value
    try {
        const response = await fetch(url, {
            method: "DELETE",
        })

        if (!response.ok) {
            console.log("error in remove player from Lobby I")
            throw new Error(response.statusText)
        }
    } catch (error) {
        console.log(" error in remove player from Lobby: " + error)
    }
    useLobbyList().updateLobbyList()
}

async function getMapName() {
    const url = "/api/map/" + activeLobby.value.mapId
    try {
        const response = await fetch(url, {
            method: "GET",
        })

        if (!response.ok) {
            console.log("error in remove player from Lobby I")
            throw new Error(response.statusText)
        }
        const result: IGetMapByMapIdDTO = await response.json()
        if (result.mapName != undefined) {
            return result.mapName
        }
        return "no name found"
    } catch (error) {
        console.log(" error in remove player from Lobby: " + error)
    }
}

onMounted(() => {
    //activate websockets connection to listen for incoming updates
    receiveLobbyUpdates()
    activeLobbyID.value = activeLobby.value.lobbyId
})
</script>

<style scoped>
* {
    font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
    line-height: 20px;
}

.headline {
    display: flex;
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 10px;
}

.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 0.5fr 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
        "LobbyName LobbyName LobbyClose"
        "KartenName KartenName KartenName"
        "PlayMode PlayMode SwitchMode"
        "Button1 Button2 Button3";
    width: 90%;

    font-weight: 500;
    font-size: 16px;
    height: 300px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
}

.Button1 {
    grid-area: Button1;
    justify-self: start;
    align-self: end;
}

.Button2 {
    grid-area: Button2;
    justify-self: center;
    align-self: end;
}

.Button3 {
    grid-area: Button3;
    justify-self: end;
    align-self: end;
}

.LobbyName {
    grid-area: LobbyName;
}

.LobbyClose {
    grid-area: LobbyClose;
    justify-self: end;
}

.PlayMode {
    grid-area: PlayMode;
    align-self: start;
}

.SwitchMode {
    grid-area: SwitchMode;
    justify-self: end;
}

button {
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    padding: 13px 23px;
    background-color: var(--woe-blue-60);
    color: white;
}

button:hover {
    background-color: var(--woe-blue-70);
}

.red {
    background: var(--woe-red-60);
}

.red:hover {
    background-color: var(--woe-red-70);
}

.grey {
    background-color: var(--woe-gray-50);
}

.grey:hover {
    background-color: var(--woe-gray-60);
}

.green {
    background-color: var(--woe-green-60);
}

.green:hover {
    background-color: var(--woe-green-70);
}
</style>
