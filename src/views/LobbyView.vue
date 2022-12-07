<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <div class="container">

            <div class="content">
                <!--<PlayerList :liste="playerList.playerlist"></PlayerList>-->
                <ActiveLobby2></ActiveLobby2>
            </div>
            <div class="content">
                <PlayerList :liste="playerList.playerlist"></PlayerList>
            </div>


    </div>

    

</template>

<script setup lang="ts">

import Header from '../components/Header.vue';
import ActiveLobby from '../components/Lobby/ActiveLobby.vue';
import LobbyOverview from '../components/Lobby/LobbyOverview.vue';
import Lobby from '../components/Lobby/LobbyOverview.vue';
import PlayerList from '../components/Lobby/PlayerList.vue';
import { usePlayerList } from "../services/usePlayerList";
import ActiveLobby2 from '../components/Lobby/ActiveLobby2.vue';
    
const { playerList } = usePlayerList();
</script>

<style scoped>

.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    margin-top: 20vh;
}

.content{
    width: 35%;
    border-radius: 8px;
    background-color: var(--woe-gray-30);

}

</style>