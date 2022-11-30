<!-- Component that represents a list of active players in a selected lobby-->
<template>


<!--Display List of Active Users in selected Lobby
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

-->
        

    <div class="playerList">
        <table >
            <tr>
                <th>Player</th>
                <!--if getting the playerList failes, error Message is displayed here-->
                <th class="alignRight" v-if="playerList.errormsg">{{playerList.errormsg}}</th>
                <th class="alignRight" v-else>{{props.liste.length}}/anzMaxSpielerEinfügen</th>
            
            </tr>
        </table>
        <table>
            <tbody>
                <PlayerListItem :player="ele" v-for="ele in liste"></PlayerListItem>
            </tbody>
        </table>

    </div>


</template>


<script setup lang = 'ts'>


import PlayerListItem from './PlayerListItem.vue';
import { IPlayerListItem } from '../../typings/IPlayerListItem';
import { usePlayerList } from '../../services/usePlayerList';

//PlayerList passed from backend
const props = defineProps<{
    liste: Readonly<IPlayerListItem[]>,
}>()

const { playerList} = usePlayerList()
</script>

<style scoped>
th, td {
  padding: 1px;
  text-align: left;

}

table {
    /*border: 4px solid black;*/
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
    color:black;

    border: 1px solid #707070;
    height: 80px;
    

}

th {
    height: 20px;
    text-align: left;
    background-color: white;
    display: fixed;
}

td {
   background-color: rgb(63, 63, 63); 
   color: white;  
}

.playerList {
    height: 600px;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.alignRight {
    text-align: right;
    font-weight: normal;
}

</style>