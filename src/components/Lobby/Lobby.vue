<!-- Component that represents overview of lobbys-->
<template>
    <h3>LobbyComponent</h3>

    
        
        <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
    

    
     <!--<PlayerList :liste="playerList.playerlist"></PlayerList>-->
        
   

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





</style>

