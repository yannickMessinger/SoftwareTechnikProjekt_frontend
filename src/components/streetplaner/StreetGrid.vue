<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref, reactive, watch } from "vue";
import type { IGridElement } from "../../services/streetplaner/IGridElement";
import useEventBus from "../../services/eventBus";
import ToolEnum from "../../services/streetplaner/ToolEnum";
const { bus } = useEventBus();

var gridSizeX = 20;
var gridSizeY = 30;
const toolState = reactive({
  tool: ToolEnum.EMPTY,
  block: { id: -1, rotation: 0, name: "", texture: "" },
});

watch(
  () => bus.value.get("tool-select-event"),
  (val) => {
    toolState.tool = val[0];
  }
);
watch(
  () => bus.value.get("block-select-event"),
  (val) => {
    toolState.block = val[0];
  }
);
watch(
  () => bus.value.get("grid-reset-event"),
  (val) => {
    if (val) {
      resetGrid();
    }
  }
);
watch(
  () => bus.value.get("grid-reset-event"),
  (val) => {
    if (val) {
      resetGrid();
    }
  }
);
watch(
  () => bus.value.get("grid-is-valid-event"),
  (val) => {
    if (val) {
      validEvent();
    }
  }
);

// create and initialize streetGrid
const streetGrid: IGridElement[][] = reactive(
  Array(gridSizeX)
    .fill([])
    .map(() => Array(gridSizeY).fill(null))
);
resetGrid();

// initialize gridSize
const gridSize = ref(40);
// initialize gridSizePx used in css
const gridSizePx = computed(() => gridSize.value.toString() + "px");
var mouseDown = false;
var notValidCells: any[] = [];
var validCells = false;
function validTopCell(cellTop: any) {
  if (cellTop === true) {
    return true;
  }
  if (cellTop.name === "Gerade" && cellTop.rotation === 0) {
    return true;
  } else if (
    cellTop.name === "Kurve" &&
    (cellTop.rotation === 0 || cellTop.rotation === 1)
  ) {
    return true;
  } else if (cellTop.name === "Kreuzung") {
    return true;
  } else {
    return false;
  }
}
function validBottomCell(cellBottom: any) {
  if (cellBottom === true) {
    return true;
  }
  if (cellBottom.name === "Gerade" && cellBottom.rotation === 0) {
    return true;
  } else if (
    cellBottom.name === "Kurve" &&
    (cellBottom.rotation === 2 || cellBottom.rotation === 3)
  ) {
    return true;
  } else if (cellBottom.name === "Kreuzung") {
    return true;
  } else {
    return false;
  }
}
function validRightCell(cellRight: any) {
  if (cellRight === true) {
    return true;
  }
  if (cellRight.name === "Gerade" && cellRight.rotation === 1) {
    return true;
  } else if (
    cellRight.name === "Kurve" &&
    (cellRight.rotation === 1 || cellRight.rotation === 2)
  ) {
    return true;
  } else if (cellRight.name === "Kreuzung") {
    return true;
  } else {
    return false;
  }
}
function validLeftCell(cellLeft: any) {
  if (cellLeft === true) {
    return true;
  }
  if (cellLeft.name === "Gerade" && cellLeft.rotation === 1) {
    return true;
  } else if (
    cellLeft.name === "Kurve" &&
    (cellLeft.rotation === 0 || cellLeft.rotation === 3)
  ) {
    return true;
  } else if (cellLeft.name === "Kreuzung") {
    return true;
  } else {
    return false;
  }
}
function validateCell(cell: any) {
  var validTop = false;
  var validRight = false;
  var validLeft = false;
  var validBottom = false;
  var cellTop = cell.posX > 0 ? streetGrid[cell.posX - 1][cell.posY] : true;
  var cellBottom = cell.posX < 19 ? streetGrid[cell.posX + 1][cell.posY] : true;
  var cellRight = cell.posY < 29 ? streetGrid[cell.posX][cell.posY + 1] : true;
  var cellLeft = cell.posY > 0 ? streetGrid[cell.posX][cell.posY - 1] : true;
  if (toolState.block.name === "Gerade") {
    if (cell.rotation === 0) {
      //look on top of block
      validTop = validTopCell(cellTop);
      //look on bottom of block
      validBottom = validBottomCell(cellBottom);
      //everything else true
      validLeft = true;
      validRight = true;
    } else if (cell.rotation === 1) {
      //look on right side of block
      validRight = validRightCell(cellRight);
      //look on left side of block
      validLeft = validLeftCell(cellLeft);
      //everything else true
      validTop = true;
      validBottom = true;
    }
  } else if (toolState.block.name === "Kurve") {
    if (cell.rotation === 0) {
      //look on bottom of block
      validBottom = validBottomCell(cellBottom);
      //look on right side of block
      validRight = validRightCell(cellRight);
      //everything else true
      validTop = true;
      validLeft = true;
    } else if (cell.rotation === 1) {
      //look on bottom of block
      validBottom = validBottomCell(cellBottom);
      //look on left side of block
      validLeft = validLeftCell(cellLeft);
      //everything else true
      validTop = true;
      validRight = true;
    } else if (cell.rotation === 2) {
      //look on top of block
      validTop = validTopCell(cellTop);
      //look on left side of block
      validLeft = validLeftCell(cellLeft);
      //everything else true
      validBottom = true;
      validRight = true;
    } else if (cell.rotation === 3) {
      //look on top of block
      validTop = validTopCell(cellTop);
      //look on right side of block
      validRight = validRightCell(cellRight);
      //everything else true
      validBottom = true;
      validLeft = true;
    }
  } else if (toolState.block.name === "Kreuzung") {
    //look on top of block
    validTop = validTopCell(cellTop);
    //look on right side of block
    validRight = validRightCell(cellRight);
    //look on left side of block
    validLeft = validLeftCell(cellLeft);
    //look on bottom of block
    validBottom = validTopCell(cellBottom);
  } else {
    //look on top of block
    validTop = !validTopCell(cellTop);
    //look on right side of block
    validRight = !validRightCell(cellRight);
    //look on left side of block
    validLeft = !validLeftCell(cellLeft);
    //look on bottom of block
    validBottom = !validTopCell(cellBottom);
  }
  if (validTop && validRight && validLeft && validBottom) {
    return true;
  } else {
    return false;
  }
}
// onClick handles click on specific cell
function onClick(cell: any) {
  // set texture of clicked cell to dummy
  if (toolState.tool === ToolEnum.CREATE && toolState.block.id !== -1) {
    streetGrid[cell.posX][cell.posY].id = toolState.block.id;
    streetGrid[cell.posX][cell.posY].rotation = toolState.block.rotation;
    streetGrid[cell.posX][cell.posY].name = toolState.block.name;
    streetGrid[cell.posX][cell.posY].color = "white";
    streetGrid[cell.posX][cell.posY].texture = toolState.block.texture;
  }
  if (toolState.tool == ToolEnum.ROTATE) {
    streetGrid[cell.posX][cell.posY].rotation =
      (streetGrid[cell.posX][cell.posY].rotation + 1) % 4;
      streetGrid[cell.posX][cell.posY].color = "white";
  }
  if (toolState.tool === ToolEnum.DELETE) {
    streetGrid[cell.posX][cell.posY].id = -1;
    streetGrid[cell.posX][cell.posY].rotation = 0;
    streetGrid[cell.posX][cell.posY].texture = "";
    streetGrid[cell.posX][cell.posY].color = "white";
  }
  var validCell = validateCell(cell);
  if (!validCell) {
    notValidCells.push(cell);
  } else {
    notValidCells = [];
    validCells = true;
  }
}

