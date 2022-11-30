<template>

    <div class="head">
        <h3>Meine Karten</h3>
    </div>
    <div class="playerList">
        <table>
            <tbody>
                <MyMapsListItem :map="ele" v-for="ele in liste"></MyMapsListItem>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">


import MyMapsListItem from './MyMapsListItem.vue';
import { IMyMapsListItem } from '../../typings/IMyMapsListitem';



const props = defineProps<{
    liste: Readonly<IMyMapsListItem[]>,
}>()

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

.head{
    display: flex;
    justify-content: space-between;
    border: 1px solid black;
}
</style>