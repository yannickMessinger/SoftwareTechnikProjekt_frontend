<template>
  <Header text="World of eMobility" :displayHomebutton="true"></Header>
  <h1>Create Lobby</h1>

  <div class="container">
    <div class="content">
      <div class="head">
        <p><b>Lobby erstellen</b></p>
      </div>

      <div class="formWrapper">
      <div class="lobbyInput">
        <div class="field-wrap">
        <label for="lobby_name"> <b>Lobby-Name</b></label>
          <input type="text" name="lobby_name" v-model="lobbyNameInput" placeholder="enter lobbyname"/>
        </div>

        <div class = "field-wrap">
          <label for="lobby_mode"> <b>Lobby-Mode</b></label>
        <select v-model="selected" @change="switchSelect($event)">
      <option disabled value="">Please select LobbyMode</option>
      <option value="build">BuildMode</option>
      <option value="play">PlayMode</option>
    </select>
    </div>

        <div class="field-wrap">
          <label for="map"><b>Karte</b></label>
      <select>
      <option disabled value="Please select Map">Please select Map</option>
      <option value="testmap1">testmap1</option>
      <option value="testmap2">testmap2</option>
    </select>
        </div>

        <div class="field-wrap">
          <label for="last_name"><b>Passwort</b></label>
          <input type="password" name="password"  v-model="passwordInput" placeholder="enter password"/>
        </div>


        <div class="buttonBox">

        <div class="button1">
        <BasicButton
          class="sec btn blue"
          display="erstellen"
          :btn_click="
          () => {
            createNewLobby(lobbyNameInput, 0, lobbyModeInput);
            router.push('/')
          }
          "
        />
      </div>

        <div class="button2">
        <BasicButton
          class="ter btn grey"
          display="Abbrechen"
          :btn_click="
            () => {
              router.push('/');
            }
          "
        />
      </div>
      </div>
       
    </div>

    </div>

      
    
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicButton from "../components/Buttons/BasicButton.vue";
import Header from "../components/Header.vue";
import router from "../router/router";
import { E_LobbyMode } from "../typings/E_LobbyMode";
import {createNewLobby} from "../services/useLobbyList";

const lobbyNameInput = ref("");
const passwordInput = ref("");
const lobbyModeInput = ref(E_LobbyMode.BUILD_MODE);
const selected = ref("");

function setPlayMode() {
  lobbyModeInput.value = E_LobbyMode.PLAY_MODE;
}

function setBuildMode() {
  lobbyModeInput.value = E_LobbyMode.BUILD_MODE;
}

function switchSelect(event: any) {
  selected.value = event.target.value;
  if (selected.value === "play") {
    setPlayMode();
  } else if (selected.value === "build") {
    setBuildMode();
  }
}

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-top: 20vh;
  height: 25em;
  
   
}

.content {
  border-radius: 15px;
  border: 1px solid black;
  display: grid; 
  grid-template-columns: 1fr 2fr; 
  grid-template-rows: 0.5fr 2fr 1fr; 
  gap: 0px 0px; 
  grid-template-areas: 
    "Header Header"
    "Form Form"
    ". Button";
  height: 80%;
  width:29em;
}

.head {
  border-top-left-radius:15px; 
  border-top-right-radius:15px;
  font-style: italic;
  justify-content: space-between;
  border-bottom: 1px solid black;
 
  grid-area: Header;
  padding-left: 1em;
  height: 3em;
}

.lobbyInput{
 
  width: 100%;
  padding-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 50%;
}


select{
color: white;
width:70%;
border-color: white;
}

.field-wrap {
  width: 100%;
  margin-bottom: 15px;
  display: flex;
}

.field-wrap label {
  
  width:30%;
}

.field-wrap input {
  width: 70%;
  flex-grow: 1;
  
}
label {
  margin-right: 20px;
  width: 40%;
}
.buttonBox {
  display: grid; 
  grid-template-columns: 1fr 0.5fr 0.5fr; 
  grid-template-rows: 25%; 
  gap: 10px 10px; 
  grid-template-areas: 
    ". button1 button2";

  width: 100%;
  height:3em;
  padding-top: 20px;
 
  grid-area:Button;
}

.button1 { 
  grid-area: button1; 
}
.button2 { 
  grid-area: button2; 
}

.formWrapper{
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  width: 400px;
 
  grid-area: Form;
}

</style>
