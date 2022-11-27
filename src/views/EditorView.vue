<template>
    <h1 class="title">Editor Mode</h1>
    <PrimButton display="Zurück zur Startseite" :btn_click="() => {router.push('/')}"></PrimButton>

    <div class="flex">
        <div class="left">
            <div class="left_top1">
                <ListToolsComponent></ListToolsComponent>
            </div>
            <div class="left_top2">
                <ListBlocksComponent></ListBlocksComponent> 
            </div>
            <div class="left_bottom">
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
    import PrimButton from '../components/Buttons/PrimButton.vue'
    import router from '../router/router'
    import ListToolsComponent from '../components/streetplaner/ListToolsComponent.vue'
    import ListBlocksComponent from '../components/streetplaner/ListBlocksComponent.vue'
    import SelectedBlockComponent from '../components/streetplaner/SelectedBlockComponent.vue'
    import StreetGrid from '../components/streetplaner/StreetGrid.vue'

</script>

<style>
    .title{
        color:black;
    }
    .flex {
        display: flex;
        max-height: 75vh;
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
    .left_top1 {
        background-color:darkgrey;
    }
    .left_top2 {
        background-color:darkgrey;
        max-height: 25vh;
    }
    .right {
        flex: 1 1 80%;
        background-color: grey;
        overflow: auto;
    }
</style>