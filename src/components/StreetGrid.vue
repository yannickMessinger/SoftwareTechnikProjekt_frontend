<script setup lang="ts">
    import { computed } from '@vue/reactivity';
    import { ref, reactive } from 'vue';
    import type { IGridElement } from '../services/IGridElement';
    import {useStreetGrid} from '../services/useStreetGrid';
    const {setGridState,saveStreetGrid,extractElements} = useStreetGrid();
    var gridSizeX = 20;
    var gridSizeY = 30;

    // create and initialize streetGrid
    const streetGrid: IGridElement[][] = reactive(Array(gridSizeX).fill([]).map(() => Array(gridSizeY).fill(null)));
    // fill streetGrid with empty IGridElements
    for (let row=0; row < gridSizeX; row++) {
        for (let col=0; col < gridSizeY; col++) {
            streetGrid[row][col] = { posX: row, posY: col, texture: ""};
        }
    }

    // initialize gridSize
    const gridSize = ref(40);
    // initialize gridSizePx used in css
    const gridSizePx = computed(() => gridSize.value.toString() + "px");
    var mouseDown = false;

    // onClick handles click on specific cell
    function onClick(cell: any) {
        // set texture of clicked cell to dummy
        streetGrid[cell.posX][cell.posY].texture = "/img/dummy.png";
    }

    // onMouseMove sets texture to all cells over which the mouse is moved while the mouse button is pressed
    function onMouseMove(cell: any, event: any) {
        if (event.buttons === 1) {  
            streetGrid[cell.posX][cell.posY].texture = "/img/dummy.png";
        }
    }
    
    // disable right click context menu
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);


    function saveGrid(){
        setGridState(streetGrid);
        saveStreetGrid();

    }

    
    
</script>

<template>
    <div v-for="row in streetGrid" class="row no-drag">
        <div v-for="ele in row" class="grid-item grid-size col no-drag" @click="onClick(ele)" @mousemove="onMouseMove(ele, $event)">
            <img v-if="ele.texture != ''" :src="ele.texture" class="no-drag grid-img" draggable="false"/>
        </div>
    </div>

    <button @click="saveGrid()">show grid</button>
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
        border: solid 1px gray;
    }
    .grid-img {
        width: 100%;
        height: 100%;
        display: block;
    }
    .no-drag {  
        user-select: none;
        -webkit-user-drag: none; 
        -khtml-user-drag: none; 
        -moz-user-drag: none; 
        -o-user-drag: none; 
    }
</style>