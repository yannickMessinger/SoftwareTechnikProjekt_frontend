<!-- Component that represents a single player in the player list-->
<template>
    <tr>
        <td>{{props.player.name}}</td>
    </tr>

</template>

<script setup lang = 'ts'>

import { IPlayerListItem } from '../../typings/IPlayerListItem';

const props = defineProps<{
    player: IPlayerListItem
}>()
</script>