<!--
    Component that reperents the current Lobby that the current user choose to join.
    If User is host of Lobby, he is allowed to switch the Lobby Modes. If he is not the
    host, buttons that would change the lobby mode are not displayed.

    Displays current lobby name and selected card name. 
    Displays playerstatus in the lobby (Host or Player)
    Displays lobby mode (drive mode or build mode)
    As client displayed, by clicking on button "Lobby verlassen": Player leaves current lobby and return to lobby overview.
    As host displayed, by clicking on button "Lobby schließen": Host close current lobby and return to lobby overview.
    As host displayed, by clicking on button "Wechseln": Switches lobbymode for all players in lobby. All player return to lobby.
    As host in drive mode displayed, by clicking on button "zur Fahransicht": Start drivemode for all players in lobby. All players are redirected to drive mode.
    In build mode displayed, by clicking on button "zur Bauansicht": Redirect to editor view.
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
import useUser from "../../services/User/UserStore"
import Chat from "../UI/Chat.vue"
import { useLobbyList } from "../../services/Lobby/useLobbyList"
import { useChat } from "../../services/Chat/useChat"
import { onMounted, ref, watch } from "vue"
import router from "../../router/router"
import useEventBus from "../../services/eventBus"
import { E_LobbyMode } from "../../models/Lobby/E_LobbyMode"
import { IGetMapByMapIdDTO } from "../../models/Map/IGetMapByMapIdDTO"

const { name, userId, activeLobby, setActiveLobby } = useUser()
const { activeLobbyID } = useChat(name.value, activeLobby.value)
const { receiveLobbyUpdates, leaveLobbyMessage, closeLobbyMessage, driveMessage } = useLobbyList()
const { bus } = useEventBus()

const mapName = ref("")

/**  Update const mapName with current mapName from Backend*/
getMapName().then((value) => {
    if (value != undefined) {
        const str: string = value
        mapName.value = str
    } else {
        mapName.value = "no name found"
    }
})

/** Wait for map change event to update map name when map is changed */
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

/** Switches LobbyModeEnum in active Lobby and sends a Message to all clients to change LobbyMode for all*/
function changeGamemode() {
    if (activeLobby.value.lobbyModeEnum == E_LobbyMode.PLAY_MODE) {
        activeLobby.value.lobbyModeEnum = E_LobbyMode.BUILD_MODE
    } else {
        activeLobby.value.lobbyModeEnum = E_LobbyMode.PLAY_MODE
    }
    useLobbyList().changeLobbyModeMessage()
}

/** contains the push information for the build mode destination  */
function goBuild() {
    const url = "/edit"
    router.push(url)
}

/** contains the push information for the drive mode destination */
function goDrive() {
    const url = "/game"
    driveMessage()
    router.push(url)
}

/** deactivate chat, removes player from current lobby in backend, sends closeLobbymessage and set local activeLobby data to default
 * returns player to'/lobby' view.
 */
function closeLobbyClicked() {
    deletePlayerFromLobby()
    closeLobbyMessage()
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

/** removes player from current lobby in backend, sends leaveLobbymessage and set local activeLobby data to default
 *  returns player to'/lobby' view.
 */
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
/** deletes current player from current lobby in backend */
async function deletePlayerFromLobby() {
    const url = "/api/lobby/get_players/" + activeLobby.value.lobbyId + "?player_id=" + userId.value
    try {
        const response = await fetch(url, {
            method: "DELETE",
        })

        if (!response.ok) {
            throw new Error(response.statusText)
        }
    } catch (error) {
        console.warn(" error in remove player from Lobby: " + error)
    }
    useLobbyList().updateLobbyList()
}

/* recieves name of current map from backend*/
async function getMapName() {
    const url = "/api/map/" + activeLobby.value.mapId
    try {
        const response = await fetch(url, {
            method: "GET",
        })

        if (!response.ok) {
            console.warn("error in remove player from Lobby I")
            throw new Error(response.statusText)
        }
        const result: IGetMapByMapIdDTO = await response.json()
        if (result.mapName != undefined) {
            return result.mapName
        }
        return "no name found"
    } catch (error) {
        console.warn(" error in remove player from Lobby: " + error)
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
