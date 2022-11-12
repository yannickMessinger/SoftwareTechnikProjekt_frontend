<!-- Component that represents a single player in the player list-->
<template>
    <li>{{props.player.name}}</li>
</template>

<script setup lang = 'ts'>

import { IPlayerListItem } from '../../typings/IPlayerListItem';

const props = defineProps<{
    player: IPlayerListItem
}>()
</script>