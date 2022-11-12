<!-- Component that represents a single player in the player list-->
<template>
    <tr>{{props.player.name}}</tr>
</template>

<script setup lang = 'ts'>

import { IPlayerListItem } from '../../typings/IPlayerListItem';

const props = defineProps<{
    player: IPlayerListItem
}>()
</script>