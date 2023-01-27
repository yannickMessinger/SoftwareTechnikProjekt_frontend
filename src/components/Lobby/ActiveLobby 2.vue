<!-- <template>
    <div class="headline">
        <h2>Aktive Lobby</h2>
    </div>
    <div class="container">
        <div class="LobbyName">
            <!-- korrekter Lobbyname anzeigen-->
            <p><b>Rüdigers Lobby</b></p>
        </div>
        <div class="LobbyClose">
            <!-- für Host lobby schließen für Client lobby verlassen anzeigen-->
            <div v-if="isHost">
                <button class="red" @click="leaveLobby()">Lobby schließen</button>
            </div>
            <div v-else>
                <button class="red" @click="leaveLobby()">Lobby verlassen</button>
            </div>
        </div>
        <div class="KartenName">
            <!-- korrekten Kartennamen anzeigen-->
            <p><b>Rüdigers Karte</b></p>
        </div>
        <div class="PlayMode">
            <!-- auf den Switch Button reagieren und korrekten Modus anzeigen-->
            <p v-if="!buildMode" @click="goBuild()"><b>Modus:</b> Fahrmodus</p>
            <p v-if="buildMode" @click="goDrive()"><b>Modus:</b> Baumodus</p>
        </div>
        <div class="SwitchMode">
            <button v-if="isHost" @click="changeGamemode()">Wechseln</button>
        </div>
        <div class="Button2">
            <!-- boolean einbauen entweder Bauansicht oder Fahransicht anzeigen je nach Lobbymodus-->
            <button class="green" v-if="buildMode" @click="">zur Bauansicht</button>
            <button class="green" v-if="!buildMode">zur Fahransicht</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import router from "../../router/router"

const isHost = ref(true)
const buildMode = ref(false)
let gameId = ref(20) //TODO: gameId must refers to the id in the backend

function changeGamemode() {
    if (buildMode.value) {
        buildMode.value = false
    } else {
        buildMode.value = true
    }
}

function goBuild() {
    const url = "/edit/" + { gameId }
    router.push(url)
}

function goDrive() {
    const url = "/game/" + { gameId }
    router.push(url)
}

function leaveLobby() {
    router.push("/lobby")
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
</style> -->
