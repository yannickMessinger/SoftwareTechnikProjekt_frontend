<template>
    <h1 class="title">Editor Mode</h1>
    <PrimButton display="Back to menu" :btn_click="backToMenu"></PrimButton>
    <DialogsWrapper />
    <div class="flex">
        <div class="left">
            <div class="left_top1">
                <ListToolsComponent></ListToolsComponent>
            </div>
            <div class="left_top2">
                <ListBlocksComponent></ListBlocksComponent> 
            </div>
            <button class="button" @click="reveal">Reset Grid</button>
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
    import { ref } from 'vue'
    import useEventBus from '../services/eventBus'
    import PrimButton from '../components/PrimButton.vue'
    import router from '../router/router'
    import ListToolsComponent from '../components/streetplaner/ListToolsComponent.vue'
    import ListBlocksComponent from '../components/streetplaner/ListBlocksComponent.vue'
    import SelectedBlockComponent from '../components/streetplaner/SelectedBlockComponent.vue'
    import StreetGrid from '../components/streetplaner/StreetGrid.vue'
    import { createConfirmDialog } from 'vuejs-confirm-dialog'
    import SimpleDialog from '../components/SimpleDialog.vue'

    const { reveal, onConfirm } = createConfirmDialog(SimpleDialog, { question: "Do really want to reset the grid? This will be irreversible."});

    const {emit} = useEventBus();

    function backToMenu(){
        router.push('/');
    }
    onConfirm(() => {
        emit('grid-reset-event', true);
    })
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
    .button {
        background-color: #FFFFFF;
        border: 1px solid #222222;
        border-radius: 8px;
        box-sizing: border-box;
        color: #222222;
        cursor: pointer;
        display: inline-block;
        font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        margin: 0;
        outline: none;
        padding: 13px 23px;
        position: relative;
        text-align: center;
        text-decoration: none;
        touch-action: manipulation;
        transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
        user-select: none;
        -webkit-user-select: none;
        width: auto;
    }

    .button:focus-visible {
        box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
        transition: box-shadow .2s;
    }

    .button:active {
        background: #F6F9FE;
        border-color: #000000;
        transform: scale(.96);
    }

    .button:disabled {
        border-color: #DDDDDD;
        color: #DDDDDD;
        cursor: not-allowed;
        opacity: 1;
    }
    .button:hover {
        background: #F6F9FE;
    }
</style>