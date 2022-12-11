<script setup lang="ts">
/**Imports: */
import { reactive, ref, watch } from "vue";
import type { IBlockElement } from "../../services/streetplaner/IBlockElement";
import useEventBus from "../../services/eventBus";
import ToolEnum from "../../services/streetplaner/ToolEnum";
import BigBuilding from "../../assets/2D_Models/Buildings/BigBuilding.png";
import Building from "../../assets/2D_Models/Buildings/Building.png";
import Supermarkt from "../../assets/2D_Models/Buildings/Supermarkt.png";
import Stadium from "../../assets/2D_Models/Buildings/Stadium.png";
/**Variables: */
const pathToPictures = "/img/streetplaner/";
var totalBlockNumber = 4; /** number of blocks in blocklist*/
var blockList: IBlockElement[] = Array(totalBlockNumber).fill(
  []
); /** List of all blocks placable in street editor*/

/*default block element*/
var defaultBlock: IBlockElement = {
  groupId: -1,
  group: "no data",
  id: -1,
  type: "no data",
  name: "no Object selected",
  rotation: 0,
  texture: pathToPictures + "no-data.png",
};
/**  currently selected block */
const selectedBlock = reactive({ block: defaultBlock });
/** bus event */
const { emit, bus } = useEventBus();
/** boolean value that controls weather blocks are clicable or not */
const isCreateTool = ref(false);
/**entrys in blocklist */
blockList[0] = {
  groupId: 1,
  group: "Testobject1",
  id: 3,
  type: "Building",
  name: "Big Building",
  rotation: 0,
  texture: BigBuilding,
};
blockList[1] = {
  groupId: 1,
  group: "Testobject2",
  id: 4,
  type: "Building",
  name: "Building",
  rotation: 0,
  texture: Building,
};
blockList[2] = {
  groupId: 1,
  group: "Testobject3",
  id: 5,
  type: "Building",
  name: "Markt",
  rotation: 0,
  texture: Supermarkt,
};
blockList[3] = {
  groupId: 1,
  group: "Testobject4",
  id: 6,
  type: "Building",
  name: "Stadium",
  rotation: 0,
  texture: Stadium,
};
/**function activated by clicking on an block */
function onBlockClick(clickedBlock: any) {
  /** if the selected block is the clicked block, it gets deselected by restoring the default block
   * otherwhise the clicked block is now the selected block.
   */
  if (selectedBlock.block.id == clickedBlock.id) {
    selectedBlock.block = defaultBlock;
  } else {
    selectedBlock.block = clickedBlock;
  }
  /** fires a block select event to mark a selected block change. Sends out this blocks name*/
  emit("block-select-event", selectedBlock.block);
}

/** sets buttons to clickable if create tool is selected, or not clickable if its not */
watch(
  () => bus.value.get("tool-select-event"),
  (val) => {
    if (val == ToolEnum.CREATE) {
      isCreateTool.value = true;
    } else {
      isCreateTool.value = false;
    }
  }
);
</script>

<template>
  
  <div v-for="element in blockList" :key="element.id" id="editor-tool" :class="element.name === selectedBlock.block.name ? 'editor-tool-active' : 'editor-tool-not-active'" @click="onBlockClick(element)">
        <button v-if="element != null" class="editor-tool-btn" :style="{ backgroundImage: `url(${element.texture})` }"/>
        <p v-if="element != null">{{element.name}}</p>
  </div>
  <!--
  <div class="blockListContainer">
    <div v-for="element in blockList" class="blockListElement">
      <button
        :disabled="!isCreateTool"
        :class="
          element.name === selectedBlock.block.name
            ? 'blockListButtonActive'
            : 'blockListButton'
        "
        @click="onBlockClicked(element)"
      >
        <img
          v-if="element != null"
          :src="element.texture"
          class="blockListImg"
        />
      </button>
    </div>
  </div>
  -->
</template>

<style>
  *{
    color: var(--woe-black);
    font-size: 1em;
  }
</style>