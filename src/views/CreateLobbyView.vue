<template>
    <Header :displayHomebutton="true"></Header>

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

                    <div class="buttonBox">
                        <div class="button1">
                            <BasicButton
                                class="sec btn blue"
                                display="Erstellen"
                                :btn_click="
                                    () => {
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
import { createNewLobby, useLobbyList } from "../services/useLobbyList"
import { onMounted, ref } from "vue"

const { receiveLobbyUpdates } = useLobbyList()
const lobbyNameInput = ref("")
const lobbyModeInput = ref(E_LobbyMode.BUILD_MODE)

onMounted(() => {
    //activate websockets connection to listen for incoming updates
    receiveLobbyUpdates()
})
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
