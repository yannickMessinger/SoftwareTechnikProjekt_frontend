<template>
    <h1>Editor Mode</h1>
    <PrimButton display="Back to menu" :btn_click="backToMenu"></PrimButton>

    <div class="flex">
        <div class="left">
            <div class="left_top">
                <p>Tools</p>
                <EditorItem></EditorItem>
                <EditorItem></EditorItem>
                <EditorItem></EditorItem>
                <EditorItem></EditorItem>
                <EditorItem></EditorItem> 
                <p>Elements</p> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem>
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem>
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
                <EditorItem></EditorItem> 
            </div> 
            <div class="left_bottom">
                <p>Explanation</p>
                <EditorItem></EditorItem>
            </div>          
        </div>
        <div class="right">
            <p>"GRID"</p>
            <img scr="https://picsum.photos/300" width="1200" height="1200">
        </div>
    </div>
    
</template>

<script setup lang="ts">
    import { computed,ref } from 'vue'
    import PrimButton from '../components/PrimButton.vue'
    import EditorItem from '../components/EditorItem.vue'
    import router from '../router/router'

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