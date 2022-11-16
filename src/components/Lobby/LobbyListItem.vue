<!--List Item that represents single lobby and is embedded in LobbyList-->

<template>
<div  @click="selectLobby()">
  <div class="item">
    <img
      src="https://images.unsplash.com/photo-1553481187-be93c21490a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      width="100"
      height="100"
    />

    <div class="lobby_data">
      <div>
        <b>Name: </b>{{ props.lobby.name }}   
        <b>mode:</b>{{ props.lobby.gamemode }} 
        <b>active players: </b>{{ props.lobby.player }}
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ILobbyListItem } from "../../typings/ILobbyListItem";

const props = defineProps<{
  lobby: ILobbyListItem;
}>();

function selectLobby(){
    console.log(props.lobby.name);
}




</script>

<style scoped>
.item {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  width: 600px;
  height: 100px;
  background: rgb(255,255,255);
  background: rgb(255,255,255);
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(175,175,175,1) 100%, rgba(0,0,0,0.5242471988795518) 100%);
  color: #fff;
  margin: 2px;
  padding: 10px;
  border: 2px solid;

  clip-path: polygon(
    0% 0%,
    /* top left */ 0% 0%,
    /* top left */ 100% 0%,
    /* top right */ 100% 5%,
    /* top right */ 100% 75%,
    /* bottom right */ 95% 100%,
    /* bottom right */ 0% 100%,
    /* bottom left */ 0 95% /* bottom left */
  );
}

.lobby_data {
  height: 100px;
  width: 400px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  color: black;
  
}

.item:hover {
  border-color: #1fc8f5;
}
</style>
