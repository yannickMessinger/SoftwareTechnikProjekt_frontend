<template>
    <h1>Editor Mode</h1>
    <PrimButton display="Back to menu" :btn_click="backToMenu"></PrimButton>

    <div class="flex">
        <div class="left">
            <div class="left_top">
                <p>Tools</p>
                <ListToolsComponent></ListToolsComponent>
                <p>Elements</p> 
                <ListBlocksComponent></ListBlocksComponent>
            </div> 
            <div class="left_bottom">
                <p>Explanation</p>
                <SelectedBlockComponent></SelectedBlockComponent>
            </div>          
        </div>
        <div class="right">
            <StreetGrid></StreetGrid>
        </div>
    </div>
    
</template>

<script setup lang="ts">
    import { computed,ref } from 'vue'
    import PrimButton from '../components/PrimButton.vue'
    import router from '../router/router'
    import ListToolsComponent from '../components/streetplaner/ListToolsComponent.vue'
    import ListBlocksComponent from '../components/streetplaner/ListBlocksComponent.vue'
    import SelectedBlockComponent from '../components/streetplaner/SelectedBlockComponent.vue'
    import StreetGrid from '../components/streetplaner/StreetGrid.vue'

    function backToMenu(){
        router.push('/')
    }
</script>

<style>
    .flex {
        display: flex;
        max-height: 70vh;
    }
    .left {
        flex: 1 1 20%;
        display: flex;
        flex-direction: column;
        background-color:bisque;
        
    }
    .left_bottom {
        margin-top: auto;
        background-color:darkkhaki;
        
    }
    .left_top {
        background-color:darkgrey;
        overflow: auto;
    }
    .right {
        flex: 1 1 80%;
        background-color: grey;
        overflow: auto;
    }
</style>