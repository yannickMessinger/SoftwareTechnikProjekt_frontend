<!--
    author: Sean Dittmann
    date: 11.11.2022 
-->
<script setup lang="ts">
    /**Imports: */
    import { reactive, ref, watch } from "vue"
    import type { IBlockElement } from "../../services/streetplaner/IBlockElement"
    import useEventBus from "../../services/eventBus"
    import ToolEnum from "../../services/streetplaner/ToolEnum"

    /**Variables: */
    const pathToPictures = "/img/streetplaner/"
    var totalBlockNumber = 3 /** number of blocks in blocklist*/
    var blockList: IBlockElement[] = Array(totalBlockNumber).fill(
        []
    ) /** List of all blocks placable in street editor*/

    /*default block element*/
    var defaultBlock: IBlockElement = {
        groupId: -1,
        group: "no data",
        id: -1,
        type: "no data",
        name: "no Object selected",
        rotation: 0,
        texture: pathToPictures + "no-data.png",
    }
    /**  currently selected block */
    const selectedBlock = reactive({ block: defaultBlock })
    /** bus event */
    const { emit, bus } = useEventBus()
    /** boolean value that controls weather blocks are clicable or not */
    const isCreateTool = ref(false)
    /**entrys in blocklist */
    blockList[0] = {
        groupId: 0,
        group: "Testobject1",
        id: 0,
        type: "???",
        name: "Gerade",
        rotation: 0,
        texture: pathToPictures + "object-icons/Road_straight.svg",
    }
    blockList[1] = {
        groupId: 0,
        group: "Testobject1",
        id: 1,
        type: "???",
        name: "Kurve",
        rotation: 0,
        texture: pathToPictures + "object-icons/Road_curve.svg",
    }
    blockList[2] = {
        groupId: 1,
        group: "Testobject2",
        id: 2,
        type: "???",
        name: "Kreuzung",
        rotation: 0,
        texture: pathToPictures + "object-icons/Road_cross.svg",
    }

    /**function activated by clicking on an block */
    function onBlockClicked(clickedBlock: any) {
        /** if the selected block is the clicked block, it gets deselected by restoring the default block
         * otherwhise the clicked block is now the selected block.
         */
        if (selectedBlock.block.id == clickedBlock.id) {
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
        :key="element.id"
        id="editor-tool"
        :class="
            element.name === selectedBlock.block.name
                ? 'editor-tool-active'
                : 'editor-tool-not-active'
        "
        @click="onBlockClicked(element)"
    >
        <button
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
</style>
