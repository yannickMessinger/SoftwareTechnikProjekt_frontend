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
            <button :disabled="disableResetButton" class="reset-button" @click="reveal(); disableResetButton = true;">Reset Grid</button>
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

    const { reveal, onConfirm, onCancel } = createConfirmDialog(SimpleDialog, { question: "Do you want to reset the grid? This will be irreversible."});

    const {emit} = useEventBus();
    const disableResetButton = ref(false);

    function backToMenu(){
        router.push('/');
    }
    onConfirm(() => {
        emit('grid-reset-event', true);
        disableResetButton.value = false;
    });
    onCancel(() => {
        disableResetButton.value = false;
    });
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
    .reset-button {
        cursor: pointer;
        height: 30px;
        padding: 5px 25px;
        border: 2px solid black;
        border-radius: 5px;
        background-color: white;
        font-weight: bold;
        color: black;
    }
</style>