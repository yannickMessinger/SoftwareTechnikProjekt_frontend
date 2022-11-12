<template>
    <div>
        <h2>Lobbyliste</h2>
        <div>
            <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
        </div>
    </div>

    <div>
        <h2>PlayerListe</h2>
        <div>
            <PlayerList :liste="playerList.playerlist"></PlayerList>
        </div>
    </div>
</template>

<script setup lang="ts">
    import LobbyList from '../components/Lobby/LobbyList.vue';
    import PlayerList from '../components/Lobby/PlayerList.vue'
    import { useLobbyList } from '../services/useLobbyList';
    import { usePlayerList } from '../services/usePlayerList';

    const { lobbyList } = useLobbyList()
    const { playerList } = usePlayerList()
</script>