<!--
    Displays MyMaps component for Host Player.
-->

<template>
    <Header :displayHomebutton="true"></Header>
    <div class="container">
        <div class="content">
            <ActiveLobby></ActiveLobby>
        </div>
        <div class="content">
            <PlayerList :liste="playerList"></PlayerList>
        </div>
    </div>
    <div class="container2">
        <div v-if="userId === hostId" class="content2">
            <MyMaps v-bind:popupTrigger="false"></MyMaps>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import Header from "../components/UI/Header.vue"
import PlayerList from "../components/Lobby/PlayerList.vue"
import { usePlayerList } from "../services/User/usePlayerList"
import ActiveLobby from "../components/Lobby/ActiveLobby.vue"
import MyMaps from "../components/Lobby/MyMaps.vue"
import useUser from "../services/User/UserStore"
import { useChat } from "../services/Chat/useChat"

const { playerList, fetchPlayerList } = usePlayerList()
const { userId, hostId, activeLobby, name } = useUser()
const { connectLobbyChat, disconnectLobbyChat } = useChat(name.value, activeLobby.value)

onMounted(async () => {
    await fetchPlayerList()
    disconnectLobbyChat()
    connectLobbyChat()
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

.container2 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    margin-top: 2vh;
}
.content {
    width: 35%;
    border-radius: 8px;
    background-color: var(--woe-gray-30);
}
.content2 {
    border-radius: 8px;
    padding: 20px;
    background-color: var(--woe-gray-30);
}
</style>
