<!-- Component that represents list of lobby's to choose from-->
<template>

  <div class="headline">
    <h2>Lobbys</h2>
    <button>Lobby erstellen</button>
  </div>

  <div class="content">
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
.content {
  height: 300px;
  /*width: 50%;*/
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  overflow: auto;
  
}

.headline{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-left: 30px;
    margin-right: 30px;
    margin-bottom: 10px;

}

button {
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
    font-size: 16px;
    font-weight: 600;
    padding:18px;
    background-color: var(--woe-blue-60);
    color: white;
}

button:hover {
    background-color: var(--woe-blue-70);
}
</style>
