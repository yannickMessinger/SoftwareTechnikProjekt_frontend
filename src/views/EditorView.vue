<template>
    <Header :displayHomebutton="true"></Header>
    <DialogsWrapper />
    <div class="selected-block">
        <SelectedBlockComponent />
    </div>
    <div class="container">
        <BasicButton
            class="reset-btn"
            display="Grid zurücksetzen"
            :btn_click="
                () => {
                    reveal()
                    disableResetButton = true
                }
            "
        ></BasicButton>
        <BasicButton
            class="valid-btn"
            display="Ist Straßenplaner valide?"
            :btn_click="
                () => {
                    validGrid()
                    disableResetButtonForValidation = true
                }
            "
        ></BasicButton>
        <div class="tools">
            <p id="header">
                <BasicButton v-if="elementBarVisible" class="tools-back-btn" display=" " :btn_click="switchMode" />
            </p>
            <ListToolsComponent v-if="!elementBarVisible" />
            <ListBlocksComponent v-if="elementBarVisible" />
        </div>
    </div>

    <div class="grid">
        <StreetGrid />
    </div>
    <Chat />
    <div class="container-slider">
        <div class="border-slider">
            <Slider class="slider" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import useEventBus from "../services/eventBus"
import ListToolsComponent from "../components/Editor/ListToolsComponent.vue"
import ListBlocksComponent from "../components/Editor/ListBlocksComponent.vue"
import SelectedBlockComponent from "../components/Editor/SelectedBlockComponent.vue"
import StreetGrid from "../components/Editor/StreetGrid.vue"
import { createConfirmDialog } from "vuejs-confirm-dialog"
import SimpleDialog from "../components/UI/SimpleDialog.vue"
import Header from "../components/UI/Header.vue"
import Chat from "../components/UI/Chat.vue"
import BasicButton from "../components/Buttons/BasicButton.vue"
import { useGridSize } from "../services/Editor/useGridSize"
import Slider from "../components/Editor/Slider.vue"
import { useValidConfirmBeforeAction } from "../services/Editor/ValidConfirmDialog"

const { reveal, onConfirm, onCancel } = createConfirmDialog(SimpleDialog, {
    question: "Möchtest du die gesamte Karte zurücksetzen? Die Aktion ist unwiderruflich.",
})
const { emit, bus } = useEventBus()
const disableResetButton = ref(false)
const disableStreetGrid = ref(false)
const disableResetButtonForValidation = ref(false)
const { gridSize } = useGridSize()
const headerText_tool = "Werkzeuge"
const headerText_elements = "Elemente"
const elementBarVisible = ref(false)
const header = ref(headerText_tool)

onConfirm(() => {
    emit("grid-reset-event", true)
    disableResetButton.value = false
})
onCancel(() => {
    disableResetButton.value = false
})
const validGrid = () => {
    useValidConfirmBeforeAction(
        () => {
            emit("grid-is-valid-event", true)
            disableResetButtonForValidation.value = false
        },
        { question: "Wollen Sie die Karte prüfen?" }
    )
}

function switchMode() {
    elementBarVisible.value = !elementBarVisible.value
    header.value === headerText_elements ? (header.value = headerText_tool) : undefined
}

watch(
    () => bus.value.get("create-toggle-view"),
    (val) => {
        elementBarVisible.value = !elementBarVisible.value
        header.value == headerText_tool ? (header.value = headerText_elements) : undefined
    }
)
</script>

<style scoped>
* {
    --border-radius: 10px;
    --padding: 1em;
}

span {
    margin: 0;
    font-size: 1em;
    color: var(--woe-black);
    font-weight: bold;
    margin-bottom: 8px;
}

#header {
    font-weight: bold;
    align-self: flex-start;
}

.grid {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: scroll;
}
.selected-block {
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
    background-color: var(--woe-white);
    z-index: 2;
}

.reset-btn {
    position: fixed;
}
.valid-btn {
    position: fixed;
    top: 150px;
    position: fixed;
}

.container {
    display: flex;
    flex-flow: row-reverse;
}

.tools {
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
    max-height: 50vh;
    margin-top: 10%;
    overflow-y: scroll;
    background-color: var(--woe-white);
    position: fixed;
    z-index: 2;
}

.tools-back-btn {
    padding: 5px;
    width: 1em;
    height: 1em;
    background: none;
    background-size: cover;
    background-position: center;
    background-image: url(../assets/Icons/back.svg);
}

.container-slider {
    display: flex;
    flex-flow: row-reverse;
    bottom: 0;
    position: fixed;
    width: 100%;
}

.border-slider {
    display: flex;
    justify-content: center;
    padding: 2em 1em 2em 1em;
    border-top: 1px solid var(--woe-black);
    border-left: 1px solid var(--woe-black);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-top-left-radius: var(--border-radius);
    background-color: var(--woe-white);
    width: 25%;
}
.slider {
    width: 75%;
    outline: none;
    transition: opacity 0.2s;
}

.slider:hover {
    opacity: 1;
}
</style>
