<script setup lang="ts">
/**Imports: */
import { onMounted, reactive, ref, watch } from "vue"
import { IBlockElement } from "../../models/Editor/IBlockElement"
import ToolEnum from "../../models/Editor/ToolEnum"
import { IBlockListState, useBlockList } from "../../services/Editor/useBlockList"
import useEventBus from "../../services/eventBus"

/**Variables: */
const pathToPictures = "/img/streetplaner/"
var assetList = reactive(Array<IBlockElement>()) /** List of all blocks placable in street editor*/
const { blockListState, updateBlockList } = useBlockList()

/*default asset element*/
var defaultAsset: IBlockElement = {
    groupId: -1,
    objectTypeId: -1,
    type: "no data",
    name: "no Object selected",
    rotation: 0,
    texture: pathToPictures + "no-data.png",
    model3d: "",
}

onMounted(() => {
    updateBlockList()
    getAssetList(blockListState)
})

function getAssetList(blockListState: IBlockListState) {
    for (let ele of blockListState.list) {
        if (ele.groupId === 2) {
            assetList.push({
                groupId: ele.groupId,
                objectTypeId: ele.objectTypeId,
                type: ele.type,
                name: ele.name,
                rotation: ele.rotation,
                texture: ele.texture,
                model3d: ele.model3d,
            })
        }
    }
}

/**  currently selected block */
const selectedAsset = reactive({ block: defaultAsset })
/** bus event */
const { emit, bus } = useEventBus()
/** boolean value that controls weather blocks are clicable or not */
const isCreateTool = ref(false)
/**entrys in blocklist */

/**function activated by clicking on an block */
function onAssetClick(clickedAsset: any) {
    /** if the selected block is the clicked block, it gets deselected by restoring the default block
     * otherwhise the clicked block is now the selected block.
     */
    if (selectedAsset.block.objectTypeId == clickedAsset.objectTypeId) {
        selectedAsset.block = defaultAsset
    } else {
        selectedAsset.block = clickedAsset
    }
    /** fires a block select event to mark a selected block change. Sends out this blocks name*/
    emit("block-select-event", selectedAsset.block)
}

/** sets buttons to clickable if create tool is selected, or not clickable if its not */
watch(
    () => bus.value.get("tool-select-event"),
    (val) => {
        if (val == ToolEnum.CREATE) {
            isCreateTool.value = true
        } else {
            isCreateTool.value = false
        }
    }
)
</script>

<template>
    <div
        v-for="element in assetList"
        :key="element.objectTypeId"
        id="editor-tool"
        :class="element.name === selectedAsset.block.name ? 'editor-tool-active' : 'editor-tool-not-active'"
        @click="onAssetClick(element)"
    >
        <button
            v-if="element != null"
            class="editor-tool-btn"
            :style="{ backgroundImage: `url(${element.texture})` }"
        />
        <p v-if="element != null">{{ element.name }}</p>
    </div>
</template>

<style>
* {
    color: var(--woe-black);
    font-size: 1em;
}
</style>
