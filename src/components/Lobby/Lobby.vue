<!-- Component that displays overview of existing lobbys and active players-->
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
  <!--Button to manually refresh Lobbylist-->
  <button @click="updateLobbyList()">Refresh</button>

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
  //Todo: coinnect to backend
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

button {
  background-color: rgb(255, 200, 0);
  color: rgb(63, 63, 63);
  font-family: Arial, Helvetica, sans-serif;
  padding: 15px 32px;
  font-size: 14px;
  font-weight: bold;
  margin: 4px 2px;
  margin-left: 10px;
  margin-right: 10px;
  cursor: pointer;
  border: none;

}

button:hover {
  background-color: rgb(219, 172, 0);
}
</style>
