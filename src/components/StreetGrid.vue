<script setup lang="ts">
    import { computed } from '@vue/reactivity';
    import { ref, reactive } from 'vue';
    import type { IGridElement } from '../services/IGridElement';
    var gridSizeX = 20;
    var gridSizeY = 30;
    var streetGrid: IGridElement[][] = reactive(Array(gridSizeX).fill([]).map(() => Array(gridSizeY).fill(null)));
    for (let row=0; row < gridSizeX; row++) {
        for (let col=0; col < gridSizeY; col++) {
            streetGrid[row][col] = { posX: row, posY: col, texture: ""};
        }
    }
    const gridSize = ref(40);
    const gridSizePx = computed(() => gridSize.value.toString() + "px");
    var mouseDown = false;

    function onClick(cell: any) {
        streetGrid[cell.posX][cell.posY].texture = "/img/dummy.png";
    }
    function onMouseDown(cell: any) {
        mouseDown = true;
    }
    function onMouseMove(cell: any) {
        if (mouseDown) {  
            streetGrid[cell.posX][cell.posY].texture = "/img/dummy.png";
        }
    }
    function onMouseUp(cell: any) {
        mouseDown = false;
    }
</script>

<template>
    <div v-for="row in streetGrid" class="row">
        <div v-for="ele in row" class="grid-item grid-size col" @click="onClick(ele)" @mousedown="onMouseDown(ele)" @mousemove="onMouseMove(ele)" @mouseup="onMouseUp(ele)">
            <img v-if="ele.texture != ''" :src="ele.texture" class="grid-img" draggable="false"/>
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
        border: solid 1px gray;
    }
    .grid-img {
        width: 100%;
        height: 100%;
        display: block;
    }
    img {  
        user-select: none;
    }
</style>