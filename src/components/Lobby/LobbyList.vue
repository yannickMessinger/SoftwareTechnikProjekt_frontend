<!-- Component that represents list of lobby's to choose from-->
<template>
    <h3>LobbyListComponent</h3>

    <table>
       
    
       <div class="list">
          <ul>
           <LobbyListItem :lobby="ele" v-for="ele in liste"></LobbyListItem>
          </ul>
       </div>    
       
   
   </table>

</template>

<script setup lang = 'ts'>


import LobbyListItem from './LobbyListItem.vue';
import { ILobbyListItem } from '../../typings/ILobbyListItem'

   const props = defineProps<{
      liste: Readonly<ILobbyListItem[]>,
   }>()


   

</script>


<style scoped>

.list{
   color:blue

}



</style>


