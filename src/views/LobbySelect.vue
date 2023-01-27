<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <div class="container">
        <div class="content">
            <MyMaps :liste="mapsList.mapslist" v-bind:popupTrigger="false"></MyMaps>
        </div>
        <div class="content">
            <div>
                <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
            </div>
        </div>
    </div>
    <Chat />
</template>

<script setup lang="ts">
import Chat from "../components/UI/Chat.vue"

import Header from "../components/Header.vue"
import { useLobbyList } from "../services/useLobbyList"
import { useMyMaps } from "../services/useMyMaps"

import LobbyList from "../components/Lobby/LobbyList.vue"
import MyMaps from "../components/Lobby/MyMaps.vue"
import { onMounted } from "vue"

const { lobbyList, updateLobbyList } = useLobbyList()
const { mapsList, updateMapsList } = useMyMaps()

onMounted(async () => {
    await updateLobbyList()
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    margin-top: 20vh;
}

.content {
    width: 35%;
    /*border: 2px solid var(--woe-black);*/
    border-radius: 8px;
    background-color: var(--woe-gray-30);
}
</style>
