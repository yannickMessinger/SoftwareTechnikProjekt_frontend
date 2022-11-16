<!-- Component that represents list of lobby's to choose from-->
<template>
  <div class="flex-container">
    <h3>List of available lobbys:</h3>
    <!--Renders List of Lobbylistitems-->
    <LobbyListItem :lobby="ele" v-for="ele in liste"></LobbyListItem>
  </div>
</template>

<script setup lang="ts">
import LobbyListItem from "./LobbyListItem.vue";
import { ILobbyListItem } from "../../typings/ILobbyListItem";

//Lobbylist passed from backend
const props = defineProps<{
  liste: Readonly<ILobbyListItem[]>;
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
