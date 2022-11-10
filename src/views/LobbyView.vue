<template>
    <div>
        <h2>Lobbyliste</h2>
        <div>
            <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
        </div>
    </div>
</template>

<script setup lang="ts">
    import LobbyList from '../components/Lobby/LobbyList.vue';
    import { useLobbyList } from '../services/useLobbyList';

    const { lobbyList } = useLobbyList()
</script>