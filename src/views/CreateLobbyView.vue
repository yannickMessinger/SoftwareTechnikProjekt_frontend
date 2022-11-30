<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <h1>Create Lobby</h1>
    <BasicButton class="sec btn blue" display="Lobby erstellen" :btn_click="createLobby"/>
    <BasicButton class="ter btn grey" display="Abbrechen" :btn_click="() => {router.push('/')}"/>
</template>

<script setup lang="ts">
import BasicButton from '../components/Buttons/BasicButton.vue';
import Header from '../components/Header.vue'
import router from '../router/router';

function createLobby() {
    //Lobby ertellen hier hin
    router.push('/')
}
</script>

<style>

</style>