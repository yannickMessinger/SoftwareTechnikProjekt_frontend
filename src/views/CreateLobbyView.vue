<template>
    <h1>Create Lobby</h1>
    <PrimButton display="Startseite" :btn_click="() => {router.push('/')}"></PrimButton>
</template>

<script setup lang="ts">
import PrimButton from '../components/Buttons/PrimButton.vue';
import router from '../router/router';

</script>

<style>

</style>