<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <button class="reset-button" @click="emit('grid-save-event', true)">Save</button> <!-- Remove before merge with dev -->
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
    import ListToolsComponent from '../components/streetplaner/ListToolsComponent.vue'
    import ListBlocksComponent from '../components/streetplaner/ListBlocksComponent.vue'
    import SelectedBlockComponent from '../components/streetplaner/SelectedBlockComponent.vue'
    import StreetGrid from '../components/streetplaner/StreetGrid.vue'
    import { createConfirmDialog } from 'vuejs-confirm-dialog'
    import SimpleDialog from '../components/SimpleDialog.vue'
    import Header from '../components/Header.vue'

    const { reveal, onConfirm, onCancel } = createConfirmDialog(SimpleDialog, { question: "Do you want to reset the grid? This will be irreversible."});

    const {emit} = useEventBus();
    const disableResetButton = ref(false);
    

    onConfirm(() => {
        emit('grid-reset-event', true);
        disableResetButton.value = false;
    });
    onCancel(() => {
        disableResetButton.value = false;
    });
</script>

<style>
    .flex {
        display: flex;
        max-height: 75vh;
	    font-family: Circular,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",sans-serif;
	    font-size: 16px;
	    font-weight: 600;

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