// onMouseMove sets texture to all cells over which the mouse is moved while the mouse button is pressed
function onMouseMove(cell: any, event: any) {
  if (
    event.buttons === 1 &&
    toolState.tool === ToolEnum.CREATE &&
    toolState.block.id !== -1
  ) {
    streetGrid[cell.posX][cell.posY].id = toolState.block.id;
    streetGrid[cell.posX][cell.posY].rotation = toolState.block.rotation;
    streetGrid[cell.posX][cell.posY].texture = toolState.block.texture;
    streetGrid[cell.posX][cell.posY].color = "white";
  }
  if (event.buttons === 1 && toolState.tool === ToolEnum.DELETE) {
    streetGrid[cell.posX][cell.posY].id = -1;
    streetGrid[cell.posX][cell.posY].rotation = 0;
    streetGrid[cell.posX][cell.posY].texture = "";
    streetGrid[cell.posX][cell.posY].color = "white";
  }
}

function validEvent() {
  if (notValidCells.length > 0) {
    for (let index in notValidCells) {
      var notValidCell = notValidCells[index];
      streetGrid[notValidCell.posX][notValidCell.posY].color = "orangered";
    }
  }
}
function resetGrid() {
  // fill streetGrid with empty IGridElements
  for (let row = 0; row < streetGrid.length; row++) {
    for (let col = 0; col < streetGrid[0].length; col++) {
      streetGrid[row][col] = {
        id: -1,
        posX: row,
        posY: col,
        rotation: 0,
        color: "white",
        texture: "",
      };
    }
  }
}

// disable right click context menu
window.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);
</script>

<template>
  <div v-for="row in streetGrid" class="row no-drag">
    <div
      v-for="ele in row"
      class="grid-item grid-size col no-drag"
      @click="onClick(ele)"
      @mousemove="onMouseMove(ele, $event)"
    >
      <img
        v-if="ele.texture != ''"
        :src="ele.texture"
        class="no-drag grid-img"
        draggable="false"
        :style="{
          transform: 'rotate(' + ele.rotation * 90 + 'deg)',
          'background-color': ele.color,
        }"
      />
    </div>
  </div>
</template>

<style>
.row {
  display: table;
  overflow: scroll;
}
.col {
  display: table-cell;
}
.grid-size {
  min-width: v-bind(gridSizePx);
  max-width: v-bind(gridSizePx);
  min-height: v-bind(gridSizePx);
  max-height: v-bind(gridSizePx);
  width: v-bind(gridSizePx);
  height: v-bind(gridSizePx);
}
.grid-item {
  border: solid 1px black;
}
.grid-img {
  width: 100%;
  height: 100%;
  display: block;
  background-color: ;
}
.no-drag {
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
}
</style>