<!--List Item that represents single lobby and is embedded in LobbyList-->

<template>
    
    <li>{{props.lobby.name}}</li>
    
</template>

<script setup lang = 'ts'>
import { ILobbyListItem } from '../../services/interfaces/ILobbyListItem';


const props = defineProps<{
    lobby: ILobbyListItem
    }>()


</script>