<!-- Component that represents a list of active players in a selected lobby-->
<template>
    <h3>PlayerListComponent</h3>
    <table>
        <tbody>
            <PlayerListItem></PlayerListItem>
        </tbody>
    </table>
</template>

<script setup lang = 'ts'>
import PlayerListItem from './PlayerListItem.vue';

</script>