<!-- Component that represents list of lobby's to choose from-->
<template>
  <div class="flex-container">
    <h3>List of available lobbys:</h3>
    <!--Renders List of Lobbylistitems-->
    <Lobby :lobby="ele" v-for="ele in props.liste"></Lobby>
  </div>
</template>

<script setup lang="ts">
import Lobby from "./Lobby.vue";
import { ILobby } from "../../typings/ILobby";

//Lobbylist passed from backend
const props = defineProps<{
  liste: Readonly<ILobby[]>;
}>();
</script>

<style scoped>
.flex-container {
  height: 800px;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  overflow: auto;
  
}
</style>
