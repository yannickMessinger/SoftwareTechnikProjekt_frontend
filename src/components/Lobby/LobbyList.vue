<!-- Component that represents list of lobby's to choose from-->
<template>
    <div class="headline">
        <h2>Lobbys</h2>
    </div>

    <div class="content">
        <!--Renders List of Lobbylistitems-->
        <Lobby :lobby="ele" v-for="ele in props.liste"></Lobby>
    </div>
</template>

<script setup lang="ts">
import { ILobby } from "../../models/Lobby/ILobby"
import Lobby from "./Lobby.vue"

//Lobbylist passed from backend
const props = defineProps<{
    liste: Readonly<ILobby[]>
}>()
</script>

<style scoped>
table {
    /*border: 4px solid black;*/
    width: 100%;
    color: black;
}

th {
    height: 20px;
    text-align: left;
    background-color: white;
}

.headline {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 10px;
}

button {
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    padding: 10px 20px;
    margin-right: 34px;
    background-color: var(--woe-blue-60);
    color: white;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
