<script setup lang="ts">
    // Example for event bus, emit event
    import useEventBus from './../../services/eventBus';
    const {emit}=useEventBus();
    function onClick() {
        emit('test1-event', 5);
    }
</script>

<template>
    <button @click="onClick()">Klick mich</button>
</template>