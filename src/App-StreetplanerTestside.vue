<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import ListToolsComponent from './components/streetplaner/ListToolsComponent.vue'
import ListBlocksComponent from './components/streetplaner/ListBlocksComponent.vue'
import SelectedBlockComponent from './components/streetplaner/SelectedBlockComponent.vue'
import SelectedToolComponent from './components/streetplaner/SelectedToolComponent.vue'
</script>

<template>
  <h1 class="title">Street List Testside</h1>
  <br/>
  <div class="streetList">
    <table class="tableTest">
        <tr>
            <td>
                <!--display tool list-->
                <ListToolsComponent></ListToolsComponent>  
            </td>
            <td>
                <!--display block list-->
                <ListBlocksComponent></ListBlocksComponent>
            </td>
            <td>
              <!--display selected tool-->
               <SelectedToolComponent></SelectedToolComponent> 
            </td>
            <td>
                <!--display selected block-->
                <SelectedBlockComponent></SelectedBlockComponent>
            </td>
        </tr>
    </table>
  </div>
</template>

<style scoped>
.title {
  color:black;
  user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.streetList{
  user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
/** style for test table*/
.tableTest{
        width: 100%;
        height: 100%;
        display: inline-table;
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none;
    }
</style>
