<!-- Component that represents a list of active players in a selected lobby-->
<template>
        
    <div class="head">
        <h3>Player</h3>
        <h3 v-if="playerList.errormsg">{{playerList.errormsg}}</h3>
        <h3 v-else>{{props.liste.length}}/anzMaxSpielerEinfügen</h3>
    </div>
    <div class="playerList">      
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
    height: 300px;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.alignRight {
    text-align: right;
    font-weight: normal;
}

.head{
    display: flex;
    justify-content: space-between;
    border: 1px solid black;
}

</style>