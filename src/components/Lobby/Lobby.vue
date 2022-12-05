<!--List Item that represents single lobby and is embedded in LobbyList, displays Lobby Data Name, the current gaming mode the lobby is set to and the number of active players-->

<template>
<RouterLink to="/lobbyview">
  <div  @click="selectLobby()">
  <div class="item">
    <img
      src="https://images.unsplash.com/photo-1628947733273-cdae71c9bfd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
      width="100"
      height="100"
    />

    <div class="lobby_data">
      <div>
        <b>Name: </b>{{ props.lobby.lobbyName }}<br/>   
        <b>mode: </b>{{ props.lobby.lobbyModeEnum }} <br/>
        <b>active players: </b>{{ props.lobby.numOfPlayers }}
      </div>
      </div>
    </div>
  </div>
</RouterLink>
</template>

<script setup lang="ts">

import { ILobby } from "../../typings/ILobby";
import BasicButton from "../Buttons/BasicButton.vue";
import useUser from "../../services/UserStore";

const props = defineProps<{
  lobby: ILobby;
}>();

const {setActiveLobby} = useUser();

//for later purposes to link to selected lobby via Vue Router
function selectLobby(){
    console.log(props.lobby.lobbyId, props.lobby.lobbyName);
    setActiveLobby(props.lobby);
    console.log("user has active lobby");
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
  background: rgb(63, 63, 63); 
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
  color: lightgray;
  
}

.item:hover {
  border-color:  rgb(255, 200, 0);;
}
</style>
