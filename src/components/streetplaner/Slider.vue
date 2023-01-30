<template>
    <div class="container">
        <div class="zoom-img" />
        <input type="range" v-model="gridSize.size" min="10" max="100" @input="onInput" />
    </div>
</template>

<script setup lang="ts">
import { useGridSize } from "../../services/Editor/useGridSize"

const { changeSize, gridSize } = useGridSize()

/**
 * Event handler function for handling input changes to grid size.
 * @param {object} event - Event object triggered by the input change event.
 */
function onInput(event: any) {
    changeSize(event.target.value)
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    gap: 40px;
}

input {
    width: 100%;
}

.zoom-img {
    background-size: cover;
    background-position: center;
    width: 2em;
    height: 2em;
    border: none;
    background-color: transparent;
    background-image: url("../assets/Icons/Zoom_icon.svg");
}
</style>
