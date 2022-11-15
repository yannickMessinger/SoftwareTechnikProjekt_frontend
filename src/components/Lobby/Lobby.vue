<!-- Component that represents overview of lobbys-->
<template>
  <h3>Lobby Component</h3>

  <div v-if="lobbyList.lobbylist.length > 0">
    <div class="flex-container">
      <LobbyList :liste="lobbyList.lobbylist"></LobbyList>
      <PlayerList :liste="playerList.playerlist"></PlayerList>
    </div>
  </div>
  <div v-else>
    <p>Leider keine Lobbys vorhanden:(</p>
  </div>

  <button @click="updateLobbyList()">REFRESH</button>

  <button>Play</button>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useLobbyList, updateLobbyList } from "../../services/useLobbyList";
import { usePlayerList } from "../../services/usePlayerList";
import LobbyList from "./LobbyList.vue";
import PlayerList from "./PlayerList.vue";

onMounted(async () => {
  //await  updateLobbyList()
  console.log("hier update von backend");
});

const { lobbyList } = useLobbyList();
const { playerList } = usePlayerList();
</script>

<style scoped>
.flex-container {
  display: flex;
  align-items: flex-start;
}

h3 {
  text-align: center;
}
</style>
