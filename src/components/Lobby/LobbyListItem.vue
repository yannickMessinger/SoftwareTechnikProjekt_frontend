<!--List Item that represents single lobby and is embedded in LobbyList-->

<template>

        
            
                
            

            <div class="item">
                <img src="https://images.unsplash.com/photo-1526920929362-5b26677c148c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80" width="100" height="100"/>
                
                <div class="lobby_data">
                   <b>Name</b>: {{props.lobby.name}}
                    <b>mode</b>: {{props.lobby.gamemode}}
                    <b>active players: </b>{{props.lobby.player}}  
                </div>
                
                
            </div>
            

            

        

</template>

<script setup lang = 'ts'>
import { ILobbyListItem } from '../../typings/ILobbyListItem';


const props = defineProps<{
    lobby: ILobbyListItem
    }>()


</script>



<style scoped>



.item{
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    

    width: 600px;
    height: 100px;
    background: #F6F6F6;
    color: #fff;
    margin: 2px;
    padding: 10px;
    border: 1px solid white;

    
    clip-path: 
    polygon(
      0% 0%,     /* top left */
      0% 0%,     /* top left */
      100% 0%,    /* top right */
      100% 5%,   /* top right */
      100% 75%,  /* bottom right */
      95% 100%,  /* bottom right */
      0% 100%,   /* bottom left */
      0 95%      /* bottom left */
    );
    

    
    
}

.lobby_data{
    
    height:100px;
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    color:black;
    
}

.item:hover{
    background-color: #c6c6c6;
}




</style>