<script setup lang="ts">
    /**Imports: */
    import { reactive, ref } from "vue"
    import type { IToolElement } from "../../services/streetplaner/IToolElement"
    import useEventBus from "../../services/eventBus"
    import ToolEnum from "../../services/streetplaner/ToolEnum"
    import Popup from "../UI/Popup.vue"
    import useUser from "../../services/UserStore"
    import { useEditor } from "../../services/Editor/useEditor"

    /**Variables: */
    const pathToPictures = "/img/streetplaner/"
    var totalToolNumber = 4 /** number of toolslots shown in the toollist */
    var toolList: IToolElement[] = Array(totalToolNumber).fill(
        []
    ) /** List of all Tools */
    /** default values for selected tool when no tool is selected */
    var defaultTool: IToolElement = {
        tool: ToolEnum.EMPTY,
        id: -1,
        name: "no Tool selected",
        texture: pathToPictures + "no-data.png",
    }
    /** currently selected tool */
    const selectedTool = reactive({ tool: defaultTool })
    const { emit } = useEventBus()
    let pedestriansAmount = ref(0)
    const popupTrigger = ref(false)

    /**entrys in toollist */
    toolList[0] = {
        tool: ToolEnum.CREATE,
        id: 0,
        name: "Erstellen",
        texture: pathToPictures + "tool-icons/create.svg",
    }
    toolList[1] = {
        tool: ToolEnum.DELETE,
        id: 1,
        name: "Löschen",
        texture: pathToPictures + "tool-icons/delete.svg",
    }
    toolList[2] = {
        tool: ToolEnum.EDIT,
        id: 2,
        name: "Bearbeiten",
        texture: pathToPictures + "tool-icons/edit.svg",
    }
    toolList[3] = {
        tool: ToolEnum.ROTATE,
        id: 3,
        name: "Drehen",
        texture: pathToPictures + "tool-icons/rotate.svg",
    }
    const pedestrianInput = {
        tool: ToolEnum.PEDESTRIAN,
        id: 4,
        name: "Fußgänger",
        texture: pathToPictures + "tool-icons/pedestrian.svg",
    }

    function onToolClick(clickedTool: any) {
        /** if the selected tool is the clicked tool, it gets deselected by restoring the default tool
         * otherwhise the clicked tool is now the selected tool.
         */

        if (selectedTool.tool.id == clickedTool.id) {
            selectedTool.tool = defaultTool
        } else {
            selectedTool.tool = clickedTool
        }

        if (selectedTool.tool.tool == ToolEnum.CREATE) {
            emit("create-toggle-view", undefined)
        }
        /** fire a tool select event to mark a tool change. Sends out the enum value of the selected tool*/
        emit("tool-select-event", selectedTool.tool.tool)
        /** fire a tool select event to mark a tool change for selectedToolComponent. Sends out the complete tool of the selected tool*/
        emit("tool-select-component-event", selectedTool.tool)
    }

    async function togglePopup() {
        popupTrigger.value = !popupTrigger.value
        const { activeLobby } = useUser()
        const { postPedestrians } = useEditor(activeLobby.value.mapId)
        await postPedestrians(activeLobby.value.mapId, pedestriansAmount.value)
    }

    function updatePedestrians(e: Event) {
        pedestriansAmount.value = Number((<HTMLInputElement>e.target).value)
        console.log(pedestriansAmount)
    }
</script>

<template>
    <div
        v-for="element in toolList"
        :key="element.id"
        id="editor-tool"
        :class="
            element.name === selectedTool.tool.name
                ? 'editor-tool-active'
                : 'editor-tool-not-active'
        "
        @click="onToolClick(element)"
    >
        <button
            v-if="element != null"
            class="editor-tool-btn"
            :style="{ backgroundImage: `url(${element.texture})` }"
        />
        <p v-if="element != null">{{ element.name }}</p>
    </div>
    <div id="editor-tool">
        <button
            class="editor-tool-btn"
            :style="{ backgroundImage: `url(${pedestrianInput.texture})` }"
            @click="togglePopup()"
        />
        <p v-if="pedestrianInput != null" :style="{ textAlign: `center` }">
            {{ pedestrianInput.name }}
        </p>
    </div>
    <Popup v-if="popupTrigger" :ClosePopup="() => togglePopup()">
        <p>
            Wie viele Fussgänger sollen zufällig in der Spielwelt positioniert
            werden?
        </p>
        <input
            type="number"
            min="0"
            :value="pedestriansAmount"
            @change="(e) => updatePedestrians(e)"
        />
    </Popup>
</template>

<style scoped>
    * {
        color: var(--woe-black);
        font-size: 1em;
    }

    span {
        margin: 0;
        font-size: 1em;
        color: var(--woe-black);
        font-weight: bold;
        margin-bottom: 8px;
    }
</style>
