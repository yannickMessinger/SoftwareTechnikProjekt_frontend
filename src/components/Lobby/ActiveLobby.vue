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
                <b>{{ activeLobby.lobbyName }}</b>
            </p>
        </div>
        <div class="LobbyClose">
            <div v-if="userId === activeLobby.hostId">
                <button class="red">Lobby Schließen</button>
            </div>
        </div>
        <div class="PlayMode">
            <p><b>Modus:</b> {{ activeLobby.lobbyModeEnum }}</p>
        </div>
        <div class="SwitchMode">
            <div v-if="userId === activeLobby.hostId">
                <button @click="setActiveLobbyToBuildMode">Planungs-Modus</button>
            </div>
        </div>
        <div class="Button1">
            <button>Weitermachen</button>
        </div>
        <div class="Button2">
            <div v-if="userId === activeLobby.hostId">
                <button class="green" @click="setActiveLobbyToPlayMode">Fahren</button>
            </div>
            <div v-else>
                <button class="green">Fahren</button>
            </div>
        </div>
        <div class="Button3">
            <button class="grey">Lobby verlassen</button>
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
import { onBeforeMount, onBeforeUpdate, onMounted, ref, watch } from "vue"

const { name, user, userId, hostId, activeLobby, setActiveLobby } = useUser()
const { connectLobbyWs, disconnectLobby } = useChat(name.value, activeLobby.value)
const lobbyIdRef = ref(activeLobby.value.lobbyId)

onMounted(() => {
    //activate websockets connection to listen for incoming updates
    //connectLobbyWs for lobby chat

    connectLobbyWs()
})

//Methods to switch Lobbymode
function setActiveLobbyToBuildMode() {
    activeLobby.value.lobbyModeEnum = E_LobbyMode.BUILD_MODE
    useLobbyList().changeLobbyModeMessage()
}

function setActiveLobbyToPlayMode() {
    activeLobby.value.lobbyModeEnum = E_LobbyMode.PLAY_MODE
    useLobbyList().changeLobbyModeMessage()
}
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
