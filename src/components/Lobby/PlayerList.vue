<!-- Component that represents a list of active players in a selected lobby-->
<template>
    <h3>PlayerListComponent</h3>
    <table>
        <ul>
            <PlayerListItem :player="ele" v-for="ele in liste"></PlayerListItem>
        </ul>
    </table>
</template>

<script setup lang = 'ts'>


import { usePlayerList } from '../../services/usePlayerList';
import PlayerListItem from './PlayerListItem.vue';
import { IPlayerListItem } from '../../services/interfaces/IPlayerListItem';


const props = defineProps<{
    liste: Readonly<IPlayerListItem[]>,
}>()

</script>