<!-- Component that displays overview of existing lobbys and active players, also possible to add new Lobbys. Style not complete!-->
<template>
    <div v-if="showAddLobby">
        <input type="text" v-model="lobbyNameInput" placeholder="enter lobbyname" />
        <input type="number" v-model="playerNumberInput" placeholder="amount of players" />
        <select v-model="selected" @change="switchSelect($event)">
            <option disabled value="">Please select LobbyMode</option>
            <option value="build">BuildMode</option>
            <option value="play">PlayMode</option>
        </select>

        <button @click="createNewLobby(lobbyNameInput, playerNumberInput, lobbyModeInput)">create new lobby</button>
    </div>

    <div>
        <MyMaps :liste="mapsList.mapslist" v-bind:popupTrigger="false"></MyMaps>
    </div>
    <div v-if="lobbyList.lobbylist.length > 0">
        <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
    </div>
    <div v-else>
        <p>No lobbys available:(</p>
    </div>

    <!--Button to manually refresh Lobbylist
  <button @click="updateLobbys()">Refresh</button>
  <button @click="setShowLobby()">Add new Lobby</button>
  <button>Play</button>-->
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import { E_LobbyMode } from "../../models/Lobby/E_LobbyMode"
import { createNewLobby, updateLobbyList, useLobbyList } from "../../services/Lobby/useLobbyList"
import { useMyMaps } from "../../services/Lobby/useMyMaps"
import LobbyList from "./LobbyList.vue"
import MyMaps from "./MyMaps.vue"

onMounted(async () => {
    await updateLobbyList()
})

const { lobbyList } = useLobbyList()
const { mapsList } = useMyMaps()
const showAddLobby = ref(false)
const lobbyNameInput = ref("")
const playerNumberInput = ref(0)
const lobbyModeInput = ref(E_LobbyMode.BUILD_MODE)
const selected = ref("")

async function updateLobbys() {
    await updateLobbyList()
}

function setShowLobby() {
    showAddLobby.value = !showAddLobby.value
}

function setPlayMode() {
    lobbyModeInput.value = E_LobbyMode.PLAY_MODE
}

function setBuildMode() {
    lobbyModeInput.value = E_LobbyMode.BUILD_MODE
}

function switchSelect(event: any) {
    selected.value = event.target.value
    if (selected.value === "play") {
        setPlayMode()
    } else if (selected.value === "build") {
        setBuildMode()
    }
}
</script>

<style scoped>
/*.flex-container {
  display: flex;
  align-items: flex-start;
}
*/

h3 {
    text-align: center;
}

button {
    background-color: rgb(255, 200, 0);
    color: rgb(63, 63, 63);
    font-family: Arial, Helvetica, sans-serif;
    padding: 15px 32px;
    font-size: 14px;
    font-weight: bold;
    margin: 4px 2px;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
    border: none;
}

button:hover {
    background-color: rgb(219, 172, 0);
}
</style>
