<template>
    <div class="header">
        <span>AktUser: {{user.userName}}</span>
        <span>ActiveLobby: {{user.activeLobby.lobbyName}}</span>
        <span>AktMap: {{user.activeLobby.mapId}}</span>
        <span>AktLobbyM: {{user.activeLobby.lobbyModeEnum}}</span>
        <span>{{text}}</span>
        <BasicButton v-if=displayHomebutton id="home" display="" :btn_click="() => {router.push('/')}"/>
    </div>
</template>

<script setup lang="ts">
    import router from '../router/router';
    import BasicButton from './Buttons/BasicButton.vue';
    import useUser from '../services/UserStore';

    const {user} = useUser();

    const props = defineProps({
        text: {
            type: String,
            required: false,
            default: "Header Text Field"
        },
        displayHomebutton: {
            type: Boolean,
            required: false,
            default: true
        }
    })
</script>

<style>
    .header {
        display: flex;
        background-color: var(--woe-blue-80);
        justify-content: space-between;
        align-items: center;
        height: 5em;
        
    }
    span{
        color: var(--woe-white-almost);
        font-size: 1.5em;
        margin: 2em;
    }
    #home{
        margin: 2em;
        border-radius: 50%;
        width: 4em;
        height: 4em;
        background-color: var(--woe-white-almost);
        background-size: cover;
        background-position: center;
        background-image: url("../assets/Icons/Home.svg");
    }
</style>