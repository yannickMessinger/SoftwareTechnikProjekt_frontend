<!-- Component that represents overview of lobbys-->
<template>
    <h3>LobbyComponent</h3>
    <div class="lobbyList">
        <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
    </div>

    <div class="playerList">
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

