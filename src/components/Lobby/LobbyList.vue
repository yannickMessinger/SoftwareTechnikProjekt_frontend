<!-- Component that represents list of lobby's to choose from-->
<template>
    <h3>LobbyListComponent</h3>

    <table>
       
    
       
          <ul>
           <LobbyListItem :lobby="ele" v-for="ele in liste"></LobbyListItem>
          </ul>
           
       
   
   </table>

</template>

<script setup lang = 'ts'>

import { useLobbyList } from '../../services/useLobbyList';
import LobbyListItem from './LobbyListItem.vue';
import { ILobbyListItem } from '../../services/interfaces/ILobbyListItem'

   const props = defineProps<{
      liste: Readonly<ILobbyListItem[]>,
   }>()


   

</script>


