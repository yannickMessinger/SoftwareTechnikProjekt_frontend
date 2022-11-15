<!--List Item that represents single lobby and is embedded in LobbyList-->

<template>
    <tr>
        <td>{{props.lobby.name}}</td>
        <td>{{props.lobby.gamemode}}</td>
        <td>{{props.lobby.player}}</td>
    </tr>
</template>

<script setup lang = 'ts'>
import { ILobbyListItem } from '../../typings/ILobbyListItem';


const props = defineProps<{
    lobby: ILobbyListItem
    }>()


</script>



<style scoped>

td {
    text-align: left;
}
</style>