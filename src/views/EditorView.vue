<template>
    <Header text="World of eMobility" :displayHomebutton="true"></Header>
    <!--
    <ListToolsComponent></ListToolsComponent>
    <ListBlocksComponent></ListBlocksComponent> 
    <button :disabled="disableResetButton" class="reset-button" @click="reveal(); disableResetButton = true;">Reset Grid</button>
     <StreetGrid></StreetGrid>
    -->
    <DialogsWrapper />
    <div class="selected-block">
        <SelectedBlockComponent/>
    </div>
    <div class="container">
        <div class="tools">
            <p id="header">
                <BasicButton v-if="elementBarVisible" class="tools-back-btn" display=" " :btn_click="switchMode"/>
            </p>
            <span>{{header}}</span>
            <ListToolsComponent v-if="!elementBarVisible" />
            <ListBlocksComponent v-if="elementBarVisible"/>
        </div>
    </div>
    <div class="grid">
        <StreetGrid/>
    </div>

    <Chat/>
</template>

<script setup lang="ts">
    import { ref, watch} from 'vue'
    import useEventBus from '../services/eventBus'
    import router from '../router/router'
    import ListToolsComponent from '../components/streetplaner/ListToolsComponent.vue'
    import ListBlocksComponent from '../components/streetplaner/ListBlocksComponent.vue'
    import SelectedBlockComponent from '../components/streetplaner/SelectedBlockComponent.vue'
    import StreetGrid from '../components/streetplaner/StreetGrid.vue'
    import { createConfirmDialog } from 'vuejs-confirm-dialog'
    import SimpleDialog from '../components/SimpleDialog.vue'
    import Header from '../components/Header.vue'
    import Chat from '../components/UI/Chat.vue'
    import BasicButton from '../components/Buttons/BasicButton.vue'

    const { reveal, onConfirm, onCancel } = createConfirmDialog(SimpleDialog, { question: "Möchtest du die gesamte Karte zurücksetzen? Die Aktion ist unwiderruflich."});
    const {emit, bus} = useEventBus();
    const disableResetButton = ref(false);
   
    const headerText_tool = "Werkzeuge"
    const headerText_elements = "Elemente"
    const elementBarVisible = ref(false);
    const header = ref(headerText_tool)

    onConfirm(() => {
        emit('grid-reset-event', true);
        disableResetButton.value = false;
    });
    onCancel(() => {
        disableResetButton.value = false;
    });

    function switchMode(){
        elementBarVisible.value = !elementBarVisible.value
        header.value === headerText_elements ? header.value = headerText_tool : undefined
    }

    watch(() => bus.value.get('create-toggle-view'), (val) => {
        elementBarVisible.value = !elementBarVisible.value
        header.value == headerText_tool ? header.value = headerText_elements : undefined
        console.log(elementBarVisible.value)
        console.log(val);
    });
</script>

<style scoped>
    *{
        --border-radius: 10px;
        --padding: 1em;

    }
    span{
        margin: 0;
        font-size: 1em;
        color: var(--woe-black);
        font-weight: bold;
        margin-bottom: 8px;
        
    }

    #header{
        font-weight: bold;
        align-self: flex-start;
    }


    .grid{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        overflow: scroll;
    }
    .selected-block{
        display: flex;
        flex-direction: column;
        padding: var(--padding);
        width: 12%;
        height: auto;
        box-sizing: border-box;
        border: 1px solid var(--woe-black);
        border-bottom-right-radius: var(--border-radius);
        border-left: none;
        border-top: none;
        overflow: hidden;
        position: fixed;
        z-index: 2;
        background-color: var(--woe-white);
    }


    .container{
        display: flex;
        align-items: flex-end;
        justify-content: center;
        flex-direction: column;
        min-height: 75vh;
        z-index: 2;
        position: fixed;
    }

    .tools{
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        padding: var(--padding);
        box-sizing: border-box;
        border: 1px solid var(--woe-black);
        border-right: none;
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        overflow: hidden;
        width: 8%;
        max-height: 75vh;
        overflow-y: scroll;
        background-color: var(--woe-white);
    }

    .tools-back-btn{
        padding: 5px;
        width: 1em;
        height: 1em;
        background: none;
        background-size: cover;
        background-position: center;
        background-image: url(../assets/Icons/back.svg);
    }
</style>