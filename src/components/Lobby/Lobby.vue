<!-- Component that represents overview of lobbys-->
<template>
    <h3>LobbyComponent</h3>
    <div class="lobbyList">
        <LobbyList></LobbyList>
    </div>

    <div class="playerList">
        <PlayerList></PlayerList>
    </div>

    <button>Play</button>

    
</template>

<script setup lang = 'ts'>
import LobbyList from './LobbyList.vue';
import PlayerList from './PlayerList.vue';


</script>

