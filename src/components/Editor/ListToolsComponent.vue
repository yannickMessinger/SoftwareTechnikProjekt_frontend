<script setup lang="ts">
/**Imports: */
import { reactive } from "vue"
import useEventBus from "../../services/eventBus"
import RandomVehicleDialog from "./RandomVehicleDialog.vue"
import { createConfirmDialog } from "vuejs-confirm-dialog"
import { IToolElement } from "../../models/Editor/IToolElement"
import ToolEnum from "../../models/Editor/ToolEnum"

/**Variables: */
const pathToPictures = "/img/streetplaner/"
var totalToolNumber = 4 /** number of toolslots shown in the toollist */
var toolList: IToolElement[] = Array(totalToolNumber).fill([]) /** List of all Tools */
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
const { reveal, onConfirm, onCancel } = createConfirmDialog(RandomVehicleDialog)

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

onConfirm((data) => {
    emit("random-asset-event", data)
})

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
    if (selectedTool.tool.tool == ToolEnum.EDIT) {
        reveal()
    }
    /** fire a tool select event to mark a tool change. Sends out the enum value of the selected tool*/
    emit("tool-select-event", selectedTool.tool.tool)
    /** fire a tool select event to mark a tool change for selectedToolComponent. Sends out the complete tool of the selected tool*/
    emit("tool-select-component-event", selectedTool.tool)
}
</script>

<template>
    <span>Werkzeuge</span>
    <div
        v-for="element in toolList"
        :key="element.id"
        id="editor-tool"
        :class="element.name === selectedTool.tool.name ? 'editor-tool-active' : 'editor-tool-not-active'"
        @click="onToolClick(element)"
    >
        <button
            v-if="element != null"
            class="editor-tool-btn"
            :style="{ backgroundImage: `url(${element.texture})` }"
        />
        <p v-if="element != null">{{ element.name }}</p>
    </div>
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
