<script setup lang="ts">
    import { computed } from '@vue/reactivity';
    import { ref } from 'vue';
    import type { IGridElement } from '../services/IGridElement';
    var gridSizeX = 20;
    var gridSizeY = 30;
    var streetGrid: IGridElement[][] = Array(gridSizeX).fill([]).map(() => Array(gridSizeY).fill(null));
    for (let i = 0; i < 5; i++) {
        var x = Math.floor(Math.random() * gridSizeX);
        var y = Math.floor(Math.random() * gridSizeY);
        streetGrid[x][y] = { posX: x, posY: y, texture: "/img/dummy.png"};
    }
    const gridSize = ref(40);
    const gridSizePx = computed(() => gridSize.value.toString() + "px");
</script>

<template>
    <div v-for="row in streetGrid" class="row">
        <div v-for="ele in row" class="grid-item grid-size col">
            <img v-if="ele != null" :src="ele.texture" class="grid-img"/>
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
</style>