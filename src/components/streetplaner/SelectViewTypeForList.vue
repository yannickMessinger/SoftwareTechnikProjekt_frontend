
<script>
import ListBlocksComponent from "../streetplaner/ListBlocksComponent.vue";
import BuildingBlocksComponent from "../streetplaner/BuildingBlocksComponent.vue";
export default {
  components: {
    ListBlocksComponent: ListBlocksComponent,
    BuildingBlocksComponent: BuildingBlocksComponent,
  },
  data() {
    return {
      viewType: "noDataPicked",
    };
  },
  methods: {
    handleClick(element) {
      this.viewType = element;
    },
  },
};
</script>

<template>
  <!--display container for block list-->
  <h2 class="blockListTitle">Block List</h2>
  <div class="selectView">
    Select View <br />
    <button @click="handleClick('street')">STREET</button>
    <button @click="handleClick('building')">BUILDINGS</button>
  </div>
  <div v-if="viewType === 'street'">
    <ListBlocksComponent />
  </div>
  <div v-else-if="viewType === 'building'">
      <BuildingBlocksComponent />
  </div>
</template>

<style>
.blockListTitle {
  color: black;
  background-color: white;
  text-align: center;
  margin: 5%;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}

.selectView {
  padding-left: 13px;
}
/** style for list element in block list*/
.blockListElement {
  margin: 1%;
  display: inline-flex;
  max-height: 45%;
  max-width: 45%;
}
/** style for images in list element*/
.blockListImg {
  width: 100%;
  height: 100%;
}
/** style for buttons in list element */
.blockListButton {
  border: solid 2px black;
  background-color: darkgray;
}
/** style for clicked buttons in list element */
.blockListButtonActive {
  border: solid 2px black;
  background-color: orange;
}
</style>