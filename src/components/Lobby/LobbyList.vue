<!-- Component that represents list of lobby's to choose from-->
<template>
    

    <table cellspacing="0" cellpadding="0" width="325">
      <h3>LobbyListComponent</h3>
      <tr>
         <td>
            <table  cellspacing="0" cellpadding="1" width="325">
               <tr style="color:white;background-color:grey">
                  <th>Lobby Name</th>
                  <th>Gamemode</th>
                  <th>Active Players</th>
               </tr>
            </table>
         </td>
      </tr>
      <tr>
         <td>
            <div style="width:325px; height:100px; overflow:auto">
               <table cellspacing="0" cellpadding="1" width="300">
                  <LobbyListItem :lobby="ele" v-for="ele in liste"></LobbyListItem>
               </table>
            </div>
         </td>
      </tr>
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


