<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { onMounted, reactive, ref, watch } from "vue"
    import type { IBlockElement } from "../../services/streetplaner/IBlockElement"
    import useEventBus from "../../services/eventBus"
    import ToolEnum from "../../services/streetplaner/ToolEnum"
    import { useBlockList, IBlockListState } from "../../services/streetplaner/useBlockList"

    /**Variables: */
    const pathToPictures = "/img/streetplaner/"
    const { blockListState, updateBlockList } = useBlockList()
    var blockList = reactive(Array<IBlockElement>()) /** List of all blocks placable in street editor*/

    /*default block element*/
    var defaultBlock: IBlockElement = {
        groupId: -1,
        objectTypeId: -1,
        type: "no data",
        name: "no Object selected",
        rotation: 0,
        texture: pathToPictures + "no-data.png",
        model3d: "",
    }
    /**  currently selected block */
    const selectedBlock = reactive({ block: defaultBlock })
    /** bus event */
    const { emit, bus } = useEventBus()
    /** boolean value that controls weather blocks are clicable or not */
    const isCreateTool = ref(false)

    onMounted(() => {
        updateBlockList()
        getBlockList(blockListState)
    })

    function getBlockList(blockListState: IBlockListState) {
        for (let ele of blockListState.list) {
            if (ele.groupId === 0) {
                blockList.push({
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

    /**function activated by clicking on an block */
    function onBlockClicked(clickedBlock: any) {
        /** if the selected block is the clicked block, it gets deselected by restoring the default block
         * otherwhise the clicked block is now the selected block.
         */
        if (selectedBlock.block.objectTypeId == clickedBlock.objectTypeId) {
            selectedBlock.block = defaultBlock
        } else {
            selectedBlock.block = clickedBlock
        }
        /** fires a block select event to mark a selected block change. Sends out this blocks name*/
        emit("block-select-event", selectedBlock.block)
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
        v-for="element in blockList"
        :key="element.objectTypeId"
        id="editor-tool"
        :class="element.name === selectedBlock.block.name ? 'editor-tool-active' : 'editor-tool-not-active'"
        @click="onBlockClicked(element)"
    >
        <button class="editor-tool-btn" :style="{ backgroundImage: `url(${element.texture})` }" />
        <p v-if="element != null">{{ element.name }}</p>
    </div>
</template>

<style scoped>
    * {
        color: var(--woe-black);
        font-size: 1em;
    }
</style>
