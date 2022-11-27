<template>
  <h1>Startseite</h1>
  <PrimButton display="Fahren" :btn_click="() => {router.push({name: 'Game', params: {gameId: gameId}})}"></PrimButton>
  <PrimButton display="Planungs-Modus" :btn_click="() => {router.push({name: 'Edit', params: {gameId: gameId}})}"></PrimButton>
  <PrimButton display="Lobby erstellen" :btn_click="() => {router.push('/create')}"></PrimButton>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import PrimButton from '../components/Buttons/PrimButton.vue';
  import router from '../router/router';

  let gameId = ref(20); //TODO: gameId must refers to the id in the backend
</script>

<style>

</style>