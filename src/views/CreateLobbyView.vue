<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <h1>Create Lobby</h1>

    <div class="container">
        <div class="content">
            <div class="head">
                <h2>Lobby erstellen</h2>
            </div>

            <div class="formWrapper">
                <div class="lobbyInput">
                    <div class="field-wrap">
                        <label for="lobby_name"> <b>Lobby-Name</b></label>
                        <input
                            type="text"
                            name="lobby_name"
                            v-model="lobbyNameInput"
                            placeholder="Lobbyname eingeben"
                        />
                    </div>

                    <!--div class="field-wrap">
                        <label for="lobby_mode"> <b>Lobby-Mode</b></label>
                        <select v-model="lobbyModeSelect" @change="switchSelect()">
                            <option disabled value="Lobby Modus auswaehlen">Lobby Modus auswaehlen</option>
                            <option value="build">BuildMode</option>
                            <option value="play">PlayMode</option>
                        </select>
                    </div>

                    <div class="field-wrap">
                        <label for="map"><b>Karte</b></label>
                        <select v-model="mapSelect" @change="switchMapSelect()">
                            <option disabled value="Karte auswaehlen">Karte auswaehlen</option>
                            <option value="+">+ neue Karte anlegen</option>
                            <option v-for="map in mapList" :value="map.name">
                                {{ map.name }}
                            </option>
                        </select>
                    </div>

                    <div v-if="showAddNewMap" class="mapWrap">
                        <label for="add_map"><b>+ Karte</b></label>
                        <input type="text" name="add_map" v-model="addNewMapInput" placeholder="Kartenname" />
                        <button @click="addMap()">+</button>
                    </div-->

                    <div class="field-wrap">
                        <label for="last_name"><b>Passwort</b></label>
                        <input
                            type="password"
                            name="password"
                            v-model="passwordInput"
                            placeholder="Passwort eingeben"
                        />
                    </div>

                    <div class="buttonBox">
                        <div class="button1">
                            <BasicButton
                                class="sec btn blue"
                                display="Erstellen"
                                :btn_click="
                                    () => {
                                        //set ActiveLoppy property to the selected Lobby
                                        createNewLobby(lobbyNameInput, 0, lobbyModeInput)
                                    }
                                "
                            />
                        </div>

                        <div class="button2">
                            <BasicButton
                                class="ter btn grey"
                                display="Abbrechen"
                                :btn_click="
                                    () => {
                                        router.push('/lobby')
                                    }
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BasicButton from "../components/Buttons/BasicButton.vue"
import Header from "../components/Header.vue"
import router from "../router/router"
import { E_LobbyMode } from "../typings/E_LobbyMode"

/*
import { useMyMaps } from "../services/useMyMaps"
import useUser from "../services/UserStore"
import { ILobby } from "../typings/ILobby"
*/
import { createNewLobby, useLobbyList } from "../services/useLobbyList"
import { onMounted, ref } from "vue"
const { receiveLobbyUpdates, leaveLobbyMessage, closeLobbyMessage } = useLobbyList()
onMounted(() => {
    //activate websockets connection to listen for incoming updates
    receiveLobbyUpdates()
})

const lobbyNameInput = ref("")
const passwordInput = ref("")
const lobbyModeInput = ref(E_LobbyMode.BUILD_MODE)
/*
const lobbyModeSelect = ref("")
const mapSelect = ref("")
const addNewMapInput = ref("")
const showAddNewMap = ref(false)
const mapList = useMyMaps().test_list
const { user, userId, hostId, activeLobby, setActiveLobby } = useUser()
const { receiveLobbyUpdates, joinMessage } = useLobbyList()

function setPlayMode() {
    lobbyModeInput.value = E_LobbyMode.PLAY_MODE
}

function setBuildMode() {
    lobbyModeInput.value = E_LobbyMode.BUILD_MODE
}

function addMap() {
    mapList.push({userId: 1, lobbyName: "addNewMapInput.value", date: "test" })
    showAddNewMap.value = false
    addNewMapInput.value = ""
    mapSelect.value = ""
}

function switchSelect() {
    if (lobbyModeSelect.value === "play") {
        setPlayMode()
    } else if (lobbyModeSelect.value === "build") {
        setBuildMode()
    }
}

function switchMapSelect() {
    if (mapSelect.value === "+") {
        showAddNewMap.value = true
    }
    console.log(showAddNewMap.value)
}
*/
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    margin-top: 20vh;
    height: 25em;
}

.content {
    border-radius: 8px;

    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 0.5fr 2fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
        "Header Header"
        "Form Form"
        ". Button";
    height: 90%;
    width: 29em;
    background-color: var(--woe-gray-30);
}

.mapWrap {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
}

.mapWrap input {
    width: 85%;
    flex-grow: 1;
}

.head {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 10px;
    font-size: 20px;

    grid-area: Header;
    padding-left: 1em;
    height: 2em;
}

.lobbyInput {
    width: 100%;
    padding-left: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    height: 50%;
}

select {
    width: 70%;
}

.field-wrap {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
}

.field-wrap label {
    width: 30%;
}

.field-wrap input {
    width: 70%;
    flex-grow: 1;
}

label {
    margin-right: 20px;
    width: 40%;
}
.buttonBox {
    display: grid;
    grid-template-columns: 1fr 0.5fr 0.5fr;
    grid-template-rows: 25%;
    gap: 10px 10px;
    grid-template-areas: ". button1 button2";

    width: 100%;
    height: 3em;
    padding-top: 20px;

    grid-area: Button;
}

.button1 {
    grid-area: button1;
}
.button2 {
    grid-area: button2;
}

.formWrapper {
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    width: 400px;

    grid-area: Form;
}

input {
    width: auto;
    height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--woe-gray-40);
    border-radius: 5px;
}
</style>
