<template>
  <Header text="World of eMobility" :displayHomebutton="false"></Header>
  <h1>Startseite</h1>
  <BasicButton class="prim btn green" display="Fahren" :btn_click="() => {router.push({name: 'Game', params: {gameId: gameId}})}"/>
  <BasicButton class="sec btn blue" display="Planungs-Modus" :btn_click="() => {router.push({name: 'Edit', params: {gameId: gameId}})}"/>
  <BasicButton class="sec btn blue" display="Lobby erstellen" :btn_click="() => {router.push('/create')}"/>
    <BasicButton class="sec btn blue" display="Lobbys anzeigen" :btn_click="() => {router.push('/lobby')}" />
  <BasicButton class="ter btn grey" display="Lobby verlassen"/>
  <BasicButton class="cncl btn red" display="Lobby schließen"/>
  <Chat/>


</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import BasicButton from '../components/Buttons/BasicButton.vue';
  import Header from '../components/Header.vue'
  import router from '../router/router';
  import Chat from '../components/UI/Chat.vue';

  let gameId = ref(20); //TODO: gameId must refers to the id in the backend
</script>

<style scoped>
  .container{
    height: 100vh;
  }
</style>