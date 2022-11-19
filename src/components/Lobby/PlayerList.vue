<!-- Component that represents a list of active players in a selected lobby-->
<template>
<!--    
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
-->

<!--Display List of Active Users in selected Lobby-->
        <table>
            <thead>
                <tr>
                    <th>Active Players</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="player in liste">
                    <tr>
                        <td>{{player.name}}</td>
                    </tr>
                </template>
            </tbody>
        </table>


        

<!--
    <table>
        <tr>
            <th>Player Name</th>
        </tr>
        <tbody>
            <PlayerListItem :player="ele" v-for="ele in liste"></PlayerListItem>
        </tbody>


    </table>
-->


</template>


<script setup lang = 'ts'>


import PlayerListItem from './PlayerListItem.vue';
import { IPlayerListItem } from '../../typings/IPlayerListItem';

//PlayerList passed from backend
const props = defineProps<{
    liste: Readonly<IPlayerListItem[]>,
}>()

</script>

<style scoped>
th, td {
  padding: 10px;
  text-align: left;

}

table {
    /*border: 4px solid black;*/
    width: 20%;
    font-family: Arial, Helvetica, sans-serif;
    color:rgb(63, 63, 63);
    background-color: rgb(63, 63, 63);
    border: none;

    height: 100px;



}

th {
    height: 20px;
    text-align: center;
    background-color: rgb(255, 200, 0);
   
    
}

td {
   background-color: rgb(63, 63, 63); 
   color: white;  
}
</style>