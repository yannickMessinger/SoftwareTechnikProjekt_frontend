<script setup lang="ts">
    /**Imports: */
    import { reactive, ref, watch } from "vue"
    import type { IBlockElement } from "../../services/streetplaner/IBlockElement"
    import useEventBus from "../../services/eventBus"
    import ToolEnum from "../../services/streetplaner/ToolEnum"

    /**Variables: */
    const pathToPictures = "/img/streetplaner/"
    var assetList: IBlockElement[] = [] /** List of all assets placable in street editor*/

    /*default asset element*/
    var defaultAsset: IBlockElement = {
        groupId: -1,
        group: "no data",
        id: -1,
        type: "no data",
        name: "no Object selected",
        rotation: 0,
        texture: pathToPictures + "no-data.png",
    }
    /**  currently selected block */
    const selectedAsset = reactive({ block: defaultAsset })
    /** bus event */
    const { emit, bus } = useEventBus()
    /** boolean value that controls weather blocks are clicable or not */
    const isCreateTool = ref(false)
    /**entrys in blocklist */
    assetList[0] = {
        groupId: 2,
        group: "Assets",
        id: 7,
        type: "ASSET",
        name: "Auto",
        rotation: 0,
        texture: pathToPictures + "object-icons/car-top-view.svg",
    }

    /**function activated by clicking on an block */
    function onAssetClick(clickedAsset: any) {
        /** if the selected block is the clicked block, it gets deselected by restoring the default block
         * otherwhise the clicked block is now the selected block.
         */
        if (selectedAsset.block.id == clickedAsset.id) {
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
        :key="element.id"
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
