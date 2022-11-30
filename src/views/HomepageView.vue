<template>
  <Header text="World of eMobility" :displayHomebutton="false"></Header>
  <h1>Startseite</h1>
  <BasicButton class="prim btn green" display="Fahren" :btn_click="() => {router.push({name: 'Game', params: {gameId: gameId}})}"/>
  <BasicButton class="sec btn blue" display="Planungs-Modus" :btn_click="() => {router.push({name: 'Edit', params: {gameId: gameId}})}"/>
  <BasicButton class="sec btn blue" display="Lobby erstellen" :btn_click="() => {router.push('/create')}"/>
  <BasicButton class="ter btn grey" display="Lobby verlassen"/>
  <BasicButton class="cncl btn red" display="Lobby schließen"/>
 


</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import BasicButton from '../components/Buttons/BasicButton.vue';
  import Header from '../components/Header.vue'
  import router from '../router/router';

  let gameId = ref(20); //TODO: gameId must refers to the id in the backend
</script>

<style>

</style>