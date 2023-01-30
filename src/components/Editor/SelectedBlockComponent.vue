<script setup lang="ts">
/**Imports: */
import { reactive, ref, watch } from "vue"
import { IBlockElement } from "../../models/Editor/IBlockElement"
import useEventBus from "../../services/eventBus"
import BasicButton from "../Buttons/BasicButton.vue"

/**Variables: */
const pathToPictures = "/img/streetplaner/"
const pathRotateButton = pathToPictures + "tool-icons/rotate.png"
/**currently selected object, default value is no object selected */
var defaultBlock: IBlockElement = {
    groupId: -1,
    objectTypeId: -1,
    type: "no data",
    name: "no Block selected",
    rotation: 0,
    texture: pathToPictures + "no-data.png",
    model3d: "",
}
/** bus event */
const { emit, bus } = useEventBus()
/**  currently selected block */
const selectedBlock = reactive({ block: defaultBlock })
const isDefault = ref(true)
/** watch for selected block events to display selected block*/
watch(
    () => bus.value.get("block-select-event"),
    (val) => {
        selectedBlock.block = val[0]
        if (selectedBlock.block.objectTypeId == defaultBlock.objectTypeId) {
            isDefault.value = true
        } else {
            isDefault.value = false
        }
    }
)
/** rotate event for clicking the rotate button in the details list to rotate the selected element */
function onRotateClick() {
    if (!isDefault.value) {
        selectedBlock.block.rotation = selectedBlock.block.rotation + 1
        if (selectedBlock.block.rotation > 3) {
            selectedBlock.block.rotation = 0
        }
        /** fires a block select event to mark a selected block change. Sends out this block*/
        emit("block-select-event", selectedBlock.block)
    }
}
</script>

<template>
    <div class="background-white">
        <p>
            <span id="header">Zelle</span>
            <BasicButton display="Drehen" :btn_click="onRotateClick" />
        </p>
        <img
            v-if="selectedBlock != null"
            :src="selectedBlock.block.texture"
            class="selectedBlockImg"
            :style="{
                transform: 'rotate(' + selectedBlock.block.rotation * 90 + 'deg)',
            }"
        />
        <p>
            <span>ID</span>
            <span>{{ selectedBlock.block.objectTypeId }}</span>
        </p>
        <p>
            <span>Name</span>
            <span>{{ selectedBlock.block.name }}</span>
        </p>
        <p>
            <span>Type</span>
            <span>{{ selectedBlock.block.type }}</span>
        </p>
    </div>
</template>

<style scoped>
* {
    --margin-bottom: 12px;

    font-size: 1em;
    margin: 0;
    color: var(--woe-black);
}

.selectedBlockImg {
    max-width: 100%;
    max-width: 100%;
    height: auto;
    display: block;
    border: solid 2px var(--woe-blue-50);
    margin-bottom: var(--margin-bottom);
    background: none;
    background-size: cover;
    background-position: center;
}

p {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

#header {
    font-weight: bold;
    margin-bottom: var(--margin-bottom);
}
.selectedBlockRotateImg {
    width: 25%;
    height: 25%;
    border: solid 1px gray;
}
.rotateButtonInDetails {
    display: inline;
    border: solid 2px black;
    background-color: grey;
}
</style>
