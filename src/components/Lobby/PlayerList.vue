<!-- Component that represents a list of active players in a selected lobby-->
<template>
    
    <table cellspacing="0" cellpadding="0" width="325">
        <h3>Active Players</h3>
        <tr>
            <td>
                <table  cellspacing="0" cellpadding="1" width="325">
                    <tr style="color:white;background-color:grey">
                        <th>Player Name</th>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <div style="width:325px; height:100px; overflow:auto">
                <table cellspacing="0" cellpadding="1" width="300">
                    <tr>
                        <PlayerListItem :player="ele" v-for="ele in liste"></PlayerListItem>
                    </tr>
                </table>
                </div>
            </td>
        </tr>
       
    </table>
</template>

<script setup lang = 'ts'>


import PlayerListItem from './PlayerListItem.vue';
import { IPlayerListItem } from '../../typings/IPlayerListItem';


const props = defineProps<{
    liste: Readonly<IPlayerListItem[]>,
}>()

</script>