<!-- Component that represents overview of lobbys-->
<template>
    <h3>Lobby Component</h3>

    
        <div class="flex-container">
            <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
            <PlayerList :liste="playerList.playerlist"></PlayerList>
        </div>
   

    <button>Play</button>

    
</template>

<script setup lang = 'ts'>
import { useLobbyList } from '../../services/useLobbyList';
import { usePlayerList } from '../../services/usePlayerList';
import LobbyList from './LobbyList.vue';
import PlayerList from './PlayerList.vue';

const { lobbyList } = useLobbyList();
const { playerList } = usePlayerList();

</script>


<style scoped>

.flex-container{
    display: flex;
    align-items:flex-start;
}

h3{
    text-align: center;
}



</style>

