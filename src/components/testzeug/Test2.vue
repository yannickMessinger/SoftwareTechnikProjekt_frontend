<script setup lang="ts">
    // Example for event bus, on event
    import { ref, watch } from 'vue';
    import useEventBus from '../../services/eventBus';
    const { bus } = useEventBus();
    const x = ref(0);
    watch(() =>  bus.value.get('test1-event'), (val) => {
        x.value = val[0];
    });   
</script>

<template>
    <p>Zahl ist: {{ x }}</p>
</template>