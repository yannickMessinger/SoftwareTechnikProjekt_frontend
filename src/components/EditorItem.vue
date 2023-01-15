<template>
    <div class="placeholder">
        <p>Placeholder</p>
    </div>
</template>

<script setup lang="ts">
import ref from "vue"

const props = defineProps({
    items: {
        type: Object,
        required: false,
    },
})
</script>

<style>
.placeholder {
    background-image: url("https://picsum.photos/100");
    display: inline-block;
}
</style>
