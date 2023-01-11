<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <div class="container">
        <div class="content">
            <!--<PlayerList :liste="playerList.playerlist"></PlayerList>-->
            <ActiveLobby></ActiveLobby>
        </div>
        <div class="content">
            <PlayerList :liste="playerList"></PlayerList>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import Header from "../components/Header.vue"
import PlayerList from "../components/Lobby/PlayerList.vue"
import { usePlayerList } from "../services/usePlayerList"

const { playerListState, playerList, fetchPlayerList } = usePlayerList()

onMounted(async () => {
    await fetchPlayerList()
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
    border-radius: 8px;
    background-color: var(--woe-gray-30);
}
</style>
